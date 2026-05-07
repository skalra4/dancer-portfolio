import { ImageResponse } from "next/og";
import { fetchSiteSettings } from "@/sanity/lib/fetch";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default Open Graph card — used when this site is shared on Instagram,
 * iMessage, X, Facebook, Slack, etc. Pulled from Sanity site settings so
 * the dancer can rebrand without code changes.
 *
 * If `heroImageUrl` is set in Sanity, we use it as the background. Otherwise
 * we render an elegant text-only card.
 */
export default async function OpenGraphImage() {
  const { siteName, siteTagline, hero } = await fetchSiteSettings();
  const heroUrl = hero.backgroundImageUrl;
  const hasRemoteHero = heroUrl.startsWith("http");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fafafa",
          position: "relative",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {hasRemoteHero ? (
          <img
            src={heroUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.55)",
            }}
          />
        ) : null}

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              opacity: 0.85,
              marginBottom: 24,
            }}
          >
            Portfolio
          </div>
          <div
            style={{
              fontSize: 128,
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            {siteName}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 300,
              opacity: 0.85,
            }}
          >
            {siteTagline}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
