import { Resend } from "resend";
import type { Scan, ScanResult } from "@workspace/db";

function getResendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not configured. Please add your Resend API key to send emails.");
  }
  return new Resend(key);
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#dc2626",
  high: "#ea580c",
  medium: "#d97706",
  low: "#65a30d",
  info: "#2563eb",
};

const SEVERITY_LABELS: Record<string, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
  info: "Info",
};

const RISK_COLORS: Record<string, string> = {
  critical: "#dc2626",
  high: "#ea580c",
  medium: "#d97706",
  low: "#16a34a",
};

const RISK_LABELS: Record<string, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
};

function buildEmailHtml(scan: Scan, results: ScanResult[]): string {
  const riskLevel = scan.riskLevel || "low";
  const riskColor = RISK_COLORS[riskLevel] || "#16a34a";
  const riskLabel = RISK_LABELS[riskLevel] || "Baixo";

  const failed = results.filter((r) => !r.passed);
  const passed = results.filter((r) => r.passed);

  const vulnerabilityCards = failed
    .map(
      (result) => `
    <div style="margin-bottom: 20px; border: 1px solid #e5e7eb; border-left: 4px solid ${SEVERITY_COLORS[result.severity] || "#6b7280"}; border-radius: 8px; overflow: hidden;">
      <div style="padding: 16px; background: #fafafa;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">${result.title}</h3>
          <span style="display: inline-block; padding: 2px 10px; border-radius: 12px; background: ${SEVERITY_COLORS[result.severity] || "#6b7280"}; color: white; font-size: 12px; font-weight: 600; white-space: nowrap; margin-left: 12px;">${SEVERITY_LABELS[result.severity] || result.severity}</span>
        </div>
        <p style="margin: 0 0 12px; color: #374151; font-size: 14px; line-height: 1.5;">${result.description}</p>
        ${
          result.fixSuggestion
            ? `<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px; margin-bottom: 8px;">
          <p style="margin: 0; font-size: 13px; color: #166534;"><strong>✅ Como corrigir:</strong> ${result.fixSuggestion}</p>
        </div>`
            : ""
        }
        ${
          result.vibePrompt
            ? `<div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px;">
          <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; color: #1e40af;">🤖 Prompt para sua ferramenta de IA (Lovable, Bolt, v0, Cursor):</p>
          <p style="margin: 0; font-size: 12px; color: #1d4ed8; font-family: monospace; background: white; padding: 8px; border-radius: 4px; white-space: pre-wrap;">${result.vibePrompt}</p>
        </div>`
            : ""
        }
      </div>
    </div>
  `,
    )
    .join("");

  const passedList = passed
    .map(
      (r) => `
    <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #374151; font-size: 14px;">
      <span style="color: #16a34a; margin-right: 8px;">✓</span> ${r.title}
    </li>
  `,
    )
    .join("");

  const technicalSection = results
    .map(
      (r) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; color: #374151;">${r.checkType}</td>
      <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; color: ${SEVERITY_COLORS[r.severity] || "#6b7280"}; font-weight: 600;">${r.severity.toUpperCase()}</td>
      <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; color: ${r.passed ? "#16a34a" : "#dc2626"};">${r.passed ? "PASSOU" : "FALHOU"}</td>
      <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; max-width: 300px;">${r.details || r.description}</td>
    </tr>
  `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Segurança Saffe</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 0;">
  <div style="max-width: 680px; margin: 0 auto; background: white;">

    <!-- Header -->
    <div style="background: #0f172a; padding: 32px 40px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: white; letter-spacing: -0.5px;">
        Saffe
      </h1>
      <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">Análise de Segurança</p>
    </div>

    <!-- Risk Level Banner -->
    <div style="background: ${riskColor}; padding: 24px 40px; text-align: center;">
      <p style="margin: 0 0 4px; font-size: 13px; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 1px;">Nível de Risco Geral</p>
      <h2 style="margin: 0; font-size: 40px; font-weight: 800; color: white;">${riskLabel.toUpperCase()}</h2>
      <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">Site analisado: <strong>${scan.url}</strong></p>
      <p style="margin: 4px 0 0; font-size: 12px; color: rgba(255,255,255,0.7);">
        ${failed.length} vulnerabilidade${failed.length !== 1 ? "s" : ""} encontrada${failed.length !== 1 ? "s" : ""} · ${passed.length} verificação${passed.length !== 1 ? "ões" : ""} aprovada${passed.length !== 1 ? "s" : ""}
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px;">

      ${
        failed.length > 0
          ? `
      <!-- Vulnerabilities -->
      <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #111827;">🔍 Vulnerabilidades Encontradas</h2>
      ${vulnerabilityCards}
      `
          : `
      <div style="text-align: center; padding: 32px; background: #f0fdf4; border-radius: 12px; margin-bottom: 32px;">
        <p style="font-size: 48px; margin: 0 0 8px;">🎉</p>
        <h2 style="margin: 0 0 8px; color: #166534;">Nenhuma vulnerabilidade crítica encontrada!</h2>
        <p style="margin: 0; color: #15803d;">Seu site passou em todas as verificações de segurança.</p>
      </div>
      `
      }

      ${
        passed.length > 0
          ? `
      <!-- Passed Checks -->
      <h2 style="margin: 32px 0 16px; font-size: 18px; font-weight: 700; color: #111827;">✅ Verificações Aprovadas</h2>
      <ul style="margin: 0; padding: 0; list-style: none; background: #f9fafb; border-radius: 8px; padding: 8px 16px;">
        ${passedList}
      </ul>
      `
          : ""
      }

      <!-- Encouraging message -->
      <div style="margin-top: 40px; padding: 24px; background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border-radius: 12px; text-align: center;">
        <p style="font-size: 24px; margin: 0 0 8px;">💪</p>
        <h3 style="margin: 0 0 8px; color: #1e40af; font-size: 16px;">Continue melhorando!</h3>
        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">
          ${
            failed.length === 0
              ? "Parabéns! Seu app está bem protegido. Continue monitorando regularmente para manter essa segurança."
              : `Não desanime! Cada correção que você faz torna seu app mais seguro para seus usuários. Use os prompts acima para corrigir as vulnerabilidades na sua ferramenta de IA favorita.`
          }
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
        <a href="https://saffe.app" style="display: inline-block; background: #0f172a; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Rodar Nova Análise →
        </a>
        <p style="margin: 16px 0 0; font-size: 13px; color: #9ca3af;">
          Análise realizada em ${new Date(scan.createdAt).toLocaleString("pt-BR")}
        </p>
      </div>
    </div>

    <!-- Technical Section -->
    <div style="padding: 0 40px 40px;">
      <details>
        <summary style="cursor: pointer; font-size: 14px; font-weight: 600; color: #6b7280; padding: 16px 0; border-top: 1px solid #e5e7eb; user-select: none;">
          🔬 Seção Técnica (para profissionais de segurança)
        </summary>
        <div style="margin-top: 16px; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 12px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left; color: #374151;">Check</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left; color: #374151;">Severidade</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left; color: #374151;">Status</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left; color: #374151;">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              ${technicalSection}
            </tbody>
          </table>
          <p style="margin-top: 12px; font-size: 11px; color: #9ca3af;">
            Site: ${scan.url} | Scan ID: ${scan.id} | Data: ${new Date(scan.createdAt).toISOString()}
          </p>
        </div>
      </details>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 13px; color: #9ca3af;">
        Saffe · Análise de segurança para apps criados com IA<br>
        Este relatório foi gerado automaticamente. Para mais informações, acesse <a href="https://saffe.app" style="color: #0f172a; text-decoration: none;">saffe.app</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendScanReportEmail(
  to: string,
  scan: Scan,
  results: ScanResult[],
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const html = buildEmailHtml(scan, results);
    const riskLabel = RISK_LABELS[scan.riskLevel || "low"] || "Baixo";

    const { error } = await resend.emails.send({
      from: "Saffe <noreply@saffe.app>",
      to,
      subject: `Relatório de Segurança Saffe: Risco ${riskLabel} — ${scan.domain}`,
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
