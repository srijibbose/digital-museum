import { ImageResponse } from "next/og";
import {
  museumSocialCard,
  resolveSocialCard,
} from "@/lib/seo/social-card";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kind: string; slug: string[] }> },
) {
  const { kind, slug } = await params;
  const card = resolveSocialCard(kind, slug) ?? museumSocialCard;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-start",
          background: "#070a0b",
          color: "#f4f1e8",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: card.accentColor,
            height: "12px",
            left: "72px",
            position: "absolute",
            top: "52px",
            width: "156px",
          }}
        />
        <div
          style={{
            color: "#c8c1b2",
            display: "flex",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "0.16em",
          }}
        >
          {card.eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "940px" }}>
          <div style={{ fontSize: "76px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
            {card.title}
          </div>
          <div
            style={{
              color: "#d5cec0",
              display: "flex",
              fontSize: "29px",
              lineHeight: 1.35,
              marginTop: "28px",
            }}
          >
            {card.description}
          </div>
        </div>
        <div
          style={{
            color: card.accentColor,
            display: "flex",
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          LOUPE
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
