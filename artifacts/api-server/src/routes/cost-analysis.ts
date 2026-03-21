import { Router, type IRouter, type Request, type Response } from "express";
import { db, githubVerificationsTable, costAnalysesTable } from "@workspace/db";
import { and, eq, desc } from "drizzle-orm";
import { execFile } from "child_process";
import { promisify } from "util";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { CreateCostAnalysisBody } from "@workspace/api-zod";

const execFileAsync = promisify(execFile);
const router: IRouter = Router();

interface SccFileResult {
  Name: string;
  Lines: number;
  Code: number;
  Comment: number;
  Blank: number;
  Complexity: number;
  WeightedComplexity: number;
  Files: number;
  Bytes: number;
  Cost: number;
}

function formatCostResult(sccOutput: SccFileResult[]) {
  const HOURLY_RATE = 56;

  let totalCost = 0;
  let totalLines = 0;
  let totalHours = 0;

  const languageBreakdown = sccOutput.map((lang) => {
    const lines = lang.Code || 0;
    const complexity = lang.Complexity || 0;
    const estimatedMonths = (2.4 * Math.pow((lines / 1000) * 1.12, 1.05)) || 0;
    const estimatedHours = estimatedMonths * 152;
    const estimatedCost = estimatedHours * HOURLY_RATE;

    totalLines += lines;
    totalHours += estimatedHours;
    totalCost += estimatedCost;

    return {
      language: lang.Name,
      lines,
      complexity,
      estimatedCost: Math.round(estimatedCost * 100) / 100,
      estimatedHours: Math.round(estimatedHours * 100) / 100,
    };
  });

  languageBreakdown.sort((a, b) => b.estimatedCost - a.estimatedCost);

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    totalHours: Math.round(totalHours * 100) / 100,
    totalLines,
    languageBreakdown,
  };
}

router.get("/cost-analysis", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userId = req.user!.id;

  const analyses = await db
    .select()
    .from(costAnalysesTable)
    .where(eq(costAnalysesTable.userId, userId))
    .orderBy(desc(costAnalysesTable.createdAt));

  const result = analyses.map((a) => ({
    id: a.id,
    repoUrl: a.repoUrl,
    repoSlug: a.repoSlug,
    totalCost: parseFloat(a.totalCost),
    totalHours: parseFloat(a.totalHours),
    totalLines: parseInt(a.totalLines, 10),
    languageBreakdown: a.languageBreakdown as object[],
    createdAt: a.createdAt.toISOString(),
  }));

  res.json({ analyses: result });
});

router.post("/cost-analysis", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateCostAnalysisBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "repoSlug inválido" });
    return;
  }

  const { repoSlug } = parsed.data;
  const userId = req.user!.id;

  const [verification] = await db
    .select()
    .from(githubVerificationsTable)
    .where(
      and(
        eq(githubVerificationsTable.userId, userId),
        eq(githubVerificationsTable.repoSlug, repoSlug),
        eq(githubVerificationsTable.verified, true),
      ),
    );

  if (!verification) {
    res.status(400).json({ error: "Repositório não verificado. Verifique a propriedade do repositório primeiro." });
    return;
  }

  const repoUrl = `https://github.com/${repoSlug}.git`;
  let tempDir: string | null = null;

  try {
    tempDir = await mkdtemp(path.join(tmpdir(), "saffe-repo-"));
    const repoDir = path.join(tempDir, "repo");

    await execFileAsync("git", ["clone", "--depth=1", repoUrl, repoDir], {
      timeout: 120000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });

    const { stdout: sccOutput } = await execFileAsync("scc", ["--format", "json", repoDir], {
      timeout: 60000,
      maxBuffer: 10 * 1024 * 1024,
    });

    const sccData: SccFileResult[] = JSON.parse(sccOutput);
    const { totalCost, totalHours, totalLines, languageBreakdown } = formatCostResult(sccData);

    const [analysis] = await db
      .insert(costAnalysesTable)
      .values({
        userId,
        githubVerificationId: verification.id,
        repoUrl: verification.repoUrl,
        repoSlug,
        totalCost: totalCost.toString(),
        totalHours: totalHours.toString(),
        totalLines: totalLines.toString(),
        languageBreakdown,
      })
      .returning();

    res.status(201).json({
      id: analysis.id,
      repoUrl: analysis.repoUrl,
      repoSlug: analysis.repoSlug,
      totalCost,
      totalHours,
      totalLines,
      languageBreakdown,
      createdAt: analysis.createdAt.toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    req.log?.error({ err }, "Cost analysis failed");
    res.status(400).json({ error: `Falha na análise: ${message}` });
  } finally {
    if (tempDir) {
      rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
});

router.get("/cost-analysis/:analysisId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { analysisId } = req.params;
  const userId = req.user!.id;

  const [analysis] = await db
    .select()
    .from(costAnalysesTable)
    .where(and(eq(costAnalysesTable.id, analysisId), eq(costAnalysesTable.userId, userId)));

  if (!analysis) {
    res.status(404).json({ error: "Análise não encontrada" });
    return;
  }

  res.json({
    id: analysis.id,
    repoUrl: analysis.repoUrl,
    repoSlug: analysis.repoSlug,
    totalCost: parseFloat(analysis.totalCost),
    totalHours: parseFloat(analysis.totalHours),
    totalLines: parseInt(analysis.totalLines, 10),
    languageBreakdown: analysis.languageBreakdown as object[],
    createdAt: analysis.createdAt.toISOString(),
  });
});

export default router;
