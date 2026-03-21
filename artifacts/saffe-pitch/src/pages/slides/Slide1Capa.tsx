export default function Slide1Capa() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1A1919" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,59,0,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "2px", background: "#FF3B00" }}
      />
      <div
        className="absolute top-0 left-0 h-full"
        style={{ width: "4px", background: "#FF3B00" }}
      />
      <div className="relative flex h-full flex-col justify-between px-[8vw] py-[8vh]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[1vw]">
            <div
              className="flex items-center justify-center"
              style={{
                width: "3.2vw",
                height: "3.2vw",
                background: "#FF3B00",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F8F5F1"
                strokeWidth="2.2"
                strokeLinecap="square"
                style={{ width: "1.8vw", height: "1.8vw" }}
              >
                <path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6L12 2z" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "2.2vw",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#F8F5F1",
              }}
            >
              Saffe
            </span>
          </div>
          <div
            style={{
              fontSize: "1.1vw",
              color: "#F8F5F1",
              background: "rgba(255,59,0,0.15)",
              border: "1px solid rgba(255,59,0,0.5)",
              padding: "0.5vh 1.5vw",
              letterSpacing: "0.08em",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Replit + Resend Hackathon · 42 São Paulo
          </div>
        </div>

        <div style={{ maxWidth: "65vw" }}>
          <div
            style={{
              fontSize: "1.1vw",
              color: "#9A9A9A",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: "2vh",
            }}
          >
            Apresentamos
          </div>
          <h1
            style={{
              fontSize: "10vw",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              color: "#F8F5F1",
              margin: 0,
            }}
          >
            Saffe
          </h1>
          <p
            style={{
              fontSize: "2.4vw",
              color: "#FF3B00",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              marginTop: "2vh",
            }}
          >
            Ship fast. Stay Saffe.
          </p>
          <p
            style={{
              fontSize: "1.5vw",
              color: "#9A9A9A",
              fontWeight: 400,
              marginTop: "1.5vh",
              maxWidth: "45vw",
              lineHeight: 1.5,
            }}
          >
            Segurança automatizada para apps gerados por IA — antes que o problema chegue à produção.
          </p>
        </div>

        <div
          style={{
            fontSize: "1.1vw",
            color: "#9A9A9A",
            fontWeight: 400,
          }}
        >
          21 de Março, 2026
        </div>
      </div>
    </div>
  );
}
