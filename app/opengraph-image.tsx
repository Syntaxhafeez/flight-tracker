import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b1220 0%, #0f172a 55%, #0b1f2f 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 60,
            borderRadius: 48,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "radial-gradient(circle at top, rgba(34,211,238,0.22), transparent 55%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            AeroTrack
          </div>
          <div
            style={{
              fontSize: 28,
              opacity: 0.8,
            }}
          >
            Live flight tracking with real-time positions and aircraft details
          </div>
          <div
            style={{
              display: "inline-flex",
              alignSelf: "center",
              padding: "12px 26px",
              borderRadius: 999,
              border: "1px solid rgba(34,211,238,0.5)",
              background: "rgba(15,23,42,0.7)",
              fontSize: 18,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Aerotrackr.online
          </div>
        </div>
      </div>
    ),
    size,
  );
}
