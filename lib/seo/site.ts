export type SiteEnvironment = Partial<
  Record<
    "NEXT_PUBLIC_SITE_URL" | "VERCEL_PROJECT_PRODUCTION_URL" | "VERCEL_URL",
    string
  >
>;

export const SITE_NAME = "Loupe Digital Museum";
export const SITE_DESCRIPTION =
  "An interactive digital museum for the quietly curious.";

const LOCAL_ORIGIN = "http://localhost:3000";

export function resolveSiteOrigin(
  env: SiteEnvironment = process.env as SiteEnvironment,
): URL {
  const value =
    env.NEXT_PUBLIC_SITE_URL ??
    env.VERCEL_PROJECT_PRODUCTION_URL ??
    env.VERCEL_URL;
  const candidate = value
    ? /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`
    : LOCAL_ORIGIN;

  try {
    const url = new URL(candidate);
    return ["http:", "https:"].includes(url.protocol)
      ? new URL(url.origin)
      : new URL(LOCAL_ORIGIN);
  } catch {
    return new URL(LOCAL_ORIGIN);
  }
}

export function absoluteUrl(path: string, env?: SiteEnvironment): string {
  return new URL(path, resolveSiteOrigin(env)).href;
}
