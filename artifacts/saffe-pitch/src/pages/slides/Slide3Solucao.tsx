export default function Slide3Solucao() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1A1919" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 20% 50%, rgba(255,59,0,0.10) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: "4px", background: "#FF3B00" }}
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
                color: "#FF3B00",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
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
                  fontWeight: 900,
                  color: "#F8F5F1",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                Saffe escaneia seu app e encontra vulnerabilidades antes que alguém mal-intencionado o faça.
              </h2>
              <p
                style={{
                  fontSize: "1.4vw",
                  color: "#9A9A9A",
                  marginTop: "2.5vh",
                  lineHeight: 1.6,
                  maxWidth: "38vw",
                }}
              >
                Uma ferramenta pensada para o movimento vibe coding — onde a velocidade de criação supera a consciência de segurança. Saffe fecha essa lacuna, automaticamente.
              </p>
              <div
                style={{
                  display: "inline-block",
                  marginTop: "3vh",
                  padding: "1.2vh 2.5vw",
                  background: "#FF3B00",
                  fontSize: "1.2vw",
                  fontWeight: 700,
                  color: "#F8F5F1",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Ship fast. Stay Saffe.
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: "#222020",
                border: "1px solid #2E2B2B",
                padding: "2.5vh 2vw",
                fontFamily: "monospace",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.5vw",
                  marginBottom: "1.5vh",
                  paddingBottom: "1.5vh",
                  borderBottom: "1px solid #2E2B2B",
                }}
              >
                <div style={{ width: "0.8vw", height: "0.8vw", background: "#FF5F57" }} />
                <div style={{ width: "0.8vw", height: "0.8vw", background: "#FEBC2E" }} />
                <div style={{ width: "0.8vw", height: "0.8vw", background: "#28C840" }} />
                <span style={{ marginLeft: "1vw", fontSize: "0.9vw", color: "#9A9A9A" }}>saffe-report.json</span>
              </div>
              <div className="flex flex-col" style={{ gap: "1.2vh" }}>
                <div style={{ background: "rgba(255,59,0,0.12)", border: "1px solid rgba(255,59,0,0.35)", padding: "1vh 1.2vw" }}>
                  <div style={{ fontSize: "0.85vw", color: "#FF3B00", fontWeight: 700, marginBottom: "0.5vh" }}>CRITICAL — Chave de API exposta</div>
                  <div style={{ fontSize: "0.85vw", color: "#9A9A9A" }}>Arquivo: /src/config.js · Linha 42</div>
                </div>
                <div style={{ background: "rgba(255,165,0,0.08)", border: "1px solid rgba(255,165,0,0.25)", padding: "1vh 1.2vw" }}>
                  <div style={{ fontSize: "0.85vw", color: "#FEBC2E", fontWeight: 700, marginBottom: "0.5vh" }}>HIGH — CORS aberto para qualquer origem</div>
                  <div style={{ fontSize: "0.85vw", color: "#9A9A9A" }}>Rota: /api/* · Access-Control-Allow-Origin: *</div>
                </div>
                <div style={{ background: "rgba(255,165,0,0.08)", border: "1px solid rgba(255,165,0,0.25)", padding: "1vh 1.2vw" }}>
                  <div style={{ fontSize: "0.85vw", color: "#FEBC2E", fontWeight: 700, marginBottom: "0.5vh" }}>HIGH — Endpoint sem autenticação</div>
                  <div style={{ fontSize: "0.85vw", color: "#9A9A9A" }}>GET /admin/users · sem token de sessão</div>
                </div>
                <div style={{ background: "rgba(100,255,100,0.06)", border: "1px solid rgba(100,255,100,0.2)", padding: "1vh 1.2vw" }}>
                  <div style={{ fontSize: "0.85vw", color: "#28C840", fontWeight: 700, marginBottom: "0.5vh" }}>INFO — Headers de segurança ausentes</div>
                  <div style={{ fontSize: "0.85vw", color: "#9A9A9A" }}>CSP, X-Frame-Options, HSTS não configurados</div>
                </div>
              </div>
              <div
                style={{
                  marginTop: "1.5vh",
                  paddingTop: "1.5vh",
                  borderTop: "1px solid #2E2B2B",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "0.85vw", color: "#9A9A9A" }}>4 vulnerabilidades encontradas</span>
                <span style={{ fontSize: "0.85vw", color: "#FF3B00", fontWeight: 700 }}>Risco: CRÍTICO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
