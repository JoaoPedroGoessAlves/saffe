export default function Slide7Encerramento() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1A1919" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(255,59,0,0.15) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "4px", background: "#FF3B00" }}
      />
      <div
        className="absolute top-0 right-0 h-full"
        style={{ width: "4px", background: "#FF3B00" }}
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
              background: "#FF3B00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F8F5F1"
              strokeWidth="2.2"
              strokeLinecap="square"
              style={{ width: "2.6vw", height: "2.6vw" }}
            >
              <path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6L12 2z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "3.5vw",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#F8F5F1",
            }}
          >
            Saffe
          </span>
        </div>

        <h1
          style={{
            fontSize: "6vw",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1.0,
            color: "#F8F5F1",
            margin: 0,
          }}
        >
          Ship fast.
        </h1>
        <h1
          style={{
            fontSize: "6vw",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1.0,
            color: "#FF3B00",
            margin: 0,
          }}
        >
          Stay Saffe.
        </h1>

        <div
          style={{
            width: "8vw",
            height: "2px",
            background: "#FF3B00",
            margin: "4vh auto",
          }}
        />

        <p
          style={{
            fontSize: "1.3vw",
            color: "#9A9A9A",
            lineHeight: 1.6,
            maxWidth: "40vw",
          }}
        >
          Segurança automatizada para o ecossistema de apps gerados por IA. Construído no Hackathon Replit + Resend · 42 São Paulo.
        </p>

        <div
          className="flex items-center"
          style={{ gap: "4vw", marginTop: "5vh" }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.9vw", color: "#9A9A9A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5vh" }}>
              Equipe
            </div>
            <div style={{ fontSize: "1.3vw", color: "#F8F5F1", fontWeight: 700 }}>
              Saffe Team
            </div>
          </div>
          <div style={{ width: "1px", height: "4vh", background: "#2E2B2B" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.9vw", color: "#9A9A9A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5vh" }}>
              Evento
            </div>
            <div style={{ fontSize: "1.3vw", color: "#F8F5F1", fontWeight: 700 }}>
              Replit + Resend Hackathon
            </div>
          </div>
          <div style={{ width: "1px", height: "4vh", background: "#2E2B2B" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.9vw", color: "#9A9A9A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5vh" }}>
              Data
            </div>
            <div style={{ fontSize: "1.3vw", color: "#F8F5F1", fontWeight: 700 }}>
              21 de Março, 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
