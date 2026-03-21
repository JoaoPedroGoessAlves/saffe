export default function Slide4ComoFunciona() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1A1919" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 100%, rgba(255,59,0,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: "4px", background: "#FF3B00" }}
      />

      <div
        className="relative flex h-full flex-col"
        style={{ paddingLeft: "8vw", paddingRight: "8vw", paddingTop: "7vh", paddingBottom: "7vh" }}
      >
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
            03 — Como Funciona
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
            Três camadas de proteção para seu app
          </h2>
        </div>

        <div
          className="flex flex-1"
          style={{ gap: "2vw", marginTop: "5vh", alignItems: "stretch" }}
        >
          <div
            style={{
              flex: 1,
              background: "#222020",
              border: "1px solid #2E2B2B",
              padding: "3.5vh 2.5vw",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "#FF3B00",
              }}
            />
            <div
              style={{
                width: "3.5vw",
                height: "3.5vw",
                background: "rgba(255,59,0,0.15)",
                border: "1px solid rgba(255,59,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2.5vh",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#FF3B00" strokeWidth="2" strokeLinecap="square" style={{ width: "1.8vw", height: "1.8vw" }}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div
              style={{
                fontSize: "0.8vw",
                color: "#FF3B00",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "1vh",
              }}
            >
              01
            </div>
            <h3
              style={{
                fontSize: "1.6vw",
                fontWeight: 800,
                color: "#F8F5F1",
                margin: 0,
                marginBottom: "1.5vh",
                letterSpacing: "-0.02em",
              }}
            >
              Scan de URL
            </h3>
            <p style={{ fontSize: "1.1vw", color: "#9A9A9A", lineHeight: 1.6, margin: 0 }}>
              Informe a URL do seu app. Saffe analisa headers HTTP, endpoints expostos, configurações de CORS e presença de dados sensíveis em respostas públicas.
            </p>
          </div>

          <div
            style={{
              flex: 1,
              background: "#222020",
              border: "1px solid #FF3B00",
              padding: "3.5vh 2.5vw",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "#FF3B00",
              }}
            />
            <div
              style={{
                width: "3.5vw",
                height: "3.5vw",
                background: "rgba(255,59,0,0.2)",
                border: "1px solid rgba(255,59,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2.5vh",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#FF3B00" strokeWidth="2" strokeLinecap="square" style={{ width: "1.8vw", height: "1.8vw" }}>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </div>
            <div
              style={{
                fontSize: "0.8vw",
                color: "#FF3B00",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "1vh",
              }}
            >
              02
            </div>
            <h3
              style={{
                fontSize: "1.6vw",
                fontWeight: 800,
                color: "#F8F5F1",
                margin: 0,
                marginBottom: "1.5vh",
                letterSpacing: "-0.02em",
              }}
            >
              Deep Scan de Código
            </h3>
            <p style={{ fontSize: "1.1vw", color: "#9A9A9A", lineHeight: 1.6, margin: 0 }}>
              Conecte seu repositório GitHub. Gemini analisa o código-fonte em busca de vulnerabilidades OWASP, chaves hardcoded e lógica de autenticação fraca.
            </p>
          </div>

          <div
            style={{
              flex: 1,
              background: "#222020",
              border: "1px solid #2E2B2B",
              padding: "3.5vh 2.5vw",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "#FF3B00",
              }}
            />
            <div
              style={{
                width: "3.5vw",
                height: "3.5vw",
                background: "rgba(255,59,0,0.15)",
                border: "1px solid rgba(255,59,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2.5vh",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#FF3B00" strokeWidth="2" strokeLinecap="square" style={{ width: "1.8vw", height: "1.8vw" }}>
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div
              style={{
                fontSize: "0.8vw",
                color: "#FF3B00",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "1vh",
              }}
            >
              03
            </div>
            <h3
              style={{
                fontSize: "1.6vw",
                fontWeight: 800,
                color: "#F8F5F1",
                margin: 0,
                marginBottom: "1.5vh",
                letterSpacing: "-0.02em",
              }}
            >
              Estimativa de Custo Dev
            </h3>
            <p style={{ fontSize: "1.1vw", color: "#9A9A9A", lineHeight: 1.6, margin: 0 }}>
              Calcula o custo estimado para corrigir cada vulnerabilidade por um desenvolvedor humano — justificando o investimento em segurança com dados reais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
