export default function Slide1Capa() {
  const blue = "hsl(212, 100%, 44%)";
  const blueLight = "rgba(0, 112, 224, 0.08)";
  const blueMid = "rgba(0, 112, 224, 0.18)";
  const blueBorder = "rgba(0, 112, 224, 0.25)";

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#ffffff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,112,224,0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "2px", background: blue }}
      />
      <div
        className="absolute top-0 left-0 h-full"
        style={{ width: "4px", background: blue }}
      />

      <div className="relative flex h-full flex-col justify-between px-[8vw] py-[8vh]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[1vw]">
            <div
              className="flex items-center justify-center"
              style={{
                width: "3.2vw",
                height: "3.2vw",
                background: blue,
                borderRadius: "0.5vw",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "1.8vw", height: "1.8vw" }}
              >
                <path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6L12 2z" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "2.2vw",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                color: "#1c1c1e",
              }}
            >
              Saffe
            </span>
          </div>
          <div
            style={{
              fontSize: "1.1vw",
              color: blue,
              background: blueLight,
              border: `1px solid ${blueBorder}`,
              padding: "0.5vh 1.5vw",
              letterSpacing: "0.06em",
              fontWeight: 500,
              textTransform: "uppercase",
              borderRadius: "0.4vw",
            }}
          >
            Replit + Resend Hackathon · 42 São Paulo
          </div>
        </div>

        <div style={{ maxWidth: "65vw" }}>
          <div
            style={{
              fontSize: "1.1vw",
              color: "#8e8e93",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 400,
              marginBottom: "2vh",
            }}
          >
            Apresentamos
          </div>
          <h1
            style={{
              fontSize: "10vw",
              fontWeight: 200,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              color: "#1c1c1e",
              margin: 0,
            }}
          >
            Saffe
          </h1>
          <p
            style={{
              fontSize: "2.4vw",
              color: blue,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              marginTop: "2vh",
            }}
          >
            Ship fast. Stay Saffe.
          </p>
          <p
            style={{
              fontSize: "1.5vw",
              color: "#636366",
              fontWeight: 300,
              marginTop: "1.5vh",
              maxWidth: "45vw",
              lineHeight: 1.6,
            }}
          >
            Segurança automatizada para apps gerados por IA — antes que o problema chegue à produção.
          </p>
        </div>

        <div
          style={{
            fontSize: "1.1vw",
            color: "#8e8e93",
            fontWeight: 300,
          }}
        >
          21 de Março, 2026
        </div>
      </div>
    </div>
  );
}
