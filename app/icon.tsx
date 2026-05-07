import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Programmatic favicon — a single serif "Z" glyph on a warm dark background.
 *
 * Generated at build time and cached. To replace with a custom asset,
 * delete this file and drop a `favicon.ico` (or `icon.png`) into `app/`.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          fontWeight: 500,
          fontFamily: "Georgia, 'Times New Roman', serif",
          background: "#18181b",
          color: "#fafafa",
          letterSpacing: "-0.02em",
          paddingBottom: 2,
        }}
      >
        Z
      </div>
    ),
    { ...size },
  );
}
