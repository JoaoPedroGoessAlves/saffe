export default function Slide3Solucao() {
  const blue = "hsl(212, 100%, 56%)";
  const blueLight = "rgba(30, 144, 255, 0.10)";
  const blueBorder = "rgba(30, 144, 255, 0.22)";

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#121212", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 20% 50%, rgba(30,144,255,0.08) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: "4px", background: "#2997ff" }}
      />

      <div
        className="relative flex h-full"
        style={{ paddingLeft: "8vw", paddingRight: "8vw", paddingTop: "7vh", paddingBottom: "7vh" }}
      >
        <div className="flex flex-col justify-between h-full w-full">
          <div>
            <div
              style={{
                fontSize: "1vw",
                color: blue,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 500,
                marginBottom: "1.5vh",
              }}
            >
              02 — A Solução
            </div>
          </div>

          <div className="flex items-center gap-[6vw] flex-1" style={{ paddingTop: "2vh", paddingBottom: "2vh" }}>
            <div style={{ flex: "0 0 45vw" }}>
              <h2
                style={{
                  fontSize: "4.2vw",
                  fontWeight: 200,
                  color: "hsl(0, 0%, 95%)",
                  letterSpacing: "-0.05em",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                Saffe escaneia seu app e encontra vulnerabilidades antes que alguém mal-intencionado o faça.
              </h2>
              <p
                style={{
                  fontSize: "1.4vw",
                  color: "hsl(0, 0%, 55%)",
                  marginTop: "2.5vh",
                  lineHeight: 1.6,
                  maxWidth: "38vw",
                  fontWeight: 300,
                }}
              >
                Uma ferramenta pensada para o movimento vibe coding — onde a velocidade de criação supera a consciência de segurança. Saffe fecha essa lacuna, automaticamente.
              </p>
              <div
                style={{
                  display: "inline-block",
                  marginTop: "3vh",
                  padding: "1.2vh 2.5vw",
                  background: blue,
                  fontSize: "1.2vw",
                  fontWeight: 500,
                  color: "#ffffff",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  borderRadius: "0.5vw",
                }}
              >
                Ship fast. Stay Saffe.
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid rgba(255,255,255,0.10)`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.40), 0 1px 4px rgba(0,0,0,0.30)",
                padding: "2.5vh 2vw",
                fontFamily: "monospace",
                borderRadius: "1vw",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.5vw",
                  marginBottom: "1.5vh",
                  paddingBottom: "1.5vh",
                  borderBottom: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <div style={{ width: "0.8vw", height: "0.8vw", background: "#FF5F57", borderRadius: "50%" }} />
                <div style={{ width: "0.8vw", height: "0.8vw", background: "#FEBC2E", borderRadius: "50%" }} />
                <div style={{ width: "0.8vw", height: "0.8vw", background: "#28C840", borderRadius: "50%" }} />
                <span style={{ marginLeft: "1vw", fontSize: "0.9vw", color: "hsl(0, 0%, 55%)", fontFamily: "monospace" }}>saffe-report.json</span>
              </div>
              <div className="flex flex-col" style={{ gap: "1.2vh" }}>
                <div style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.28)", padding: "1vh 1.2vw", borderRadius: "0.5vw" }}>
                  <div style={{ fontSize: "0.85vw", color: "#dc2626", fontWeight: 600, marginBottom: "0.5vh" }}>CRITICAL — Chave de API exposta</div>
                  <div style={{ fontSize: "0.85vw", color: "hsl(0, 0%, 55%)" }}>Arquivo: /src/config.js · Linha 42</div>
                </div>
                <div style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.28)", padding: "1vh 1.2vw", borderRadius: "0.5vw" }}>
                  <div style={{ fontSize: "0.85vw", color: "#d97706", fontWeight: 600, marginBottom: "0.5vh" }}>HIGH — CORS aberto para qualquer origem</div>
                  <div style={{ fontSize: "0.85vw", color: "hsl(0, 0%, 55%)" }}>Rota: /api/* · Access-Control-Allow-Origin: *</div>
                </div>
                <div style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.28)", padding: "1vh 1.2vw", borderRadius: "0.5vw" }}>
                  <div style={{ fontSize: "0.85vw", color: "#d97706", fontWeight: 600, marginBottom: "0.5vh" }}>HIGH — Endpoint sem autenticação</div>
                  <div style={{ fontSize: "0.85vw", color: "hsl(0, 0%, 55%)" }}>GET /admin/users · sem token de sessão</div>
                </div>
                <div style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.28)", padding: "1vh 1.2vw", borderRadius: "0.5vw" }}>
                  <div style={{ fontSize: "0.85vw", color: "#10b981", fontWeight: 600, marginBottom: "0.5vh" }}>INFO — Headers de segurança ausentes</div>
                  <div style={{ fontSize: "0.85vw", color: "hsl(0, 0%, 55%)" }}>CSP, X-Frame-Options, HSTS não configurados</div>
                </div>
              </div>
              <div
                style={{
                  marginTop: "1.5vh",
                  paddingTop: "1.5vh",
                  borderTop: "1px solid rgba(255,255,255,0.10)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "0.85vw", color: "hsl(0, 0%, 55%)" }}>4 vulnerabilidades encontradas</span>
                <span style={{ fontSize: "0.85vw", color: "#dc2626", fontWeight: 600 }}>Risco: CRÍTICO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
