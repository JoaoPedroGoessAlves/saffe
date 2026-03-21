export default function Slide6PorQueAgora() {
  const blue = "hsl(212, 100%, 56%)";
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
            "radial-gradient(ellipse 60% 50% at 0% 50%, rgba(30,144,255,0.07) 0%, transparent 65%)",
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
                marginBottom: "1vh",
              }}
            >
              05 — Por Que Agora
            </div>
            <h2
              style={{
                fontSize: "3.5vw",
                fontWeight: 200,
                color: "hsl(0, 0%, 95%)",
                letterSpacing: "-0.04em",
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
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.40), 0 1px 4px rgba(0,0,0,0.30)",
                  padding: "2.5vh 2vw",
                  position: "relative",
                  borderRadius: "0.8vw",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "3px",
                    background: blue,
                    borderRadius: "0.8vw 0 0 0.8vw",
                  }}
                />
                <div style={{ fontSize: "3.5vw", fontWeight: 200, color: blue, lineHeight: 1, letterSpacing: "-0.04em" }}>
                  45M+
                </div>
                <div style={{ fontSize: "1.1vw", color: "hsl(0, 0%, 95%)", fontWeight: 400, marginTop: "0.5vh" }}>
                  apps criados por IA em 2024
                </div>
                <div style={{ fontSize: "1vw", color: "hsl(0, 0%, 55%)", marginTop: "0.5vh", fontWeight: 300 }}>
                  crescimento de 10x em 18 meses
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.40), 0 1px 4px rgba(0,0,0,0.30)",
                  padding: "2.5vh 2vw",
                  position: "relative",
                  borderRadius: "0.8vw",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "3px",
                    background: blue,
                    borderRadius: "0.8vw 0 0 0.8vw",
                  }}
                />
                <div style={{ fontSize: "3.5vw", fontWeight: 200, color: blue, lineHeight: 1, letterSpacing: "-0.04em" }}>
                  OWASP
                </div>
                <div style={{ fontSize: "1.1vw", color: "hsl(0, 0%, 95%)", fontWeight: 400, marginTop: "0.5vh" }}>
                  Top 10 — ainda sem solução para IA
                </div>
                <div style={{ fontSize: "1vw", color: "hsl(0, 0%, 55%)", marginTop: "0.5vh", fontWeight: 300 }}>
                  padrões de vulnerabilidade idênticos há 5 anos
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.40), 0 1px 4px rgba(0,0,0,0.30)",
                  padding: "2.5vh 2vw",
                  position: "relative",
                  borderRadius: "0.8vw",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "3px",
                    background: blue,
                    borderRadius: "0.8vw 0 0 0.8vw",
                  }}
                />
                <div style={{ fontSize: "3.5vw", fontWeight: 200, color: blue, lineHeight: 1, letterSpacing: "-0.04em" }}>
                  $0
                </div>
                <div style={{ fontSize: "1.1vw", color: "hsl(0, 0%, 95%)", fontWeight: 400, marginTop: "0.5vh" }}>
                  custo para o usuário final
                </div>
                <div style={{ fontSize: "1vw", color: "hsl(0, 0%, 55%)", marginTop: "0.5vh", fontWeight: 300 }}>
                  freemium — escala com o ecossistema
                </div>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                borderLeft: `1px solid ${blueBorder}`,
                paddingLeft: "4vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "3vh",
              }}
            >
              <p style={{ fontSize: "1.5vw", color: "hsl(0, 0%, 95%)", fontWeight: 300, lineHeight: 1.6, margin: 0, letterSpacing: "-0.01em" }}>
                "Vibe coding" não é uma moda — é uma nova categoria de criador de software. O mercado de ferramentas de segurança ainda não acordou para esse público.
              </p>
              <p style={{ fontSize: "1.3vw", color: "hsl(0, 0%, 55%)", lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                Ferramentas existentes como Snyk e SonarQube foram feitas para devs experientes. Saffe é a primeira solução pensada para quem usa IA para criar e não tem background de segurança.
              </p>
              <p style={{ fontSize: "1.3vw", color: "hsl(0, 0%, 55%)", lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                A integração com Gemini e GitHub nos dá profundidade técnica que nenhum scanner de URL consegue replicar. E o Replit é o epicentro desse movimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
