import { Router, type IRouter, type Request, type Response } from "express";
import { db, julesAnalysesTable, type JulesAnalysis } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router: IRouter = Router();

const JULES_BASE = "https://jules.googleapis.com/v1alpha";

function getJulesHeaders(): Record<string, string> {
  const key = process.env.JULES_API_KEY;
  if (!key) throw new Error("JULES_API_KEY not configured");
  return {
    "X-Goog-Api-Key": key,
    "Content-Type": "application/json",
  };
}

function parseRepoUrl(url: string): { owner: string; name: string } | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("github.com")) return null;
    const parts = parsed.pathname.replace(/^\//, "").split("/");
    const owner = parts[0];
    const name = parts[1]?.replace(".git", "");
    if (!owner || !name) return null;
    return { owner, name };
  } catch {
    return null;
  }
}

function buildSecurityPrompt(owner: string, name: string): string {
  return `You are an expert security code reviewer. Analyze the GitHub repository https://github.com/${owner}/${name} for security vulnerabilities.

Check for:
1. Hardcoded secrets, API keys, tokens, and credentials in source code
2. SQL injection vulnerabilities
3. Cross-Site Scripting (XSS) vulnerabilities
4. Cross-Site Request Forgery (CSRF) vulnerabilities
5. Authentication and authorization issues (broken access control)
6. Sensitive data exposure (PII, passwords in logs, etc.)
7. Security misconfigurations (CORS, CSP, open redirects)
8. Vulnerable or outdated dependencies
9. Insecure direct object references
10. Missing input validation or sanitization

For each finding, provide:
- Severity level: critical, high, medium, or low
- A clear, concise title
- Description of the vulnerability and why it is dangerous
- The file path and line number where applicable
- A concrete fix suggestion

End your analysis with EXACTLY this JSON block (no extra text after):

\`\`\`json
{
  "riskLevel": "critical",
  "totalFindings": 3,
  "criticalCount": 1,
  "highCount": 1,
  "mediumCount": 1,
  "lowCount": 0,
  "findings": [
    {
      "severity": "critical",
      "title": "Hardcoded Stripe Secret Key",
      "description": "A live Stripe secret key is hardcoded in the config file and will be exposed in the public repository.",
      "file": "src/config.js",
      "line": 12,
      "fixSuggestion": "Remove the key from source code and load it from an environment variable: process.env.STRIPE_SECRET_KEY"
    }
  ]
}
\`\`\``;
}

interface JulesActivity {
  name: string;
  createTime: string;
  planGenerated?: { plan: string };
  progressUpdated?: { message: string };
  sessionCompleted?: { message: string };
}

interface JulesResult {
  riskLevel: string;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  findings: Array<{
    severity: string;
    title: string;
    description: string;
    file?: string;
    line?: number;
    fixSuggestion: string;
  }>;
}

function extractJsonFromMessage(message: string): JulesResult | null {
  try {
    const match = message.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
      return JSON.parse(match[1]) as JulesResult;
    }
    const jsonMatch = message.match(/\{[\s\S]*"findings"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as JulesResult;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

async function pollAndUpdateJulesStatus(analysis: JulesAnalysis): Promise<void> {
  if (!analysis.julesSessionId) return;

  try {
    const sessionId = analysis.julesSessionId.includes("/")
      ? analysis.julesSessionId.split("/").pop()!
      : analysis.julesSessionId;

    const activitiesRes = await fetch(
      `${JULES_BASE}/sessions/${sessionId}/activities`,
      { headers: getJulesHeaders() }
    );

    if (!activitiesRes.ok) return;

    const data = (await activitiesRes.json()) as { activities?: JulesActivity[] };
    const activities: JulesActivity[] = data.activities || [];

    const lastProgress = activities
      .filter((a) => a.progressUpdated)
      .at(-1);

    const completed = activities.find((a) => a.sessionCompleted);

    if (completed) {
      const message = completed.sessionCompleted?.message || "";
      const result = extractJsonFromMessage(message);

      await db
        .update(julesAnalysesTable)
        .set({
          status: "completed",
          result: result ?? { rawMessage: message.slice(0, 5000) },
          completedAt: new Date(),
        })
        .where(eq(julesAnalysesTable.id, analysis.id));
      return;
    }

    if (lastProgress?.progressUpdated?.message) {
      await db
        .update(julesAnalysesTable)
        .set({ progressMessage: lastProgress.progressUpdated.message.slice(0, 500) })
        .where(eq(julesAnalysesTable.id, analysis.id));
    }
  } catch {
    // polling errors are non-fatal
  }
}

function isValidUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

router.post("/jules-scan", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { repoUrl } = req.body as { repoUrl?: unknown };
  if (!isValidUrl(repoUrl)) {
    res.status(400).json({ error: "URL do repositório inválida" });
    return;
  }
  const repo = parseRepoUrl(repoUrl);
  if (!repo) {
    res.status(400).json({ error: "Por favor, informe uma URL válida de repositório GitHub público" });
    return;
  }

  const userId = req.user!.id;

  const [analysis] = await db
    .insert(julesAnalysesTable)
    .values({
      userId,
      repoUrl,
      repoOwner: repo.owner,
      repoName: repo.name,
      status: "pending",
    })
    .returning();

  setImmediate(async () => {
    try {
      const prompt = buildSecurityPrompt(repo.owner, repo.name);
      const sessionRes = await fetch(`${JULES_BASE}/sessions`, {
        method: "POST",
        headers: getJulesHeaders(),
        body: JSON.stringify({
          prompt,
          sourceContext: {
            source: `sources/github/${repo.owner}/${repo.name}`,
          },
          requirePlanApproval: false,
        }),
      });

      if (!sessionRes.ok) {
        const errBody = await sessionRes.text();
        await db
          .update(julesAnalysesTable)
          .set({
            status: "failed",
            errorMessage: `Jules API error ${sessionRes.status}: ${errBody.slice(0, 500)}`,
          })
          .where(eq(julesAnalysesTable.id, analysis.id));
        return;
      }

      const session = (await sessionRes.json()) as { id?: string; name?: string };
      const sessionId = session.id || session.name || "";

      await db
        .update(julesAnalysesTable)
        .set({ status: "running", julesSessionId: sessionId })
        .where(eq(julesAnalysesTable.id, analysis.id));
    } catch (err) {
      await db
        .update(julesAnalysesTable)
        .set({ status: "failed", errorMessage: String(err) })
        .where(eq(julesAnalysesTable.id, analysis.id));
    }
  });

  res.status(201).json({ id: analysis.id, status: "pending" });
});

router.get("/jules-scan", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const analyses = await db
    .select()
    .from(julesAnalysesTable)
    .where(eq(julesAnalysesTable.userId, req.user!.id))
    .orderBy(desc(julesAnalysesTable.createdAt))
    .limit(20);

  res.json({ analyses });
});

router.get("/jules-scan/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [analysis] = await db
    .select()
    .from(julesAnalysesTable)
    .where(
      and(
        eq(julesAnalysesTable.id, String(req.params.id)),
        eq(julesAnalysesTable.userId, req.user!.id)
      )
    );

  if (!analysis) {
    res.status(404).json({ error: "Análise não encontrada" });
    return;
  }

  if (analysis.status === "running" && analysis.julesSessionId) {
    await pollAndUpdateJulesStatus(analysis);
    const [updated] = await db
      .select()
      .from(julesAnalysesTable)
      .where(eq(julesAnalysesTable.id, analysis.id));
    res.json(updated);
    return;
  }

  res.json(analysis);
});

export default router;
