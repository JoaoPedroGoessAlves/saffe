import { Router, type IRouter, type Request, type Response } from "express";
import { db, julesAnalysesTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { ai } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

const GITHUB_API_BASE = "https://api.github.com";

function parseRepoUrl(url: string): { owner: string; name: string } | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com") return null;
    const parts = parsed.pathname.replace(/^\//, "").split("/");
    const owner = parts[0];
    const name = parts[1]?.replace(".git", "");
    if (!owner || !name) return null;
    return { owner, name };
  } catch {
    return null;
  }
}

const SECURITY_RELEVANT_PATTERNS = [
  /\.env/i,
  /config/i,
  /auth/i,
  /secret/i,
  /credential/i,
  /password/i,
  /token/i,
  /key/i,
  /dockerfile/i,
  /docker-compose/i,
  /route/i,
  /middleware/i,
  /server/i,
  /app\.(js|ts|py|rb|go)/i,
  /index\.(js|ts|py|rb|go)/i,
  /main\.(js|ts|py|rb|go)/i,
  /security/i,
  /permission/i,
  /access/i,
  /login/i,
  /signup/i,
  /register/i,
  /\.yml/i,
  /\.yaml/i,
  /requirements\.txt/i,
  /package\.json/i,
  /gemfile/i,
];

function isSecurityRelevant(filePath: string): boolean {
  return SECURITY_RELEVANT_PATTERNS.some((pat) => pat.test(filePath));
}

interface GitHubRepoInfo {
  default_branch: string;
}

interface GitHubTreeItem {
  path: string;
  type: "blob" | "tree";
  size?: number;
  url?: string;
  sha?: string;
}

interface GitHubTreeResponse {
  tree: GitHubTreeItem[];
  truncated?: boolean;
}

interface GitHubFileContent {
  content: string;
  encoding: string;
}

interface ScanResult {
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

async function getDefaultBranch(owner: string, name: string): Promise<string> {
  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${name}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "saffe-security-scanner" },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${body}`);
  }
  const data = (await res.json()) as GitHubRepoInfo;
  return data.default_branch;
}

async function getRepoFileTree(
  owner: string,
  name: string,
  branch: string
): Promise<GitHubTreeItem[]> {
  const res = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${name}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "saffe-security-scanner" },
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${body}`);
  }
  const data = (await res.json()) as GitHubTreeResponse;
  return data.tree || [];
}

async function fetchFileContent(
  owner: string,
  name: string,
  filePath: string,
  branch: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${name}/contents/${filePath}?ref=${encodeURIComponent(branch)}`,
      {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "saffe-security-scanner" },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as GitHubFileContent;
    if (data.encoding === "base64") {
      return Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
    }
    return data.content;
  } catch {
    return null;
  }
}

async function collectRepoCode(
  owner: string,
  name: string,
  branch: string
): Promise<string> {
  const tree = await getRepoFileTree(owner, name, branch);
  const blobs = tree.filter((item) => item.type === "blob" && item.path);

  const relevant = blobs
    .filter((item) => isSecurityRelevant(item.path))
    .sort((a, b) => (a.size ?? 0) - (b.size ?? 0))
    .slice(0, 60);

  const MAX_TOTAL_BYTES = 150 * 1024;
  let totalBytes = 0;
  const codeBlocks: string[] = [];

  for (const item of relevant) {
    if (totalBytes >= MAX_TOTAL_BYTES) break;
    const content = await fetchFileContent(owner, name, item.path, branch);
    if (!content) continue;
    const chunk = content.slice(0, 20000);
    const block = `\n\n--- FILE: ${item.path} ---\n${chunk}`;
    totalBytes += block.length;
    codeBlocks.push(block);
  }

  return codeBlocks.join("") || "(no security-relevant files found in this repository)";
}

function buildSecurityPrompt(owner: string, name: string, code: string): string {
  return `You are an expert security code reviewer. Analyze the following code from the GitHub repository https://github.com/${owner}/${name} for security vulnerabilities.

Repository code:
${code}

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

function extractJsonFromMessage(message: string): ScanResult | null {
  try {
    const match = message.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
      return JSON.parse(match[1]) as ScanResult;
    }
    const jsonMatch = message.match(/\{[\s\S]*"findings"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ScanResult;
    }
  } catch {
    // ignore parse errors
  }
  return null;
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

async function runDeepScan(analysisId: string, owner: string, name: string): Promise<void> {
  try {
    await db
      .update(julesAnalysesTable)
      .set({ status: "running", progressMessage: "Fetching repository info..." })
      .where(eq(julesAnalysesTable.id, analysisId));

    const defaultBranch = await getDefaultBranch(owner, name);

    await db
      .update(julesAnalysesTable)
      .set({ progressMessage: `Collecting source files from branch '${defaultBranch}'...` })
      .where(eq(julesAnalysesTable.id, analysisId));

    const code = await collectRepoCode(owner, name, defaultBranch);

    await db
      .update(julesAnalysesTable)
      .set({ progressMessage: "Running AI security analysis..." })
      .where(eq(julesAnalysesTable.id, analysisId));

    const prompt = buildSecurityPrompt(owner, name, code);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    const message = response.text ?? "";
    if (!message) {
      throw new Error("Gemini returned an empty response");
    }

    const result = extractJsonFromMessage(message);

    await db
      .update(julesAnalysesTable)
      .set({
        status: "completed",
        result: result ?? { rawMessage: message.slice(0, 5000) },
        completedAt: new Date(),
        progressMessage: null,
      })
      .where(eq(julesAnalysesTable.id, analysisId));
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : String(err);
    await db
      .update(julesAnalysesTable)
      .set({
        status: "failed",
        errorMessage: errorMessage.slice(0, 1000),
        progressMessage: null,
      })
      .where(eq(julesAnalysesTable.id, analysisId));
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

  setImmediate(() => {
    void runDeepScan(analysis.id, repo.owner, repo.name);
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

  res.json(analysis);
});

export default router;
