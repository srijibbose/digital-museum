import { describe, expect, it } from "vitest";
import { absoluteUrl, resolveSiteOrigin } from "@/lib/seo/site";

describe("site origin", () => {
  it("uses and normalizes the permanent production origin", () => {
    expect(
      resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://museum.example/" }).href,
    ).toBe("https://museum.example/");
    expect(
      absoluteUrl("/exhibits", { NEXT_PUBLIC_SITE_URL: "https://museum.example" }),
    ).toBe("https://museum.example/exhibits");
  });

  it("rejects unsafe origins and falls back locally", () => {
    expect(resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: "javascript:alert(1)" }).href).toBe(
      "http://localhost:3000/",
    );
  });
});
