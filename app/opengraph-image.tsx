import { ImageResponse } from "next/og";
export const alt = "Kopy — a little shelf for everything between apps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "65px 80px", background: "#f3f5f6", color: "#252b30", fontFamily: "sans-serif" }}><div style={{ display: "flex", alignItems: "center", fontSize: 35, fontWeight: 700 }}><div style={{ display: "flex", width: 42, height: 42, borderRadius: 12, background: "#ac4b37", marginRight: 16 }} />Kopy</div><div style={{ display: "flex", fontSize: 82, letterSpacing: -5, lineHeight: 1.05, fontWeight: 700, maxWidth: 1000 }}>Everything between apps. Right at your edge.</div><div style={{ display: "flex", fontSize: 24, color: "#59646d" }}>Clipboard history and a file shelf for Mac.</div></div>, size);
}
