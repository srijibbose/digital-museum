import type { MetadataRoute } from "next";
import { absoluteUrl, resolveSiteOrigin } from "@/lib/seo/site";

const PRIVATE_SURFACES = [
  "/api/",
  "/account/",
  "/dashboard/",
  "/private/",
  "/internal/",
  "/auth/callback/",
];

const SEARCH_AND_BROWSER_AGENTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];

const TRAINING_AGENTS = ["GPTBot", "ClaudeBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_SURFACES },
      {
        userAgent: SEARCH_AND_BROWSER_AGENTS,
        allow: "/",
        disallow: PRIVATE_SURFACES,
      },
      {
        userAgent: TRAINING_AGENTS,
        allow: "/",
        disallow: PRIVATE_SURFACES,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: resolveSiteOrigin().origin,
  };
}
