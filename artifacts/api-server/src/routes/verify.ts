import { Router, type IRouter, type Request, type Response } from "express";
import crypto from "crypto";
import dns from "dns/promises";
import { isIP } from "net";
import { db, domainVerificationsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { InitDomainVerificationBody, ConfirmDomainVerificationBody } from "@workspace/api-zod";

const router: IRouter = Router();

function isPrivateIP(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p))) {
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 0) return true;
  }
  const lower = ip.toLowerCase();
  if (lower === "::1") return true;
  if (lower.startsWith("fe80:")) return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  return false;
}

async function assertPublicHost(hostname: string): Promise<void> {
  if (isIP(hostname)) {
    if (isPrivateIP(hostname)) throw new Error(`SSRF blocked: private IP ${hostname}`);
    return;
  }
  const addresses = await dns.lookup(hostname, { all: true });
  for (const { address } of addresses) {
    if (isPrivateIP(address)) {
      throw new Error(`SSRF blocked: ${hostname} resolves to private IP ${address}`);
    }
  }
}

function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return null;
  }
}

async function safeRedirectFetch(
  initialUrl: string,
  signal: AbortSignal,
  maxRedirects = 5,
): Promise<globalThis.Response> {
  let currentUrl = initialUrl;
  let hopsLeft = maxRedirects;

  while (true) {
    const fetchResponse = await fetch(currentUrl, {
      signal,
      redirect: "manual",
      headers: { "User-Agent": "Saffe-Verification/1.0" },
    });

    if (fetchResponse.status >= 300 && fetchResponse.status < 400) {
      if (hopsLeft <= 0) throw new Error("Too many redirects");
      const location = fetchResponse.headers.get("location");
      if (!location) throw new Error("Redirect without Location header");
      const nextUrl = new URL(location, currentUrl).href;
      if (!nextUrl.startsWith("http://") && !nextUrl.startsWith("https://")) {
        throw new Error(`Redirect to disallowed protocol blocked`);
      }
      await assertPublicHost(new URL(nextUrl).hostname);
      currentUrl = nextUrl;
      hopsLeft--;
      continue;
    }

    return fetchResponse;
  }
}

async function checkMetaTag(url: string, token: string): Promise<boolean> {
  try {
    const parsed = new URL(url);
    await assertPublicHost(parsed.hostname);
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    const response = await safeRedirectFetch(url, controller.signal);
    const body = await response.text();
    const expectedTag = `saffe-verify" content="${token}"`;
    return body.includes(expectedTag);
  } catch {
    return false;
  }
}

router.post("/verify/init", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = InitDomainVerificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "URL inválida" });
    return;
  }

  const { url } = parsed.data;
  const domain = extractDomain(url);
  if (!domain) {
    res.status(400).json({ error: "URL inválida, não foi possível extrair o domínio" });
    return;
  }

  const userId = req.user!.id;

  const existing = await db
    .select()
    .from(domainVerificationsTable)
    .where(and(eq(domainVerificationsTable.userId, userId), eq(domainVerificationsTable.domain, domain)));

  if (existing[0]?.verified) {
    res.json({
      domain,
      token: existing[0].token,
      metaTag: `<meta name="saffe-verify" content="${existing[0].token}">`,
      alreadyVerified: true,
    });
    return;
  }

  const token = existing[0]?.token ?? crypto.randomBytes(16).toString("hex");

  if (!existing[0]) {
    await db.insert(domainVerificationsTable).values({
      userId,
      domain,
      token,
      verified: false,
    });
  }

  res.json({
    domain,
    token,
    metaTag: `<meta name="saffe-verify" content="${token}">`,
    alreadyVerified: false,
  });
});

router.post("/verify/confirm", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = ConfirmDomainVerificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Domínio inválido" });
    return;
  }

  const { domain } = parsed.data;
  const userId = req.user!.id;

  const [verification] = await db
    .select()
    .from(domainVerificationsTable)
    .where(and(eq(domainVerificationsTable.userId, userId), eq(domainVerificationsTable.domain, domain)));

  if (!verification) {
    res.status(404).json({ error: "Verificação não encontrada. Inicie o processo de verificação primeiro." });
    return;
  }

  if (verification.verified) {
    res.json({ verified: true, domain, message: "Domínio já verificado." });
    return;
  }

  const url = `https://${domain}`;
  const verified = await checkMetaTag(url, verification.token);

  if (!verified) {
    const httpUrl = `http://${domain}`;
    const verifiedHttp = await checkMetaTag(httpUrl, verification.token);

    if (!verifiedHttp) {
      res.json({
        verified: false,
        domain,
        message: `Meta tag não encontrada. Certifique-se de ter adicionado <meta name="saffe-verify" content="${verification.token}"> dentro do <head> do seu site e que as alterações estejam publicadas.`,
      });
      return;
    }
  }

  await db
    .update(domainVerificationsTable)
    .set({ verified: true, verifiedAt: new Date() })
    .where(and(eq(domainVerificationsTable.userId, userId), eq(domainVerificationsTable.domain, domain)));

  res.json({ verified: true, domain, message: "Domínio verificado com sucesso!" });
});

export default router;
