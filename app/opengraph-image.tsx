import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Hex equivalents of the paper / ink / accent tokens in globals.css.
const paper = "#faf4ea";
const ink = "#1d140f";
const ink2 = "#5a4d45";
const accent = "#f04a00";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: paper,
          color: ink,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -140,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: accent,
          }}
        />
        <div style={{ display: "flex", gap: 28, fontSize: 24, letterSpacing: 2, color: ink2, textTransform: "uppercase" }}>
          <span>{site.role}</span>
          <span>{site.location}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 128, fontWeight: 600, letterSpacing: -5, lineHeight: 0.9 }}>Dylan</div>
          <div style={{ fontSize: 128, fontWeight: 600, letterSpacing: -5, lineHeight: 0.9 }}>Fitzpatrick</div>
          <div style={{ marginTop: 32, fontSize: 32, color: ink2, maxWidth: 820 }}>{site.intro}</div>
        </div>
      </div>
    ),
    size,
  );
}
