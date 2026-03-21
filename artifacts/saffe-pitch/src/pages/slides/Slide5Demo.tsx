export default function Slide5Demo() {
  const blue = "hsl(212, 100%, 44%)";
  const blueLight = "rgba(0, 112, 224, 0.08)";
  const blueBorder = "rgba(0, 112, 224, 0.20)";

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#f5f5f7", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,112,224,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,112,224,0.04) 1px, transparent 1px)",
          backgroundSize: "8vw 8vh",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,112,224,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center" style={{ gap: "4vh" }}>
        <div
          style={{
            fontSize: "1vw",
            color: blue,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          04 — Demo
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid rgba(0,0,0,0.08)`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
            padding: "4vh 6vw",
            textAlign: "center",
            position: "relative",
            borderRadius: "1.2vw",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: blue,
              borderRadius: "1.2vw 1.2vw 0 0",
            }}
          />
          <div
            style={{
              width: "6vw",
              height: "6vw",
              border: `2px solid ${blueBorder}`,
              background: blueLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 3vh",
              borderRadius: "50%",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill={blue}
              style={{ width: "3vw", height: "3vw", marginLeft: "0.3vw" }}
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "6vw",
              fontWeight: 200,
              letterSpacing: "-0.05em",
              color: "#1c1c1e",
              lineHeight: 1,
              margin: 0,
            }}
          >
            Demonstração
          </h1>
          <p
            style={{
              fontSize: "1.4vw",
              color: "#8e8e93",
              marginTop: "2vh",
              letterSpacing: "0.04em",
              fontWeight: 300,
            }}
          >
            Vídeo ao vivo
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "4vw",
            alignItems: "center",
            marginTop: "2vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: 400, color: blue, letterSpacing: "-0.02em" }}>URL Scan</div>
            <div style={{ fontSize: "1vw", color: "#8e8e93", marginTop: "0.5vh", fontWeight: 300 }}>ao vivo</div>
          </div>
          <div style={{ width: "1px", height: "4vh", background: "rgba(0,0,0,0.12)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: 400, color: blue, letterSpacing: "-0.02em" }}>Deep Scan</div>
            <div style={{ fontSize: "1vw", color: "#8e8e93", marginTop: "0.5vh", fontWeight: 300 }}>GitHub + Gemini</div>
          </div>
          <div style={{ width: "1px", height: "4vh", background: "rgba(0,0,0,0.12)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: 400, color: blue, letterSpacing: "-0.02em" }}>Custo Dev</div>
            <div style={{ fontSize: "1vw", color: "#8e8e93", marginTop: "0.5vh", fontWeight: 300 }}>por vulnerabilidade</div>
          </div>
        </div>
      </div>
    </div>
  );
}
