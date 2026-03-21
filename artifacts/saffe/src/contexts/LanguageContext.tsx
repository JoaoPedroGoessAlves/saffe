import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "pt" | "en";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "saffe_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "pt" || stored === "en") return stored;
    return "pt";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    const dict = language === "pt" ? ptTranslations : enTranslations;
    return (dict as Record<string, string>)[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

const ptTranslations: Record<string, string> = {
  // Navbar
  "nav.dashboard": "Dashboard",
  "nav.newScan": "Novo Scan",
  "nav.signIn": "Entrar",

  // Home — hero
  "home.badge": "Feito para Apps Vibe-Coded",
  "home.heroTitle1": "Lance rápido.",
  "home.heroTitle2": "Fique Saffe.",
  "home.heroSubtitle": "Descubra vulnerabilidades de segurança no seu app gerado por IA antes dos hackers. Receba relatórios claros e acionáveis com prompts prontos para usar nas suas ferramentas de IA.",
  "home.ctaButton": "Começar Scan Gratuito",
  "home.noCreditCard": "Sem cartão de crédito",

  // Home — how it works
  "home.howTitle": "Como o Saffe Funciona",
  "home.howSubtitle": "Desenvolvemos o Saffe especificamente para fundadores não técnicos. Sem configurações complexas, apenas resultados.",
  "home.step1Title": "1. Verifique a Propriedade",
  "home.step1Desc": "Adicione uma meta tag simples ao seu app para comprovar que você é dono do domínio. Só escaneamos apps que você controla.",
  "home.step2Title": "2. Scan Profundo",
  "home.step2Desc": "Verificamos chaves de API expostas, headers de segurança ausentes, CORS aberto e cookies inseguros em segundos.",
  "home.step3Title": "3. Corrija com Prompts",
  "home.step3Desc": "Receba um relatório elegante com prompts de 'copiar e colar' que você pode usar no Lovable, Bolt ou Cursor para corrigir os problemas.",

  // Home — what we check
  "home.checkTitle": "O que verificamos no seu App Vibe-Coded",
  "home.checkSubtitle": "Ferramentas de IA são ótimas para velocidade, mas frequentemente ignoram segurança por padrão. Verificamos as vulnerabilidades mais comuns que deixam startups expostas.",
  "home.check1": "Chaves de API e Segredos expostos no JS público",
  "home.check2": "Content Security Policy (CSP) ausente",
  "home.check3": "Configurações CORS excessivamente permissivas",
  "home.check4": "Flags de Cookie inseguros (HttpOnly/Secure ausentes)",
  "home.check5": "Arquivos sensíveis expostos (.env, /admin)",
  "home.check6": "Strict-Transport-Security (HSTS) ausente",

  // Home — mock scan widget
  "home.mockScanTitle": "Resultados do Scan",
  "home.mockCriticalRisk": "RISCO CRÍTICO",
  "home.mockExposedKey": "Chave de API encontrada",
  "home.mockExposedKeyDesc": "String correspondendo a Chave Secreta Stripe encontrada no bundle javascript público.",
  "home.mockPromptSnippet": "Prompt: \"Remova a chave stripe do frontend e mova-a para uma rota de API no backend...\"",
  "home.mockCopyBtn": "Copiar",
  "home.mockBgAlt": "Fundo abstrato",
  "home.mockOpenCors": "Política CORS Aberta",
  "home.mockOpenCorsDesc": "Access-Control-Allow-Origin está definido como *",

  // Home — footer
  "home.footerTagline": "Construindo confiança para a geração vibe-coding.",

  // Dashboard
  "dashboard.title": "Seus Scans",
  "dashboard.subtitle": "Revise o histórico de segurança das suas aplicações.",
  "dashboard.newScanBtn": "Novo Scan de Segurança",
  "dashboard.costTitle": "Estimativas de Custo de Dev",
  "dashboard.costSubtitle": "Entenda quanto custaria reconstruir seu app.",
  "dashboard.newCostBtn": "Nova Estimativa de Custo",
  "dashboard.deepTitle": "Deep Code Scans",
  "dashboard.deepSubtitle": "Análise de segurança profunda do código-fonte via Jules.",
  "dashboard.newDeepBtn": "Nova Análise de Código",

  // ScanList empty
  "scanList.empty.title": "Nenhum scan ainda",
  "scanList.empty.desc": "Você ainda não executou nenhum scan de segurança nas suas aplicações. Inicie seu primeiro scan para descobrir vulnerabilidades potenciais.",
  "scanList.empty.cta": "Começar Scan Gratuito",
  "scanList.error.title": "Falha ao carregar scans",
  "scanList.error.desc": "Encontramos um erro ao recuperar seus dados.",
  "scanList.error.retry": "Tentar Novamente",
  "scanList.risk": "Risco:",
  "scanList.viewReport": "Ver Relatório",

  // CostAnalysis empty
  "costList.empty.title": "Nenhuma estimativa ainda",
  "costList.empty.desc": "Conecte um repositório GitHub para estimar quanto custaria reconstruir seu app do zero.",
  "costList.empty.cta": "Obter Primeira Estimativa",
  "costList.error.desc": "Falha ao carregar análises de custo.",
  "costList.linesOfCode": "linhas de código",
  "costList.viewReport": "Ver Relatório",

  // JulesScanList empty/error
  "julesList.empty.title": "Nenhuma análise profunda ainda",
  "julesList.empty.desc": "Conecte um repositório GitHub e deixe o Jules identificar vulnerabilidades no seu código-fonte.",
  "julesList.empty.cta": "Iniciar Deep Scan",
  "julesList.error.desc": "Não foi possível carregar as análises.",
  "julesList.viewResult": "Ver Resultado",
  "julesList.analyzing": "Analisando...",
  "julesList.vulnerability_one": "vulnerabilidade",
  "julesList.vulnerability_other": "vulnerabilidades",

  // Jules status labels
  "jules.status.completed": "Concluído",
  "jules.status.failed": "Falhou",
  "jules.status.running": "Analisando...",
  "jules.status.pending": "Aguardando",

  // NewScan
  "newScan.pageTitle": "Executar um Scan de Segurança",
  "newScan.pageSubtitle": "Verifique sua propriedade para obter uma análise completa de segurança do seu app.",
  "newScan.inputTitle": "Inserir URL da Aplicação",
  "newScan.inputDesc": "Cole a URL completa da aplicação que você deseja escanear.",
  "newScan.urlPlaceholder": "https://meu-app.lovable.app",
  "newScan.preparing": "Preparando...",
  "newScan.continue": "Continuar",
  "newScan.verifyTitle": "Verificar Propriedade do Domínio",
  "newScan.verifyDesc1": "Por razões de segurança, precisamos verificar que você é dono de",
  "newScan.verifyDesc2": "antes de escanear.",
  "newScan.verifyStep1": "1. Adicione esta meta tag à seção",
  "newScan.verifyStep1b": "da sua aplicação:",
  "newScan.verifyStep2": "2. Faça o deploy do seu app e clique em verificar abaixo.",
  "newScan.back": "Voltar",
  "newScan.verifying": "Verificando...",
  "newScan.verifyBtn": "Adicionei, Verificar Agora",
  "newScan.scanningTitle": "Iniciando Scan de Segurança",
  "newScan.scanningDesc": "Aguarde enquanto inicializamos os motores de varredura...",
  "newScan.metaTagCopied": "Meta tag copiada para a área de transferência",

  // Navbar
  "nav.logOut": "Sair",

  // ScanReport
  "scanReport.loading": "Carregando Relatório...",
  "scanReport.notFound": "Scan Não Encontrado",
  "scanReport.notFoundDesc": "Não conseguimos encontrar o relatório de scan solicitado.",
  "scanReport.backToDashboard": "Voltar ao Dashboard",
  "scanReport.backToScans": "Voltar aos Scans",
  "scanReport.scanning": "Escaneando sua aplicação",
  "scanReport.scanningDesc1": "Estamos atualmente analisando",
  "scanReport.scanningDesc2": "Isso geralmente leva alguns segundos.",
  "scanReport.runningChecks": "Executando verificações...",
  "scanReport.scannedOn": "Escaneado em",
  "scanReport.emailReport": "Enviar Relatório por E-mail",
  "scanReport.runNewScan": "Novo Scan",
  "scanReport.overallRisk": "Pontuação de Risco Geral",
  "scanReport.actionRequired": "Ação Necessária",
  "scanReport.actionDesc": "Encontramos vulnerabilidades graves que podem permitir que atacantes comprometam seu app ou usuários. Por favor, corrija-as imediatamente usando os prompts de IA fornecidos.",
  "scanReport.greatJob": "Ótimo Trabalho!",
  "scanReport.greatJobDesc": "A postura de segurança da sua aplicação parece sólida. Nenhuma vulnerabilidade grave foi detectada na configuração pública.",
  "scanReport.detailedAnalysis": "Análise Detalhada",
  "scanReport.noResults": "Nenhum dado de resultado disponível.",
  "scanReport.whyItMatters": "Por que é importante:",
  "scanReport.howToFix": "Como corrigir:",
  "scanReport.aiPromptLabel": "Prompt de IA (Lovable / Bolt / Cursor)",
  "scanReport.copyPrompt": "Copiar Prompt",
  "scanReport.copied": "Copiado!",
  "scanReport.promptCopied": "Prompt copiado para a área de transferência!",
  "scanReport.shareReport": "Compartilhar Relatório de Segurança",
  "scanReport.shareDesc": "Envie uma versão HTML completa deste relatório para seu e-mail, incluindo uma seção técnica para desenvolvedores.",
  "scanReport.emailNote": "Nota: sem domínio verificado, o e-mail é entregue ao endereço da conta Resend cadastrada.",
  "scanReport.emailAddress": "Endereço de E-mail",
  "scanReport.emailPlaceholder": "fundador@startup.com",
  "scanReport.sendReport": "Enviar Relatório",

  // CostEstimator
  "costEstimator.title": "Estimador de Custo de Dev",
  "costEstimator.subtitle": "Conecte seu repositório GitHub para obter uma estimativa profissional de custo para reconstruir seu app do zero.",
  "costEstimator.inputTitle": "Inserir URL do Repositório GitHub",
  "costEstimator.inputDesc": "Cole a URL de um repositório GitHub público que você possui para estimar o custo de desenvolvimento.",
  "costEstimator.repoPlaceholder": "https://github.com/usuario/meu-repo",
  "costEstimator.preparing": "Preparando...",
  "costEstimator.continue": "Continuar",
  "costEstimator.verifyTitle": "Verificar Propriedade do Repositório",
  "costEstimator.verifyDesc1": "Prove que você é dono de",
  "costEstimator.verifyDesc2": "antes de analisarmos.",
  "costEstimator.verifyStep1": "1. Crie um arquivo chamado",
  "costEstimator.verifyStep1b": "na raiz do seu repositório com este conteúdo exato:",
  "costEstimator.verifyStep2": "2. Faça commit e push do arquivo para o branch padrão, depois clique em verificar abaixo.",
  "costEstimator.back": "Voltar",
  "costEstimator.verifying": "Verificando...",
  "costEstimator.verifyBtn": "Adicionei, Verificar Agora",
  "costEstimator.analyzingTitle": "Analisando Repositório",
  "costEstimator.analyzingDesc": "Clonando e executando análise de código — isso pode levar até um minuto...",
  "costEstimator.tokenCopied": "Token copiado para a área de transferência",
  "costEstimator.notVerifiedTitle": "Ainda não verificado",
  "costEstimator.notVerifiedDesc": "Arquivo não encontrado. Por favor, adicione o arquivo saffe-verify.txt e tente novamente.",

  // CostAnalysisResult
  "costResult.analyzedOn": "Analisado em",
  "costResult.failedTitle": "Falha ao carregar análise",
  "costResult.failedDesc": "Encontramos um erro ao recuperar seus dados.",
  "costResult.retry": "Tentar Novamente",
  "costResult.estimatedCost": "Custo Estimado",
  "costResult.cocomoNote": "Baseado no modelo COCOMO II",
  "costResult.estimatedHours": "Horas Estimadas",
  "costResult.devHoursTotal": "horas de dev no total",
  "costResult.linesOfCode": "Linhas de Código",
  "costResult.totalLines": "total de linhas (somente código)",
  "costResult.languageBreakdown": "Distribuição por Linguagem",
  "costResult.noLangData": "Nenhum dado de linguagem disponível.",
  "costResult.colLanguage": "Linguagem",
  "costResult.colLines": "Linhas",
  "costResult.colComplexity": "Complexidade",
  "costResult.colHours": "Horas",
  "costResult.colCost": "Custo",
  "costResult.total": "Total",
  "costResult.methodologyLabel": "Metodologia:",
  "costResult.methodology": "As estimativas de custo são calculadas usando o modelo COCOMO II aplicado por linguagem. As linhas de código (excluindo comentários e linhas em branco) são contadas usando o SCC. A taxa horária utilizada é de $56/h, baseada em médias do setor. Esses valores são estimativas destinadas apenas a fins de planejamento e não constituem uma cotação formal de desenvolvimento.",
  "costResult.unit.years": "anos",
  "costResult.unit.months": "meses",
  "costResult.unit.weeks": "semanas",
  "costResult.unit.hours": "horas",
  "costResult.devHoursApprox": "~{n} horas de dev no total",
  "dateAt": "às",
  "validation.invalidUrl": "Por favor, insira uma URL válida (ex: https://meuapp.com)",
  "validation.invalidEmail": "Por favor, insira um endereço de e-mail válido",
  "validation.invalidRepoUrl": "Por favor, insira uma URL válida",
  "validation.notGithubUrl": "Deve ser uma URL de repositório GitHub (https://github.com/dono/repo)",

  // DeepScan
  "deepScan.title": "Deep Code Scan",
  "deepScan.subtitle": "O Jules analisa seu repositório GitHub e identifica vulnerabilidades diretamente no código-fonte — muito além do que um scan de URL consegue detectar.",
  "deepScan.repoLabel": "URL do Repositório GitHub",
  "deepScan.repoPlaceholder": "https://github.com/seu-usuario/seu-repositorio",
  "deepScan.publicOnly": "Apenas repositórios públicos são suportados no momento.",
  "deepScan.initiating": "Iniciando análise...",
  "deepScan.analyzeBtn": "Analisar com Jules",
  "deepScan.footerNote": "A análise do Jules pode levar alguns minutos dependendo do tamanho do repositório.",
  "deepScan.check1": "Segredos e credenciais expostos",
  "deepScan.check2": "Injeção de SQL e XSS",
  "deepScan.check3": "Autenticação e controle de acesso",
  "deepScan.check4": "Configurações inseguras no código",

  // DeepScanResult
  "deepResult.loadingMsg": "Carregando análise...",
  "deepResult.notFound": "Análise não encontrada.",
  "deepResult.errorTitle": "Erro na análise",
  "deepResult.retryBtn": "Tentar novamente",
  "deepResult.pendingTitle": "Jules está analisando o código",
  "deepResult.pendingNote": "Isso pode levar alguns minutos. Esta página atualiza automaticamente.",
  "deepResult.securityReport": "Relatório de Segurança",
  "deepResult.completedAt": "Concluído em",
  "deepResult.overallRisk": "Nível de Risco Geral",
  "deepResult.findings": "vulnerabilidades encontradas",
  "deepResult.findingsOne": "vulnerabilidade encontrada",
  "deepResult.noVulnerabilities": "Nenhuma vulnerabilidade encontrada!",
  "deepResult.noVulnDesc": "O Jules não identificou problemas de segurança neste repositório.",
  "deepResult.vulnerabilitiesFound": "Vulnerabilidades Encontradas",
  "deepResult.rawOutput": "Resultado da análise",
  "deepResult.noResult": "Sem resultado disponível.",
  "deepResult.backBtn": "Dashboard",
  "deepResult.newAnalysis": "Nova Análise",
  "deepResult.howToFix": "Como corrigir:",
  "deepResult.criticalLabel": "Crítico",
  "deepResult.highLabel": "Alto",
  "deepResult.mediumLabel": "Médio",
  "deepResult.lowLabel": "Baixo",

  // NotFound
  "notFound.title": "404 - Página Não Encontrada",
  "notFound.desc": "A página que você está procurando não existe ou foi movida.",
  "notFound.backHome": "Voltar para Home",
};

const enTranslations: Record<string, string> = {
  // Navbar
  "nav.dashboard": "Dashboard",
  "nav.newScan": "New Scan",
  "nav.signIn": "Sign In",
  "nav.logOut": "Log out",

  // Home — hero
  "home.badge": "Built for Vibe-Coded Apps",
  "home.heroTitle1": "Ship fast.",
  "home.heroTitle2": "Stay Saffe.",
  "home.heroSubtitle": "Discover security vulnerabilities in your AI-generated web app before hackers do. Get clear, actionable reports with ready-to-use prompts for your AI tools.",
  "home.ctaButton": "Start Free Scan",
  "home.noCreditCard": "No credit card required",

  // Home — how it works
  "home.howTitle": "How Saffe Works",
  "home.howSubtitle": "We designed Saffe specifically for non-technical founders. No complex configurations, just results.",
  "home.step1Title": "1. Verify Ownership",
  "home.step1Desc": "Add a simple meta tag to your app to prove you own the domain. We only scan apps you control.",
  "home.step2Title": "2. Deep Scan",
  "home.step2Desc": "We check for exposed API keys, missing security headers, open CORS, and insecure cookies in seconds.",
  "home.step3Title": "3. Fix with Prompts",
  "home.step3Desc": "Get a beautiful report with 'copy-paste' prompts you can feed back into Lovable, Bolt, or Cursor to fix the issues.",

  // Home — what we check
  "home.checkTitle": "What we look for in your Vibe-Coded App",
  "home.checkSubtitle": "AI coding tools are amazing for speed, but they often cut corners on security by default. We check the most common vulnerabilities that get startups hacked.",
  "home.check1": "Exposed API Keys & Secrets in public JS",
  "home.check2": "Missing Content Security Policy (CSP)",
  "home.check3": "Overly permissive CORS configurations",
  "home.check4": "Insecure Cookie flags (missing HttpOnly/Secure)",
  "home.check5": "Exposed sensitive files (.env, /admin)",
  "home.check6": "Missing Strict-Transport-Security (HSTS)",

  // Home — mock scan widget
  "home.mockScanTitle": "Scan Results",
  "home.mockCriticalRisk": "CRITICAL RISK",
  "home.mockExposedKey": "Exposed API Key found",
  "home.mockExposedKeyDesc": "Found string matching Stripe Secret Key in public javascript bundle.",
  "home.mockPromptSnippet": "Prompt: \"Remove the hardcoded stripe key from the frontend and move it to a backend API route...\"",
  "home.mockCopyBtn": "Copy",
  "home.mockBgAlt": "Abstract background",
  "home.mockOpenCors": "Open CORS Policy",
  "home.mockOpenCorsDesc": "Access-Control-Allow-Origin is set to *",

  // Home — footer
  "home.footerTagline": "Building trust for the vibe-coding generation.",

  // Dashboard
  "dashboard.title": "Your Scans",
  "dashboard.subtitle": "Review your application security history.",
  "dashboard.newScanBtn": "New Security Scan",
  "dashboard.costTitle": "Dev Cost Estimates",
  "dashboard.costSubtitle": "Understand how much it would cost to rebuild your app.",
  "dashboard.newCostBtn": "New Cost Estimate",
  "dashboard.deepTitle": "Deep Code Scans",
  "dashboard.deepSubtitle": "Deep source-code security analysis via Jules.",
  "dashboard.newDeepBtn": "New Code Analysis",

  // ScanList empty
  "scanList.empty.title": "No scans yet",
  "scanList.empty.desc": "You haven't run any security scans on your applications. Start your first scan to discover potential vulnerabilities.",
  "scanList.empty.cta": "Start Free Scan",
  "scanList.error.title": "Failed to load scans",
  "scanList.error.desc": "We encountered an error retrieving your data.",
  "scanList.error.retry": "Try Again",
  "scanList.risk": "Risk:",
  "scanList.viewReport": "View Report",

  // CostAnalysis empty
  "costList.empty.title": "No cost estimates yet",
  "costList.empty.desc": "Connect a GitHub repository to estimate how much it would cost to rebuild your app from scratch.",
  "costList.empty.cta": "Get Your First Estimate",
  "costList.error.desc": "Failed to load cost analyses.",
  "costList.linesOfCode": "lines of code",
  "costList.viewReport": "View Report",

  // JulesScanList empty/error
  "julesList.empty.title": "No deep scans yet",
  "julesList.empty.desc": "Connect a GitHub repository and let Jules identify vulnerabilities in your source code.",
  "julesList.empty.cta": "Start Deep Scan",
  "julesList.error.desc": "Could not load analyses.",
  "julesList.viewResult": "View Result",
  "julesList.analyzing": "Analyzing...",
  "julesList.vulnerability_one": "vulnerability",
  "julesList.vulnerability_other": "vulnerabilities",

  // Jules status labels
  "jules.status.completed": "Done",
  "jules.status.failed": "Failed",
  "jules.status.running": "Analyzing...",
  "jules.status.pending": "Pending",

  // NewScan
  "newScan.pageTitle": "Run a Security Scan",
  "newScan.pageSubtitle": "Verify your ownership to get a complete security analysis of your app.",
  "newScan.inputTitle": "Enter Application URL",
  "newScan.inputDesc": "Paste the full URL of the application you want to scan.",
  "newScan.urlPlaceholder": "https://my-awesome-app.lovable.app",
  "newScan.preparing": "Preparing...",
  "newScan.continue": "Continue",
  "newScan.verifyTitle": "Verify Domain Ownership",
  "newScan.verifyDesc1": "For security reasons, we need to verify you own",
  "newScan.verifyDesc2": "before scanning.",
  "newScan.verifyStep1": "1. Add this meta tag to your application's",
  "newScan.verifyStep1b": "section:",
  "newScan.verifyStep2": "2. Deploy your app, then click verify below.",
  "newScan.back": "Back",
  "newScan.verifying": "Verifying...",
  "newScan.verifyBtn": "I added it, Verify Now",
  "newScan.scanningTitle": "Starting Security Scan",
  "newScan.scanningDesc": "Please wait while we initialize the scanning engines...",
  "newScan.metaTagCopied": "Meta tag copied to clipboard",

  // ScanReport
  "scanReport.loading": "Loading Report...",
  "scanReport.notFound": "Scan Not Found",
  "scanReport.notFoundDesc": "We couldn't find the requested scan report.",
  "scanReport.backToDashboard": "Back to Dashboard",
  "scanReport.backToScans": "Back to Scans",
  "scanReport.scanning": "Scanning your application",
  "scanReport.scanningDesc1": "We are currently analyzing",
  "scanReport.scanningDesc2": "This usually takes a few seconds.",
  "scanReport.runningChecks": "Running checks...",
  "scanReport.scannedOn": "Scanned on",
  "scanReport.emailReport": "Email Report",
  "scanReport.runNewScan": "Run New Scan",
  "scanReport.overallRisk": "Overall Risk Score",
  "scanReport.actionRequired": "Action Required",
  "scanReport.actionDesc": "We found severe vulnerabilities that could let attackers compromise your app or users. Please fix these immediately using the provided AI prompts.",
  "scanReport.greatJob": "Great Job!",
  "scanReport.greatJobDesc": "Your application's security posture looks solid. No major vulnerabilities were detected in the public configuration.",
  "scanReport.detailedAnalysis": "Detailed Analysis",
  "scanReport.noResults": "No results data available.",
  "scanReport.whyItMatters": "Why it matters:",
  "scanReport.howToFix": "How to fix it:",
  "scanReport.aiPromptLabel": "AI Prompt (Lovable / Bolt / Cursor)",
  "scanReport.copyPrompt": "Copy Prompt",
  "scanReport.copied": "Copied!",
  "scanReport.promptCopied": "Prompt copied to clipboard!",
  "scanReport.shareReport": "Share Security Report",
  "scanReport.shareDesc": "Send a comprehensive HTML version of this report to your email, including a technical section for developers.",
  "scanReport.emailNote": "Note: without a verified domain, the email is delivered to the Resend account email address.",
  "scanReport.emailAddress": "Email Address",
  "scanReport.emailPlaceholder": "founder@startup.com",
  "scanReport.sendReport": "Send Report",

  // CostEstimator
  "costEstimator.title": "Dev Cost Estimator",
  "costEstimator.subtitle": "Connect your GitHub repository to get a professional cost estimate for rebuilding your app from scratch.",
  "costEstimator.inputTitle": "Enter GitHub Repository URL",
  "costEstimator.inputDesc": "Paste the URL of a public GitHub repository you own to estimate its development cost.",
  "costEstimator.repoPlaceholder": "https://github.com/username/my-repo",
  "costEstimator.preparing": "Preparing...",
  "costEstimator.continue": "Continue",
  "costEstimator.verifyTitle": "Verify Repository Ownership",
  "costEstimator.verifyDesc1": "Prove you own",
  "costEstimator.verifyDesc2": "before we analyze it.",
  "costEstimator.verifyStep1": "1. Create a file named",
  "costEstimator.verifyStep1b": "at the root of your repository with this exact content:",
  "costEstimator.verifyStep2": "2. Commit and push the file to your default branch, then click verify below.",
  "costEstimator.back": "Back",
  "costEstimator.verifying": "Verifying...",
  "costEstimator.verifyBtn": "I added it, Verify Now",
  "costEstimator.analyzingTitle": "Analyzing Repository",
  "costEstimator.analyzingDesc": "Cloning and running code analysis — this may take up to a minute...",
  "costEstimator.tokenCopied": "Token copied to clipboard",
  "costEstimator.notVerifiedTitle": "Not verified yet",
  "costEstimator.notVerifiedDesc": "File not found. Please add the saffe-verify.txt file and try again.",

  // CostAnalysisResult
  "costResult.analyzedOn": "Analyzed on",
  "costResult.failedTitle": "Failed to load analysis",
  "costResult.failedDesc": "We encountered an error retrieving your data.",
  "costResult.retry": "Try Again",
  "costResult.estimatedCost": "Estimated Cost",
  "costResult.cocomoNote": "Based on COCOMO II model",
  "costResult.estimatedHours": "Estimated Hours",
  "costResult.devHoursTotal": "dev hours total",
  "costResult.linesOfCode": "Lines of Code",
  "costResult.totalLines": "total lines (code only)",
  "costResult.languageBreakdown": "Language Breakdown",
  "costResult.noLangData": "No language data available.",
  "costResult.colLanguage": "Language",
  "costResult.colLines": "Lines",
  "costResult.colComplexity": "Complexity",
  "costResult.colHours": "Hours",
  "costResult.colCost": "Cost",
  "costResult.total": "Total",
  "costResult.methodologyLabel": "Methodology:",
  "costResult.methodology": "Cost estimates are calculated using the COCOMO II model applied per language. Lines of code (excluding comments and blanks) are counted using SCC. The hourly rate used is $56/hr, based on industry averages. These figures are estimates intended for planning purposes only and do not constitute a formal development quote.",
  "costResult.unit.years": "years",
  "costResult.unit.months": "months",
  "costResult.unit.weeks": "weeks",
  "costResult.unit.hours": "hours",
  "costResult.devHoursApprox": "~{n} dev hours total",
  "dateAt": "at",
  "validation.invalidUrl": "Please enter a valid URL (e.g., https://myapp.com)",
  "validation.invalidEmail": "Please enter a valid email address",
  "validation.invalidRepoUrl": "Please enter a valid URL",
  "validation.notGithubUrl": "Must be a GitHub repository URL (https://github.com/owner/repo)",

  // DeepScan
  "deepScan.title": "Deep Code Scan",
  "deepScan.subtitle": "Jules analyzes your GitHub repository and identifies vulnerabilities directly in the source code — far beyond what a URL scan can detect.",
  "deepScan.repoLabel": "GitHub Repository URL",
  "deepScan.repoPlaceholder": "https://github.com/your-user/your-repository",
  "deepScan.publicOnly": "Only public repositories are supported at this time.",
  "deepScan.initiating": "Starting analysis...",
  "deepScan.analyzeBtn": "Analyze with Jules",
  "deepScan.footerNote": "Jules analysis can take a few minutes depending on the size of the repository.",
  "deepScan.check1": "Exposed secrets and credentials",
  "deepScan.check2": "SQL injection and XSS",
  "deepScan.check3": "Authentication and access control",
  "deepScan.check4": "Insecure code configurations",

  // DeepScanResult
  "deepResult.loadingMsg": "Loading analysis...",
  "deepResult.notFound": "Analysis not found.",
  "deepResult.errorTitle": "Analysis error",
  "deepResult.retryBtn": "Try again",
  "deepResult.pendingTitle": "Jules is analyzing the code",
  "deepResult.pendingNote": "This may take a few minutes. This page updates automatically.",
  "deepResult.securityReport": "Security Report",
  "deepResult.completedAt": "Completed on",
  "deepResult.overallRisk": "Overall Risk Level",
  "deepResult.findings": "vulnerabilities found",
  "deepResult.findingsOne": "vulnerability found",
  "deepResult.noVulnerabilities": "No vulnerabilities found!",
  "deepResult.noVulnDesc": "Jules did not identify any security issues in this repository.",
  "deepResult.vulnerabilitiesFound": "Vulnerabilities Found",
  "deepResult.rawOutput": "Analysis result",
  "deepResult.noResult": "No result available.",
  "deepResult.backBtn": "Dashboard",
  "deepResult.newAnalysis": "New Analysis",
  "deepResult.howToFix": "How to fix:",
  "deepResult.criticalLabel": "Critical",
  "deepResult.highLabel": "High",
  "deepResult.mediumLabel": "Medium",
  "deepResult.lowLabel": "Low",

  // NotFound
  "notFound.title": "404 - Page Not Found",
  "notFound.desc": "The page you are looking for doesn't exist or has been moved.",
  "notFound.backHome": "Back to Home",
};
