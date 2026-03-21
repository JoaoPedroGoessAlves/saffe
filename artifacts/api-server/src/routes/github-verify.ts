import { Router, type IRouter, type Request, type Response } from "express";
import crypto from "crypto";
import { db, githubVerificationsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { InitGithubVerificationBody, ConfirmGithubVerificationBody } from "@workspace/api-zod";

const router: IRouter = Router();

function parseRepoUrl(repoUrl: string): { owner: string; repo: string; slug: string } | null {
  try {
    const url = new URL(repoUrl);
    if (url.hostname !== "github.com") return null;
    const parts = url.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
    if (parts.length < 2) return null;
    const [owner, repo] = parts;
    if (!owner || !repo) return null;
    return { owner, repo, slug: `${owner}/${repo}` };
  } catch {
    return null;
  }
}

async function checkVerifyFile(owner: string, repo: string, token: string): Promise<boolean> {
  try {
    const rawUrl = `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/HEAD/saffe-verify.txt`;
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    const response = await fetch(rawUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Saffe-Verification/1.0" },
    });
    if (!response.ok) return false;
    const text = await response.text();
    return text.trim() === token;
  } catch {
    return false;
  }
}

router.post("/github-verify/init", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = InitGithubVerificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "URL do repositório inválida" });
    return;
  }

  const { repoUrl } = parsed.data;

  const repoInfo = parseRepoUrl(repoUrl);
  if (!repoInfo) {
    res.status(400).json({ error: "URL do repositório inválida. Use https://github.com/owner/repo" });
    return;
  }

  const { owner, repo, slug } = repoInfo;
  const userId = req.user!.id;

  const existing = await db
    .select()
    .from(githubVerificationsTable)
    .where(and(eq(githubVerificationsTable.userId, userId), eq(githubVerificationsTable.repoSlug, slug)));

  if (existing[0]?.verified) {
    res.json({
      repoUrl: existing[0].repoUrl,
      repoSlug: slug,
      token: existing[0].token,
      instructions: `Add a file named \`saffe-verify.txt\` to the root of your repository (${slug}) with the content: ${existing[0].token}`,
      alreadyVerified: true,
    });
    return;
  }

  const token = existing[0]?.token ?? crypto.randomBytes(16).toString("hex");

  if (!existing[0]) {
    await db.insert(githubVerificationsTable).values({
      userId,
      repoUrl: `https://github.com/${slug}`,
      repoSlug: slug,
      token,
      verified: false,
    });
  }

  res.json({
    repoUrl: `https://github.com/${owner}/${repo}`,
    repoSlug: slug,
    token,
    instructions: `Add a file named \`saffe-verify.txt\` to the root of your repository (${slug}) with the content: ${token}`,
    alreadyVerified: false,
  });
});

router.post("/github-verify/confirm", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = ConfirmGithubVerificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "repoSlug inválido" });
    return;
  }

  const { repoSlug } = parsed.data;
  const userId = req.user!.id;

  const [verification] = await db
    .select()
    .from(githubVerificationsTable)
    .where(and(eq(githubVerificationsTable.userId, userId), eq(githubVerificationsTable.repoSlug, repoSlug)));

  if (!verification) {
    res.status(404).json({ error: "Verificação não encontrada. Inicie o processo primeiro." });
    return;
  }

  if (verification.verified) {
    res.json({ verified: true, repoSlug, message: "Repositório já verificado." });
    return;
  }

  const parts = repoSlug.split("/");
  if (parts.length !== 2) {
    res.status(400).json({ error: "repoSlug inválido" });
    return;
  }
  const [owner, repo] = parts;

  const verified = await checkVerifyFile(owner, repo, verification.token);

  if (!verified) {
    res.json({
      verified: false,
      repoSlug,
      message: `Arquivo saffe-verify.txt não encontrado ou token inválido. Certifique-se de ter adicionado o arquivo ao root do repositório com o conteúdo: ${verification.token}`,
    });
    return;
  }

  await db
    .update(githubVerificationsTable)
    .set({ verified: true, verifiedAt: new Date() })
    .where(and(eq(githubVerificationsTable.userId, userId), eq(githubVerificationsTable.repoSlug, repoSlug)));

  res.json({ verified: true, repoSlug, message: "Repositório verificado com sucesso!" });
});

export default router;
