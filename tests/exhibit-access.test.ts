import { describe, expect, it } from "vitest";
import {
  canEnterExhibit,
  isPubliclyDiscoverable,
} from "@/lib/auth/exhibit-access";
import { getExhibitBySlug } from "@/content/exhibits";

describe("exhibit access", () => {
  it("keeps member exhibits publicly discoverable but gates entry", () => {
    const exhibit = {
      ...getExhibitBySlug("atlas-of-worlds")!,
      access: {
        mode: "members" as const,
        gateLabel: "Sign in to enter",
        gateDescription: "Membership unlocks the instrument.",
      },
    };

    expect(isPubliclyDiscoverable(exhibit)).toBe(true);
    expect(canEnterExhibit(exhibit, { signedIn: false })).toBe(false);
    expect(canEnterExhibit(exhibit, { signedIn: true })).toBe(true);
  });

  it("removes private exhibits from public discovery", () => {
    const exhibit = {
      ...getExhibitBySlug("atlas-of-worlds")!,
      access: { mode: "private" as const },
    };

    expect(isPubliclyDiscoverable(exhibit)).toBe(false);
  });
});
