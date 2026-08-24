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

    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it("derives exhibit discovery metadata from the registry and access mode", () => {
    const exhibit = {
      ...getExhibitBySlug("atlas-of-worlds")!,
      access: { mode: "private" as const },
    };
    const metadata = createExhibitMetadata(exhibit, {
      NEXT_PUBLIC_SITE_URL: "https://museum.example",
    });

    expect(metadata.title).toBe("Atlas of Worlds");
    expect(metadata.description).toBe(
      "Move from the Sun to Neptune in a single high-fidelity observatory, switching between terrain, atmosphere, missions, interiors, rings, light, and magnetic fields.",
    );
    expect(metadata.alternates?.canonical).toBe(
      "https://museum.example/exhibits/atlas-of-worlds",
    );
    expect(metadata.openGraph?.images).toMatchObject([
      { url: "https://museum.example/social/exhibit/atlas-of-worlds" },
    ]);
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });
});
