import { Router, type IRouter, type Request, type Response } from "express";
import { db, scansTable, scanResultsTable, domainVerificationsTable } from "@workspace/db";
import { and, eq, desc } from "drizzle-orm";
import { CreateScanBody, GetScanParams, SendScanReportBody, SendScanReportParams } from "@workspace/api-zod";
import { runSecurityScan, checksToInsertResults } from "../lib/scanner";
import { sendScanReportEmail } from "../lib/email";

const router: IRouter = Router();

router.get("/scans", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userId = req.user!.id;

  const scans = await db
    .select()
    .from(scansTable)
    .where(eq(scansTable.userId, userId))
    .orderBy(desc(scansTable.createdAt));

  res.json({ scans });
});

router.post("/scans", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateScanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "URL inválida" });
    return;
  }

  const { url } = parsed.data;
  const userId = req.user!.id;

  let domain: string;
  try {
    domain = new URL(url).hostname;
  } catch {
    res.status(400).json({ error: "URL inválida" });
    return;
  }

  const [verification] = await db
    .select()
    .from(domainVerificationsTable)
    .where(and(eq(domainVerificationsTable.userId, userId), eq(domainVerificationsTable.domain, domain), eq(domainVerificationsTable.verified, true)));

  if (!verification) {
    res.status(400).json({ error: "Domínio não verificado. Você precisa verificar que é dono deste domínio antes de escanear." });
    return;
  }

  const [scan] = await db
    .insert(scansTable)
    .values({ userId, url, domain, status: "running" })
    .returning();

  res.status(201).json({ scanId: scan.id, status: "running" });

  setImmediate(async () => {
    try {
      const { checks, riskLevel } = await runSecurityScan(url);
      const results = checksToInsertResults(scan.id, checks);

      if (results.length > 0) {
        await db.insert(scanResultsTable).values(results);
      }

      await db
        .update(scansTable)
        .set({ status: "completed", riskLevel, completedAt: new Date() })
        .where(eq(scansTable.id, scan.id));
    } catch (err) {
      await db.update(scansTable).set({ status: "failed" }).where(eq(scansTable.id, scan.id));
    }
  });
});

router.get("/scans/:scanId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = GetScanParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const userId = req.user!.id;
  const { scanId } = params.data;

  const [scan] = await db
    .select()
    .from(scansTable)
    .where(and(eq(scansTable.id, scanId), eq(scansTable.userId, userId)));

  if (!scan) {
    res.status(404).json({ error: "Scan não encontrado" });
    return;
  }

  const results = await db
    .select()
    .from(scanResultsTable)
    .where(eq(scanResultsTable.scanId, scanId));

  res.json({ ...scan, results });
});

router.post("/scans/:scanId/send-email", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = SendScanReportParams.safeParse(req.params);
  const body = SendScanReportBody.safeParse(req.body);

  if (!params.success || !body.success) {
    res.status(400).json({ error: "Dados inválidos" });
    return;
  }

  const userId = req.user!.id;
  const { scanId } = params.data;
  const { email } = body.data;

  const [scan] = await db
    .select()
    .from(scansTable)
    .where(and(eq(scansTable.id, scanId), eq(scansTable.userId, userId)));

  if (!scan) {
    res.status(404).json({ error: "Scan não encontrado" });
    return;
  }

  if (scan.status !== "completed") {
    res.status(400).json({ error: "O scan ainda não foi concluído" });
    return;
  }

  const results = await db
    .select()
    .from(scanResultsTable)
    .where(eq(scanResultsTable.scanId, scanId));

  const result = await sendScanReportEmail(email, scan, results);

  if (!result.success) {
    req.log.error({ error: result.error }, "Failed to send email");
    res.status(500).json({ error: "Falha ao enviar e-mail: " + (result.error || "Erro desconhecido") });
    return;
  }

  res.json({ success: true, message: "Relatório enviado com sucesso para " + email });
});

export default router;
