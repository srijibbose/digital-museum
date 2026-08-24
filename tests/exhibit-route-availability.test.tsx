import { describe, expect, it, vi } from "vitest";
import AtlasOfWorldsPage from "@/app/exhibits/atlas-of-worlds/page";
import BecomingHumanPage from "@/app/exhibits/becoming-human/page";
import HumanAnatomyPage from "@/app/exhibits/human-anatomy/page";
import JetEnginePage from "@/app/exhibits/jet-engine/page";
import ThirteenMinutesPage from "@/app/exhibits/thirteen-minutes/page";
import { getExhibitBySlug, type ExhibitDefinition } from "@/content/exhibits";

vi.mock("@/components/anatomy/AnatomyExperience", () => ({
  AnatomyExperience: () => null,
}));
vi.mock("@/components/becoming-human/BecomingHumanV2Experience", () => ({
  BecomingHumanV2Experience: () => null,
}));
vi.mock("@/components/jet-engine/JetEngineExperience", () => ({
  default: () => null,
}));
vi.mock("@/components/space/AtlasExperience", () => ({
  AtlasExperience: () => null,
}));
vi.mock("@/app/exhibits/thirteen-minutes/components/TimelineExperience", () => ({
  TimelineExperience: () => null,
}));

type RouteCase = {
  slug: string;
  render: () => unknown | Promise<unknown>;
};

const routeCases: RouteCase[] = [
  { slug: "human-anatomy", render: () => HumanAnatomyPage() },
  { slug: "becoming-human", render: () => BecomingHumanPage() },
  { slug: "jet-engine", render: () => JetEnginePage() },
  { slug: "thirteen-minutes", render: () => ThirteenMinutesPage() },
  {
    slug: "atlas-of-worlds",
    render: () => AtlasOfWorldsPage({ searchParams: Promise.resolve({}) }),
  },
];

async function expectRouteNotFound(renderRoute: RouteCase["render"]) {
  await expect(Promise.resolve().then(renderRoute)).rejects.toMatchObject({
    digest: "NEXT_HTTP_ERROR_FALLBACK;404",
  });
}

function restoreExhibit(
  exhibit: ExhibitDefinition,
  state: Pick<ExhibitDefinition, "enabled" | "access">,
) {
  exhibit.enabled = state.enabled;
  exhibit.access = state.access;
}

describe.each(routeCases)("$slug public route availability", ({ slug, render }) => {
  it.each(["public", "members"] as const)(
    "renders the %s route for a signed-out request",
    async (mode) => {
      const exhibit = getExhibitBySlug(slug)!;
      const original = { enabled: exhibit.enabled, access: exhibit.access };
      exhibit.enabled = true;
      exhibit.access =
        mode === "public"
          ? { mode: "public" }
          : {
              mode: "members",
              gateLabel: "Member instrument",
              gateDescription: "Sign in to enter the interactive region.",
            };

      try {
        await expect(Promise.resolve().then(render)).resolves.toBeTruthy();
      } finally {
        restoreExhibit(exhibit, original);
      }
    },
  );

  it("returns not found before rendering a private exhibit", async () => {
    const exhibit = getExhibitBySlug(slug)!;
    const original = { enabled: exhibit.enabled, access: exhibit.access };
    exhibit.enabled = true;
    exhibit.access = { mode: "private" };

    try {
      await expectRouteNotFound(render);
    } finally {
      restoreExhibit(exhibit, original);
    }
  });

  it("returns not found before rendering a disabled exhibit", async () => {
    const exhibit = getExhibitBySlug(slug)!;
    const original = { enabled: exhibit.enabled, access: exhibit.access };
    exhibit.enabled = false;
    exhibit.access = { mode: "public" };

    try {
      await expectRouteNotFound(render);
    } finally {
      restoreExhibit(exhibit, original);
    }
  });
});
