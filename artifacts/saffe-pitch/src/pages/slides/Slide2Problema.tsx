export default function Slide2Problema() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1A1919" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(255,59,0,0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: "4px", background: "#FF3B00" }}
      />

      <div className="relative flex h-full" style={{ paddingLeft: "8vw", paddingRight: "8vw", paddingTop: "8vh", paddingBottom: "8vh" }}>
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
              01 — O Problema
            </div>
            <h2
              style={{
                fontSize: "3.5vw",
                fontWeight: 800,
                color: "#F8F5F1",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                margin: 0,
                maxWidth: "55vw",
              }}
            >
              O vibe coding chegou. A segurança ainda não.
            </h2>
          </div>

          <div className="flex items-center gap-[6vw]">
            <div style={{ flex: "0 0 auto" }}>
              <div
                style={{
                  fontSize: "16vw",
                  fontWeight: 900,
                  letterSpacing: "-0.06em",
                  lineHeight: 1,
                  color: "#FF3B00",
                }}
              >
                70%
              </div>
              <div
                style={{
                  fontSize: "1.4vw",
                  color: "#F8F5F1",
                  fontWeight: 600,
                  maxWidth: "36vw",
                  lineHeight: 1.4,
                  marginTop: "1vh",
                }}
              >
                dos apps gerados por IA têm brechas críticas de segurança
              </div>
            </div>

            <div
              style={{
                flex: 1,
                borderLeft: "1px solid #2E2B2B",
                paddingLeft: "4vw",
              }}
            >
              <div className="flex flex-col gap-[3vh]">
                <div>
                  <div
                    style={{
                      width: "2.5vw",
                      height: "2px",
                      background: "#FF3B00",
                      marginBottom: "1.5vh",
                    }}
                  />
                  <p style={{ fontSize: "1.3vw", color: "#9A9A9A", lineHeight: 1.5, margin: 0 }}>
                    Qualquer pessoa pode criar um app hoje. O Replit Agent, Cursor, Lovable — ferramentas poderosas, mas que não foram feitas para checar segurança.
                  </p>
                </div>
                <div>
                  <div
                    style={{
                      width: "2.5vw",
                      height: "2px",
                      background: "#FF3B00",
                      marginBottom: "1.5vh",
                    }}
                  />
                  <p style={{ fontSize: "1.3vw", color: "#9A9A9A", lineHeight: 1.5, margin: 0 }}>
                    APIs expostas, chaves vazadas, CORS aberto: vulnerabilidades reais que chegam a produção porque ninguém fez a pergunta certa.
                  </p>
                </div>
                <div>
                  <div
                    style={{
                      width: "2.5vw",
                      height: "2px",
                      background: "#FF3B00",
                      marginBottom: "1.5vh",
                    }}
                  />
                  <p style={{ fontSize: "1.3vw", color: "#9A9A9A", lineHeight: 1.5, margin: 0 }}>
                    O desenvolvedor virou usuário. Mas o risco de segurança continuou sendo de desenvolvedor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: "1vw",
              color: "#9A9A9A",
              letterSpacing: "0.05em",
            }}
          >
            Fonte: OWASP Top 10 · Snyk State of Security 2024
          </div>
        </div>
      </div>
    </div>
  );
}
