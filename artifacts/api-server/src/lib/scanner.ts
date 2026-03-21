import type { InsertScanResult } from "@workspace/db";

export interface ScanCheck {
  checkType: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  details?: string;
  fixSuggestion?: string;
  vibePrompt?: string;
  passed: boolean;
}

interface FetchResult {
  url: string;
  status: number;
  headers: Record<string, string>;
  body: string;
  finalUrl: string;
  isHttps: boolean;
  cookies: string[];
  error?: string;
}

async function fetchUrl(url: string, timeout = 10000): Promise<FetchResult | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Saffe-Security-Scanner/1.0 (+https://saffe.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timer);

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const body = await response.text();
    const finalUrl = response.url || url;
    const isHttps = finalUrl.startsWith("https://");

    const setCookieHeaders = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
    const rawCookies = setCookieHeaders.length > 0 ? setCookieHeaders : [headers["set-cookie"] || ""].filter(Boolean);

    return {
      url,
      status: response.status,
      headers,
      body,
      finalUrl,
      isHttps,
      cookies: rawCookies,
      error: undefined,
    };
  } catch (err) {
    return {
      url,
      status: 0,
      headers: {},
      body: "",
      finalUrl: url,
      isHttps: url.startsWith("https://"),
      cookies: [],
      error: String(err),
    };
  }
}

async function checkSensitiveFile(baseUrl: string, path: string): Promise<{ accessible: boolean; status: number }> {
  try {
    const url = new URL(path, baseUrl).href;
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Saffe-Security-Scanner/1.0" },
    });
    if (response.status === 200) {
      const body = await response.text();
      if (body.length > 0 && !body.includes("<!DOCTYPE") && !body.includes("<html")) {
        return { accessible: true, status: response.status };
      }
    }
    return { accessible: false, status: response.status };
  } catch {
    return { accessible: false, status: 0 };
  }
}

function checkHttps(result: FetchResult): ScanCheck {
  if (result.isHttps) {
    return {
      checkType: "https",
      severity: "info",
      title: "HTTPS Ativo",
      description: "Seu site usa HTTPS, o que significa que a comunicação entre seus usuários e o servidor é criptografada.",
      passed: true,
    };
  }
  return {
    checkType: "https",
    severity: "critical",
    title: "HTTPS Ausente",
    description: "Seu site não usa HTTPS. Todos os dados trocados entre seus usuários e o servidor estão visíveis para qualquer pessoa na rede.",
    details: `O site está acessível em ${result.finalUrl} sem criptografia.`,
    fixSuggestion: "Ative HTTPS no painel do seu provedor de hospedagem. A maioria dos serviços como Netlify, Vercel e Replit ativam HTTPS automaticamente.",
    vibePrompt: "Configure o certificado SSL/TLS do meu site para garantir que todas as conexões usem HTTPS. O site está em [URL DO SITE]. Certifique-se de que HTTP redireciona automaticamente para HTTPS.",
    passed: false,
  };
}

function checkSecurityHeaders(headers: Record<string, string>): ScanCheck[] {
  const checks: ScanCheck[] = [];

  const csp = headers["content-security-policy"];
  if (csp) {
    checks.push({
      checkType: "header_csp",
      severity: "info",
      title: "Content-Security-Policy: Presente",
      description: "O header Content-Security-Policy está configurado, o que ajuda a prevenir ataques XSS (Cross-Site Scripting).",
      passed: true,
    });
  } else {
    checks.push({
      checkType: "header_csp",
      severity: "high",
      title: "Content-Security-Policy: Ausente",
      description: "O header Content-Security-Policy está faltando. Sem ele, seu app fica vulnerável a ataques XSS, onde hackers injetam scripts maliciosos na sua página.",
      fixSuggestion: "Adicione o header Content-Security-Policy ao servidor. Uma configuração básica segura: Content-Security-Policy: default-src 'self'",
      vibePrompt: "Adicione o header HTTP Content-Security-Policy ao meu servidor/app. Use esta configuração: Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
      passed: false,
    });
  }

  const hsts = headers["strict-transport-security"];
  if (hsts) {
    checks.push({
      checkType: "header_hsts",
      severity: "info",
      title: "Strict-Transport-Security: Presente",
      description: "O header HSTS está configurado, forçando conexões HTTPS mesmo que o usuário tente acessar via HTTP.",
      passed: true,
    });
  } else {
    checks.push({
      checkType: "header_hsts",
      severity: "medium",
      title: "Strict-Transport-Security: Ausente",
      description: "O header HSTS está faltando. Sem ele, usuários podem ser redirecionados para versões HTTP inseguras do seu site em ataques 'man-in-the-middle'.",
      fixSuggestion: "Adicione o header: Strict-Transport-Security: max-age=31536000; includeSubDomains",
      vibePrompt: "Adicione o header HTTP Strict-Transport-Security ao meu servidor com o valor: max-age=31536000; includeSubDomains. Isso força conexões HTTPS por 1 ano.",
      passed: false,
    });
  }

  const xFrameOptions = headers["x-frame-options"];
  if (xFrameOptions) {
    checks.push({
      checkType: "header_xframe",
      severity: "info",
      title: "X-Frame-Options: Presente",
      description: "O header X-Frame-Options está configurado, protegendo contra ataques de Clickjacking.",
      passed: true,
    });
  } else {
    checks.push({
      checkType: "header_xframe",
      severity: "medium",
      title: "X-Frame-Options: Ausente",
      description: "O header X-Frame-Options está faltando. Sem ele, hackers podem incorporar seu site em um iframe invisível para enganar seus usuários (ataque Clickjacking).",
      fixSuggestion: "Adicione o header: X-Frame-Options: SAMEORIGIN",
      vibePrompt: "Adicione o header HTTP X-Frame-Options: SAMEORIGIN ao meu servidor para prevenir ataques de clickjacking.",
      passed: false,
    });
  }

  const xContentType = headers["x-content-type-options"];
  if (xContentType) {
    checks.push({
      checkType: "header_xcontent",
      severity: "info",
      title: "X-Content-Type-Options: Presente",
      description: "O header X-Content-Type-Options está configurado, evitando que o browser interprete arquivos de maneira incorreta.",
      passed: true,
    });
  } else {
    checks.push({
      checkType: "header_xcontent",
      severity: "low",
      title: "X-Content-Type-Options: Ausente",
      description: "O header X-Content-Type-Options está faltando. Sem ele, o navegador pode tentar 'adivinhar' o tipo de um arquivo e executar conteúdo malicioso.",
      fixSuggestion: "Adicione o header: X-Content-Type-Options: nosniff",
      vibePrompt: "Adicione o header HTTP X-Content-Type-Options: nosniff ao meu servidor.",
      passed: false,
    });
  }

  const referrerPolicy = headers["referrer-policy"];
  if (referrerPolicy) {
    checks.push({
      checkType: "header_referrer",
      severity: "info",
      title: "Referrer-Policy: Presente",
      description: "O header Referrer-Policy está configurado, controlando quais informações são enviadas quando usuários clicam em links.",
      passed: true,
    });
  } else {
    checks.push({
      checkType: "header_referrer",
      severity: "low",
      title: "Referrer-Policy: Ausente",
      description: "O header Referrer-Policy está faltando. Sem ele, URLs completas do seu site (que podem conter dados sensíveis) podem ser enviadas para sites externos.",
      fixSuggestion: "Adicione o header: Referrer-Policy: strict-origin-when-cross-origin",
      vibePrompt: "Adicione o header HTTP Referrer-Policy: strict-origin-when-cross-origin ao meu servidor.",
      passed: false,
    });
  }

  return checks;
}

function checkCors(headers: Record<string, string>): ScanCheck {
  const corsOrigin = headers["access-control-allow-origin"];
  if (corsOrigin === "*") {
    return {
      checkType: "cors",
      severity: "high",
      title: "CORS Aberto (Access-Control-Allow-Origin: *)",
      description: "Seu site está configurado para aceitar requisições de QUALQUER origem. Isso significa que qualquer site na internet pode fazer chamadas à sua API e ler os dados retornados.",
      details: `Access-Control-Allow-Origin: ${corsOrigin}`,
      fixSuggestion: "Restrinja o CORS para aceitar apenas origens confiáveis. Por exemplo: Access-Control-Allow-Origin: https://seusite.com",
      vibePrompt: "Corrija a configuração de CORS do meu servidor para que ele aceite requisições apenas do meu próprio domínio (https://[MEU DOMÍNIO]), e não de qualquer origem (*). Remova o 'Access-Control-Allow-Origin: *' e configure-o corretamente.",
      passed: false,
    };
  }
  if (corsOrigin) {
    return {
      checkType: "cors",
      severity: "info",
      title: "CORS Configurado Corretamente",
      description: `O CORS está configurado para aceitar requisições apenas de origens específicas: ${corsOrigin}`,
      passed: true,
    };
  }
  return {
    checkType: "cors",
    severity: "info",
    title: "CORS: Não Configurado",
    description: "Nenhum header CORS foi encontrado. Isso geralmente é seguro para sites que não expõem APIs públicas.",
    passed: true,
  };
}

function checkCookies(cookies: string[]): ScanCheck[] {
  if (cookies.length === 0 || (cookies.length === 1 && cookies[0] === "")) {
    return [{
      checkType: "cookies",
      severity: "info",
      title: "Cookies: Nenhum encontrado",
      description: "Nenhum cookie foi encontrado na resposta. Não há cookies para analisar.",
      passed: true,
    }];
  }

  const checks: ScanCheck[] = [];
  const missingSecure: string[] = [];
  const missingHttpOnly: string[] = [];
  const missingSameSite: string[] = [];

  for (const cookieStr of cookies) {
    if (!cookieStr) continue;
    const parts = cookieStr.split(";").map((p) => p.trim().toLowerCase());
    const namePart = cookieStr.split(";")[0]?.split("=")[0]?.trim() || "cookie";

    if (!parts.some((p) => p === "secure")) missingSecure.push(namePart);
    if (!parts.some((p) => p === "httponly")) missingHttpOnly.push(namePart);
    if (!parts.some((p) => p.startsWith("samesite"))) missingSameSite.push(namePart);
  }

  if (missingSecure.length > 0) {
    checks.push({
      checkType: "cookie_secure",
      severity: "high",
      title: "Cookies sem flag Secure",
      description: `Os cookies ${missingSecure.join(", ")} não têm a flag Secure. Isso significa que eles podem ser transmitidos em conexões HTTP não criptografadas.`,
      fixSuggestion: "Adicione a flag Secure a todos os cookies: Set-Cookie: session=abc; Secure; HttpOnly; SameSite=Lax",
      vibePrompt: "Adicione a flag Secure a todos os cookies do meu app. Quando definir cookies no servidor, use: Secure; HttpOnly; SameSite=Lax.",
      passed: false,
    });
  } else {
    checks.push({
      checkType: "cookie_secure",
      severity: "info",
      title: "Cookies com flag Secure",
      description: "Todos os cookies têm a flag Secure configurada.",
      passed: true,
    });
  }

  if (missingHttpOnly.length > 0) {
    checks.push({
      checkType: "cookie_httponly",
      severity: "high",
      title: "Cookies sem flag HttpOnly",
      description: `Os cookies ${missingHttpOnly.join(", ")} não têm a flag HttpOnly. JavaScript no navegador pode acessar esses cookies, facilitando ataques XSS.`,
      fixSuggestion: "Adicione HttpOnly a todos os cookies de sessão para que JavaScript não possa acessá-los.",
      vibePrompt: "Adicione a flag HttpOnly a todos os cookies de sessão do meu servidor. Isso impede que JavaScript acesse os cookies.",
      passed: false,
    });
  } else {
    checks.push({
      checkType: "cookie_httponly",
      severity: "info",
      title: "Cookies com flag HttpOnly",
      description: "Todos os cookies têm a flag HttpOnly configurada.",
      passed: true,
    });
  }

  if (missingSameSite.length > 0) {
    checks.push({
      checkType: "cookie_samesite",
      severity: "medium",
      title: "Cookies sem flag SameSite",
      description: `Os cookies ${missingSameSite.join(", ")} não têm a flag SameSite. Isso os torna vulneráveis a ataques CSRF (Cross-Site Request Forgery).`,
      fixSuggestion: "Adicione SameSite=Lax ou SameSite=Strict a todos os cookies.",
      vibePrompt: "Adicione SameSite=Lax a todos os cookies do meu servidor para prevenir ataques CSRF.",
      passed: false,
    });
  } else {
    checks.push({
      checkType: "cookie_samesite",
      severity: "info",
      title: "Cookies com flag SameSite",
      description: "Todos os cookies têm a flag SameSite configurada.",
      passed: true,
    });
  }

  return checks;
}

function checkSensitivePatterns(body: string): ScanCheck {
  const patterns = [
    { regex: /api[_-]?key\s*[:=]\s*["']?[a-zA-Z0-9\-_]{10,}["']?/gi, name: "API Key" },
    { regex: /secret\s*[:=]\s*["']?[a-zA-Z0-9\-_]{10,}["']?/gi, name: "Secret" },
    { regex: /Bearer\s+[a-zA-Z0-9\-_\.]{20,}/gi, name: "Bearer Token" },
    { regex: /password\s*[:=]\s*["']?[^\s"']{6,}["']?/gi, name: "Password" },
    { regex: /private[_-]?key\s*[:=]\s*["']?[a-zA-Z0-9\-_]{10,}["']?/gi, name: "Private Key" },
    { regex: /access[_-]?token\s*[:=]\s*["']?[a-zA-Z0-9\-_\.]{20,}["']?/gi, name: "Access Token" },
    { regex: /database[_-]?url\s*[:=]\s*["']?[a-zA-Z0-9\-_\/:\.@]{10,}["']?/gi, name: "Database URL" },
    { regex: /OPENAI_API_KEY/gi, name: "OpenAI API Key" },
    { regex: /sk-[a-zA-Z0-9]{20,}/g, name: "Possible OpenAI Key" },
  ];

  const found: string[] = [];
  for (const { regex, name } of patterns) {
    const matches = body.match(regex);
    if (matches && matches.length > 0) {
      found.push(name);
    }
  }

  if (found.length > 0) {
    return {
      checkType: "sensitive_patterns",
      severity: "critical",
      title: "Segredos Expostos no Código Público",
      description: `Foram encontrados padrões sensíveis no HTML/JS público do seu site: ${found.join(", ")}. Isso significa que qualquer visitante pode encontrar essas credenciais.`,
      details: `Tipos encontrados: ${found.join(", ")}`,
      fixSuggestion: "URGENTE: Remova imediatamente qualquer chave de API, senha ou token do código frontend. Essas credenciais devem estar apenas no servidor (backend), nunca no código que roda no navegador do usuário. Revogue e gere novas credenciais para todos os serviços afetados.",
      vibePrompt: "Encontrei segredos expostos no meu código frontend: " + found.join(", ") + ". Preciso: (1) Mover todas essas credenciais para variáveis de ambiente no servidor (backend), (2) Remover completamente do código frontend, (3) Criar funções de API no backend que usam essas credenciais de forma segura. Como faço isso no meu app?",
      passed: false,
    };
  }

  return {
    checkType: "sensitive_patterns",
    severity: "info",
    title: "Nenhum Segredo Exposto Encontrado",
    description: "Nenhum padrão de segredos óbvios foi encontrado no código público. Continue mantendo chaves de API e senhas apenas no servidor.",
    passed: true,
  };
}

async function checkSensitiveFiles(baseUrl: string): Promise<ScanCheck> {
  const sensitiveFiles = [
    { path: "/.env", name: ".env" },
    { path: "/config.js", name: "config.js" },
    { path: "/.git/config", name: ".git/config" },
    { path: "/api/keys", name: "api/keys" },
    { path: "/.env.local", name: ".env.local" },
    { path: "/.env.production", name: ".env.production" },
  ];

  const accessible: string[] = [];

  await Promise.all(
    sensitiveFiles.map(async ({ path, name }) => {
      const result = await checkSensitiveFile(baseUrl, path);
      if (result.accessible) {
        accessible.push(name);
      }
    }),
  );

  if (accessible.length > 0) {
    return {
      checkType: "sensitive_files",
      severity: "critical",
      title: "Arquivos Sensíveis Acessíveis Publicamente",
      description: `Os seguintes arquivos sensíveis estão acessíveis publicamente: ${accessible.join(", ")}. Qualquer pessoa pode acessar esses arquivos e obter suas credenciais e configurações secretas.`,
      details: `Arquivos acessíveis: ${accessible.join(", ")}`,
      fixSuggestion: "URGENTE: Bloqueie imediatamente o acesso a esses arquivos no seu servidor web. No Vercel, Netlify ou similar, configure regras de acesso ou remova esses arquivos do diretório público.",
      vibePrompt: "Os arquivos " + accessible.join(", ") + " estão publicamente acessíveis no meu site. Preciso configurar o servidor para bloquear o acesso a esses arquivos. Como configuro isso no meu provedor de hospedagem ([NOME DO PROVEDOR])? Adicione as configurações necessárias ao projeto.",
      passed: false,
    };
  }

  return {
    checkType: "sensitive_files",
    severity: "info",
    title: "Arquivos Sensíveis: Não Expostos",
    description: "Nenhum arquivo sensível comum foi encontrado publicamente acessível.",
    passed: true,
  };
}

function calculateRiskLevel(checks: ScanCheck[]): "low" | "medium" | "high" | "critical" {
  const failed = checks.filter((c) => !c.passed);
  if (failed.some((c) => c.severity === "critical")) return "critical";
  if (failed.some((c) => c.severity === "high")) return "high";
  if (failed.some((c) => c.severity === "medium")) return "medium";
  if (failed.length > 0) return "low";
  return "low";
}

export async function runSecurityScan(url: string): Promise<{
  checks: ScanCheck[];
  riskLevel: "low" | "medium" | "high" | "critical";
}> {
  const result = await fetchUrl(url);

  if (!result || result.error) {
    const errorCheck: ScanCheck = {
      checkType: "connection",
      severity: "critical",
      title: "Não foi possível acessar o site",
      description: `O scanner não conseguiu se conectar ao site: ${result?.error || "Erro desconhecido"}`,
      passed: false,
    };
    return { checks: [errorCheck], riskLevel: "critical" };
  }

  const checks: ScanCheck[] = [];

  checks.push(checkHttps(result));
  checks.push(...checkSecurityHeaders(result.headers));
  checks.push(checkCors(result.headers));
  checks.push(...checkCookies(result.cookies));
  checks.push(checkSensitivePatterns(result.body));
  checks.push(await checkSensitiveFiles(url));

  const riskLevel = calculateRiskLevel(checks);
  return { checks, riskLevel };
}

export function checksToInsertResults(scanId: string, checks: ScanCheck[]): InsertScanResult[] {
  return checks.map((check) => ({
    scanId,
    checkType: check.checkType,
    severity: check.severity,
    title: check.title,
    description: check.description,
    details: check.details ?? null,
    fixSuggestion: check.fixSuggestion ?? null,
    vibePrompt: check.vibePrompt ?? null,
    passed: check.passed,
  }));
}
