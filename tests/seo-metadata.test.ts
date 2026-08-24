import { describe, expect, it } from "vitest";
import { getExhibitBySlug } from "@/content/exhibits";
import {
  createExhibitMetadata,
  createPageMetadata,
} from "@/lib/seo/metadata";

describe("SEO metadata builders", () => {
  it("creates absolute canonical and social metadata", () => {
    const metadata = createPageMetadata(
      {
        title: "Atlas of Worlds",
        description: "A sourced interactive Solar System atlas.",
        pathname: "/exhibits/atlas-of-worlds",
        imagePath: "/social/exhibit/atlas-of-worlds",
      },
      { NEXT_PUBLIC_SITE_URL: "https://museum.example" },
    );

    expect(metadata.alternates?.canonical).toBe(
      "https://museum.example/exhibits/atlas-of-worlds",
    );
    expect(metadata.openGraph?.url).toBe(
      "https://museum.example/exhibits/atlas-of-worlds",
    );
    expect(metadata.openGraph?.images).toMatchObject([
      {
        url: "https://museum.example/social/exhibit/atlas-of-worlds",
        width: 1200,
        height: 630,
        alt: "Atlas of Worlds",
      },
    ]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("marks filtered catalog pages noindex follow", () => {
    const metadata = createPageMetadata({
      title: "All exhibits",
      description: "Catalog",
      pathname: "/exhibits",
      index: false,
    });

    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    });
  });

  it.each([
    ["private", { enabled: true, access: { mode: "private" as const } }],
    ["disabled", { enabled: false, access: { mode: "public" as const } }],
  ])("does not disclose a %s exhibit through metadata", (_state, overrides) => {
    const exhibit = {
      ...getExhibitBySlug("atlas-of-worlds")!,
      ...overrides,
    };
    const metadata = createExhibitMetadata(exhibit, {
      NEXT_PUBLIC_SITE_URL: "https://museum.example",
    });

    expect(metadata.title).toBe("Exhibit unavailable");
    expect(metadata.description).toBe(
      "This exhibit is not available in the public museum.",
    );
    expect(metadata.alternates?.canonical).toBeUndefined();
    expect(metadata.openGraph?.images).toMatchObject([
      { url: "https://museum.example/social/museum/default" },
    ]);
    expect(metadata.openGraph?.url).toBe("https://museum.example/");
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
      noarchive: true,
      googleBot: { index: false, follow: false, noarchive: true },
    });
    expect(JSON.stringify(metadata)).not.toContain("Atlas of Worlds");
    expect(JSON.stringify(metadata)).not.toContain("atlas-of-worlds");
    expect(JSON.stringify(metadata)).not.toContain("Move from the Sun");
  });
});
