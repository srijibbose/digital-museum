import type { ComponentType, ReactNode } from "react";
import type { Metadata } from "next";
import { render, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getExhibitBySlug } from "@/content/exhibits";

vi.mock("@vercel/analytics/next", () => ({ Analytics: () => null }));
vi.mock("@vercel/speed-insights/next", () => ({ SpeedInsights: () => null }));
vi.mock("@/components/anatomy/AnatomyExperience", () => ({
  AnatomyExperience: () => <h1>Human Anatomy</h1>,
}));
vi.mock("@/components/becoming-human/BecomingHumanV2Experience", () => ({
  BecomingHumanV2Experience: () => <main><h1>Becoming Human</h1></main>,
}));
vi.mock("@/components/jet-engine/JetEngineExperience", () => ({
  default: () => <main><h1>The Engine Is a River</h1></main>,
}));
vi.mock("@/components/space/AtlasExperience", () => ({
  AtlasExperience: () => <h1>Atlas of Worlds</h1>,
}));
vi.mock("@/app/exhibits/thirteen-minutes/components/TimelineExperience", () => ({
  TimelineExperience: () => <section aria-label="Mission timeline" />,
}));
vi.mock("@/app/exhibits/thirteen-minutes/components/AgcArtifactPlate", () => ({
  AgcArtifactPlate: () => null,
}));

type CatalogMetadataGenerator = (props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => Promise<Metadata>;

type ExhibitPage = {
  slug: string;
  metadata?: Metadata;
  render: () => ReactNode | Promise<ReactNode>;
};

const originalEnvironment = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION,
  bingVerification: process.env.BING_SITE_VERIFICATION,
};

let RootLayout: ComponentType<{ children: ReactNode }>;
let rootMetadata: Metadata | undefined;
let homeMetadata: Metadata | undefined;
let generateCatalogMetadata: CatalogMetadataGenerator | undefined;
let exhibitPages: ExhibitPage[];

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://museum.example";
  process.env.GOOGLE_SITE_VERIFICATION = "google-token";
  process.env.BING_SITE_VERIFICATION = "bing-token";

  const [layout, home, catalog, anatomy, becomingHuman, jetEngine, apollo, atlas] =
    await Promise.all([
      import("@/app/layout"),
      import("@/app/page"),
      import("@/app/exhibits/page"),
      import("@/app/exhibits/human-anatomy/page"),
      import("@/app/exhibits/becoming-human/page"),
      import("@/app/exhibits/jet-engine/page"),
      import("@/app/exhibits/thirteen-minutes/page"),
      import("@/app/exhibits/atlas-of-worlds/page"),
    ]);

  RootLayout = layout.default;
  rootMetadata = layout.metadata;
  homeMetadata = home.metadata;
  generateCatalogMetadata = catalog.generateMetadata;
  exhibitPages = [
    { slug: "human-anatomy", metadata: anatomy.metadata, render: anatomy.default },
    { slug: "becoming-human", metadata: becomingHuman.metadata, render: becomingHuman.default },
    { slug: "jet-engine", metadata: jetEngine.metadata, render: jetEngine.default },
    { slug: "thirteen-minutes", metadata: apollo.metadata, render: apollo.default },
    {
      slug: "atlas-of-worlds",
      metadata: atlas.metadata,
      render: () => atlas.default({ searchParams: Promise.resolve({}) }),
    },
  ];
}, 30_000);

afterAll(() => {
  const restore = (name: string, value: string | undefined) => {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  };

  restore("NEXT_PUBLIC_SITE_URL", originalEnvironment.siteUrl);
  restore("GOOGLE_SITE_VERIFICATION", originalEnvironment.googleVerification);
  restore("BING_SITE_VERIFICATION", originalEnvironment.bingVerification);
});

describe("page SEO integration", () => {
  it("sets root defaults without exporting an inheritable canonical", () => {
    expect(rootMetadata).toMatchObject({
      metadataBase: new URL("https://museum.example"),
      applicationName: "Loupe Digital Museum",
      manifest: "/manifest.webmanifest",
      verification: {
        google: "google-token",
        other: { "msvalidate.01": "bing-token" },
      },
      robots: { index: true, follow: true },
      openGraph: {
        siteName: "Loupe Digital Museum",
        type: "website",
        images: [{ url: "/social/museum/default" }],
      },
      twitter: {
        card: "summary_large_image",
        images: ["/social/museum/default"],
      },
    });
    expect(rootMetadata?.alternates?.canonical).toBeUndefined();
  });

  it("renders the truthful site graph from the root layout", () => {
    const markup = renderToStaticMarkup(
      <RootLayout><main>Museum content</main></RootLayout>,
    );
    const document = new DOMParser().parseFromString(markup, "text/html");
    const script = document.querySelector('script[type="application/ld+json"]');
    const graph = JSON.parse(script?.textContent ?? "null");

    expect(graph).toMatchObject({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", "@id": "https://museum.example/#website" },
        { "@type": "Organization", "@id": "https://museum.example/#organization" },
      ],
    });
  });

  it("gives the home and catalog different canonical identities", async () => {
    expect(homeMetadata?.alternates?.canonical).toBe("https://museum.example/");
    expect(generateCatalogMetadata).toBeTypeOf("function");
    if (!generateCatalogMetadata) return;

    const catalog = await generateCatalogMetadata({
      searchParams: Promise.resolve({}),
    });

    expect(catalog.title).toBe("Explore every exhibit");
    expect(catalog.alternates?.canonical).toBe("https://museum.example/exhibits");
    expect(homeMetadata?.openGraph?.images).toMatchObject([
      { url: "https://museum.example/social/museum/default" },
    ]);
    expect(catalog.openGraph?.images).toMatchObject([
      { url: "https://museum.example/social/museum/default" },
    ]);
  });

  it.each([
    "human-anatomy",
    "becoming-human",
    "jet-engine",
    "thirteen-minutes",
    "atlas-of-worlds",
  ])("derives %s metadata from the exhibit registry", (slug) => {
    const exhibit = getExhibitBySlug(slug)!;
    const page = exhibitPages.find((candidate) => candidate.slug === slug)!;

    expect(page.metadata).toMatchObject({
      title: exhibit.title,
      description: exhibit.synopsis,
      alternates: { canonical: `https://museum.example${exhibit.route}` },
      robots: { index: true, follow: true },
      openGraph: {
        url: `https://museum.example${exhibit.route}`,
        images: [{ url: `https://museum.example/social/exhibit/${slug}` }],
      },
    });
  });

  it.each([
    "human-anatomy",
    "becoming-human",
    "jet-engine",
    "thirteen-minutes",
    "atlas-of-worlds",
  ])("renders visible exhibit and breadcrumb JSON-LD for %s", async (slug) => {
    const page = exhibitPages.find((candidate) => candidate.slug === slug)!;
    const exhibit = getExhibitBySlug(slug)!;
    const { container } = render(<>{await page.render()}</>);
    const scripts = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]'),
    );
    const graphs = scripts.flatMap((script) => {
      const data = JSON.parse(script.textContent ?? "null");
      return Array.isArray(data) ? data : [data];
    });

    expect(graphs).toHaveLength(2);
    expect(graphs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": ["CreativeWork", "LearningResource"],
          name: exhibit.title,
          isAccessibleForFree: true,
        }),
        expect.objectContaining({ "@type": "BreadcrumbList" }),
      ]),
    );

    const navigation = within(container).getByRole("navigation", {
      name: "Breadcrumb",
    });
    const visibleItems = within(navigation)
      .getAllByRole("link")
      .map((link) => [link.textContent, link.getAttribute("href")]);
    const breadcrumbGraph = graphs.find(
      (graph) => graph["@type"] === "BreadcrumbList",
    );

    expect(visibleItems).toEqual([
      ["Home", "/"],
      ["Exhibits", "/exhibits"],
      [exhibit.title, exhibit.route],
    ]);
    expect(
      breadcrumbGraph.itemListElement.map(
        (item: { name: string; item: string }) => [
          item.name,
          new URL(item.item).pathname,
        ],
      ),
    ).toEqual(visibleItems);
    expect(container.querySelector(".member-content")).not.toContainElement(navigation);
  });
});
