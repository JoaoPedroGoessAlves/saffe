export default function Slide5Demo() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0E0D0D" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,59,0,0.12) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,59,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,0,0.04) 1px, transparent 1px)",
          backgroundSize: "8vw 8vh",
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center" style={{ gap: "4vh" }}>
        <div
          style={{
            fontSize: "1vw",
            color: "#FF3B00",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          04 — Demo
        </div>

        <div
          style={{
            background: "#1A1919",
            border: "1px solid #2E2B2B",
            padding: "4vh 6vw",
            textAlign: "center",
            position: "relative",
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
              width: "6vw",
              height: "6vw",
              border: "2px solid rgba(255,59,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 3vh",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="rgba(255,59,0,0.8)"
              style={{ width: "3vw", height: "3vw" }}
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "6vw",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#F8F5F1",
              lineHeight: 1,
              margin: 0,
            }}
          >
            Demonstração
          </h1>
          <p
            style={{
              fontSize: "1.4vw",
              color: "#9A9A9A",
              marginTop: "2vh",
              letterSpacing: "0.05em",
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
            <div style={{ fontSize: "1.8vw", fontWeight: 800, color: "#FF3B00" }}>URL Scan</div>
            <div style={{ fontSize: "1vw", color: "#9A9A9A", marginTop: "0.5vh" }}>ao vivo</div>
          </div>
          <div style={{ width: "1px", height: "4vh", background: "#2E2B2B" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: 800, color: "#FF3B00" }}>Deep Scan</div>
            <div style={{ fontSize: "1vw", color: "#9A9A9A", marginTop: "0.5vh" }}>GitHub + Gemini</div>
          </div>
          <div style={{ width: "1px", height: "4vh", background: "#2E2B2B" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: 800, color: "#FF3B00" }}>Custo Dev</div>
            <div style={{ fontSize: "1vw", color: "#9A9A9A", marginTop: "0.5vh" }}>por vulnerabilidade</div>
          </div>
        </div>
      </div>
    </div>
  );
}
