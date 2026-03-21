export default function Slide7Encerramento() {
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
            "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(30,144,255,0.09) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "4px", background: "#2997ff" }}
      />
      <div
        className="absolute top-0 right-0 h-full"
        style={{ width: "4px", background: "#2997ff" }}
      />

      <div
        className="relative flex h-full flex-col items-center justify-center"
        style={{ textAlign: "center", paddingLeft: "10vw", paddingRight: "10vw" }}
      >
        <div className="flex items-center justify-center" style={{ gap: "1.5vw", marginBottom: "5vh" }}>
          <div
            style={{
              width: "4.5vw",
              height: "4.5vw",
              background: blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "1vw",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "2.6vw", height: "2.6vw" }}
            >
              <path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6L12 2z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "3.5vw",
              fontWeight: 200,
              letterSpacing: "-0.05em",
              color: "hsl(0, 0%, 95%)",
            }}
          >
            Saffe
          </span>
        </div>

        <h1
          style={{
            fontSize: "6vw",
            fontWeight: 200,
            letterSpacing: "-0.06em",
            lineHeight: 1.0,
            color: "hsl(0, 0%, 95%)",
            margin: 0,
          }}
        >
          Ship fast.
        </h1>
        <h1
          style={{
            fontSize: "6vw",
            fontWeight: 200,
            letterSpacing: "-0.06em",
            lineHeight: 1.0,
            color: blue,
            margin: 0,
          }}
        >
          Stay Saffe.
        </h1>

        <div
          style={{
            width: "8vw",
            height: "2px",
            background: "#2997ff",
            margin: "4vh auto",
          }}
        />

        <p
          style={{
            fontSize: "1.3vw",
            color: "hsl(0, 0%, 55%)",
            lineHeight: 1.6,
            maxWidth: "40vw",
            fontWeight: 300,
          }}
        >
          Segurança automatizada para o ecossistema de apps gerados por IA. Construído no Hackathon Replit + Resend · 42 São Paulo.
        </p>

        <div
          className="flex items-center"
          style={{ gap: "4vw", marginTop: "5vh" }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.9vw", color: "hsl(0, 0%, 55%)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5vh", fontWeight: 400 }}>
              Equipe
            </div>
            <div style={{ fontSize: "1.3vw", color: "hsl(0, 0%, 95%)", fontWeight: 400 }}>
              Saffe Team
            </div>
          </div>
          <div style={{ width: "1px", height: "4vh", background: "rgba(255,255,255,0.12)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.9vw", color: "hsl(0, 0%, 55%)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5vh", fontWeight: 400 }}>
              Evento
            </div>
            <div style={{ fontSize: "1.3vw", color: "hsl(0, 0%, 95%)", fontWeight: 400 }}>
              Replit + Resend Hackathon
            </div>
          </div>
          <div style={{ width: "1px", height: "4vh", background: "rgba(255,255,255,0.12)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.9vw", color: "hsl(0, 0%, 55%)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5vh", fontWeight: 400 }}>
              Data
            </div>
            <div style={{ fontSize: "1.3vw", color: "hsl(0, 0%, 95%)", fontWeight: 400 }}>
              21 de Março, 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
