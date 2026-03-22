# Saffe

**Ship fast. Stay Saffe.**

Saffe é uma plataforma SaaS de análise de segurança pensada para apps criados com ferramentas de IA — como Replit Agent, Cursor, Lovable, Bolt e v0. Fundadores não técnicos colam a URL do app e recebem um relatório completo de vulnerabilidades com prompts prontos para corrigir direto na ferramenta de IA.

---

## O Problema

O "vibe coding" democratizou a criação de software. Qualquer pessoa pode criar e publicar um app em minutos usando IA. Mas essas ferramentas não foram feitas para checar segurança — **70% dos apps gerados por IA têm brechas críticas** (OWASP/Snyk 2024).

APIs expostas, chaves vazadas, CORS aberto: vulnerabilidades reais que chegam a produção porque ninguém fez a pergunta certa. Ferramentas como Snyk e SonarQube existem, mas foram feitas para devs experientes. Saffe é a primeira solução pensada para quem usa IA para criar e não tem background de segurança.

## Como Funciona

Saffe opera em três camadas de proteção:

### 1. Scan de URL
Cole a URL do seu app. Saffe analisa headers HTTP, endpoints expostos, configurações de CORS, cookies inseguros e presença de dados sensíveis em respostas públicas.

**O que verificamos:**
- Chaves de API e segredos expostos no JS público
- Content Security Policy (CSP) ausente
- Configurações CORS excessivamente permissivas
- Flags de Cookie inseguros (HttpOnly/Secure ausentes)
- Arquivos sensíveis expostos (.env, /admin)
- Strict-Transport-Security (HSTS) ausente

### 2. Deep Code Scan (GitHub + Gemini AI)
Conecte seu repositório GitHub. A IA Gemini analisa o código-fonte em busca de vulnerabilidades OWASP, chaves hardcoded e lógica de autenticação fraca. Para cada vulnerabilidade encontrada, gera um **prompt pronto para usar** na sua ferramenta de IA para corrigir o problema.

### 3. Estimativa de Custo Dev
Calcula o custo estimado para corrigir cada vulnerabilidade por um desenvolvedor humano — usando [SCC](https://github.com/boyter/scc) para análise de complexidade do código — justificando o investimento em segurança com dados reais.

## Classificação de Risco

Cada vulnerabilidade recebe um nível de severidade:

| Nível | Cor | Descrição |
|-------|-----|-----------|
| Crítico | Vermelho | Risco imediato de exploração |
| Alto | Laranja | Vulnerabilidade séria que precisa atenção |
| Médio | Amarelo | Risco moderado, deve ser corrigido |
| Baixo | Verde | Melhoria recomendada |

## Stack Técnica

### Frontend
- **React** + **Vite** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Wouter** (roteamento client-side)
- **Framer Motion** (animações)
- **TanStack React Query** (gerenciamento de estado do servidor)
- Design inspirado na Apple: Inter weight 200, fundo branco, azul `hsl(212, 100%, 44%)`

### Backend
- **Express 5** + **TypeScript**
- **Drizzle ORM** + **PostgreSQL**
- **Resend** (envio de relatórios por e-mail)
- **GitHub API** (acesso ao código-fonte para Deep Scan)
- **Gemini AI** via Replit AI Integrations (análise de vulnerabilidades)
- **OpenID Connect** via Replit Auth (autenticação)

### Infraestrutura
- **pnpm workspace** (monorepo)
- **Replit** (hosting, banco de dados, deploy)
- Interface bilíngue: **Português (BR)** e **Inglês**

## Estrutura do Projeto

```
artifacts/
├── saffe/                 # App principal (React + Vite)
│   └── src/
│       ├── pages/         # Home, Dashboard, NewScan, DeepScan, ScanReport, CostEstimator
│       ├── components/    # UI components (shadcn/ui), layout, animations
│       ├── contexts/      # LanguageContext (i18n PT/EN)
│       └── hooks/         # useAuth, useDeepScan, etc.
├── api-server/            # API Express
│   └── src/
│       └── routes/        # auth, scans, jules-scan (deep scan), cost-analysis, verify
├── saffe-pitch/           # Pitch Deck (7 slides, React)
└── saffe-video/           # Vídeo animado de apresentação (React + Framer Motion)
```

## Rodando Localmente

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
# DATABASE_URL (PostgreSQL)
# RESEND_API_KEY (envio de e-mails)
# GITHUB_PERSONAL_ACCESS_TOKEN (Deep Code Scan)

# Rodar todos os serviços
pnpm --filter @workspace/saffe run dev          # Frontend principal
pnpm --filter @workspace/api-server run dev      # API
pnpm --filter @workspace/saffe-pitch run dev     # Pitch Deck
pnpm --filter @workspace/saffe-video run dev     # Vídeo
```

## Contexto

Saffe foi construído para o **Replit + Resend Hackathon** na **42 São Paulo** (Março 2026). O projeto demonstra como a integração de IA (Gemini) com análise de segurança automatizada pode proteger a nova geração de criadores de software que usam ferramentas de "vibe coding" sem background técnico em segurança.

A OWASP lançou sua primeira solução de segurança para GenAI apenas em fevereiro de 2026 — os padrões de segurança não acompanharam o crescimento explosivo do desenvolvimento com IA. Saffe preenche essa lacuna.

## Licença

Projeto privado — todos os direitos reservados.
