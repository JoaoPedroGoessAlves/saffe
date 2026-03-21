export default function Slide6PorQueAgora() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1A1919" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 0% 50%, rgba(255,59,0,0.10) 0%, transparent 65%)",
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
                marginBottom: "1vh",
              }}
            >
              05 — Por Que Agora
            </div>
            <h2
              style={{
                fontSize: "3.5vw",
                fontWeight: 800,
                color: "#F8F5F1",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              A janela de oportunidade é agora.
            </h2>
          </div>

          <div className="flex" style={{ gap: "4vw", flex: 1, marginTop: "5vh" }}>
            <div className="flex flex-col" style={{ gap: "2.5vh", flex: 1 }}>
              <div
                style={{
                  background: "#222020",
                  border: "1px solid #2E2B2B",
                  padding: "2.5vh 2vw",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "3px",
                    background: "#FF3B00",
                  }}
                />
                <div style={{ fontSize: "3.5vw", fontWeight: 900, color: "#FF3B00", lineHeight: 1 }}>
                  45M+
                </div>
                <div style={{ fontSize: "1.1vw", color: "#F8F5F1", fontWeight: 600, marginTop: "0.5vh" }}>
                  apps criados por IA em 2024
                </div>
                <div style={{ fontSize: "1vw", color: "#9A9A9A", marginTop: "0.5vh" }}>
                  crescimento de 10x em 18 meses
                </div>
              </div>
              <div
                style={{
                  background: "#222020",
                  border: "1px solid #2E2B2B",
                  padding: "2.5vh 2vw",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "3px",
                    background: "#FF3B00",
                  }}
                />
                <div style={{ fontSize: "3.5vw", fontWeight: 900, color: "#FF3B00", lineHeight: 1 }}>
                  OWASP
                </div>
                <div style={{ fontSize: "1.1vw", color: "#F8F5F1", fontWeight: 600, marginTop: "0.5vh" }}>
                  Top 10 — ainda sem solução para IA
                </div>
                <div style={{ fontSize: "1vw", color: "#9A9A9A", marginTop: "0.5vh" }}>
                  padrões de vulnerabilidade idênticos há 5 anos
                </div>
              </div>
              <div
                style={{
                  background: "#222020",
                  border: "1px solid #2E2B2B",
                  padding: "2.5vh 2vw",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "3px",
                    background: "#FF3B00",
                  }}
                />
                <div style={{ fontSize: "3.5vw", fontWeight: 900, color: "#FF3B00", lineHeight: 1 }}>
                  $0
                </div>
                <div style={{ fontSize: "1.1vw", color: "#F8F5F1", fontWeight: 600, marginTop: "0.5vh" }}>
                  custo para o usuário final
                </div>
                <div style={{ fontSize: "1vw", color: "#9A9A9A", marginTop: "0.5vh" }}>
                  freemium — escala com o ecossistema
                </div>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                borderLeft: "1px solid #2E2B2B",
                paddingLeft: "4vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "3vh",
              }}
            >
              <p style={{ fontSize: "1.5vw", color: "#F8F5F1", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                "Vibe coding" não é uma moda — é uma nova categoria de criador de software. O mercado de ferramentas de segurança ainda não acordou para esse público.
              </p>
              <p style={{ fontSize: "1.3vw", color: "#9A9A9A", lineHeight: 1.6, margin: 0 }}>
                Ferramentas existentes como Snyk e SonarQube foram feitas para devs experientes. Saffe é a primeira solução pensada para quem usa IA para criar e não tem background de segurança.
              </p>
              <p style={{ fontSize: "1.3vw", color: "#9A9A9A", lineHeight: 1.6, margin: 0 }}>
                A integração com Gemini e GitHub nos dá profundidade técnica que nenhum scanner de URL consegue replicar. E o Replit é o epicentro desse movimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
