import { expect, test } from "@playwright/test";

const route = "/exhibits/human-anatomy";

test("moves from whole systems to exact source anatomy without external runtime assets", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    const path = new URL(response.url()).pathname;
    const localVercelProbe = path.startsWith("/_vercel/");
    if (response.status() >= 400 && !localVercelProbe) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto(route);
  const systems = page.getByRole("complementary", { name: "Body systems" });
  await expect(systems).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Cardiovascular system, in place view/ }).or(
      page.getByRole("img", { name: /Source-validation render of the cardiovascular system/ }),
    ),
  ).toBeVisible({ timeout: 20_000 });
  await systems.getByRole("button", { name: /05 Nervous/ }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Central nervous system" })).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Central nervous system, in place view/ }).or(
      page.getByRole("img", { name: /Source-validation render of the central nervous system/ }),
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: /04 Temporal & memory regions/ }).click();
  await page.getByRole("button", { name: "Isolate region" }).click();
  await expect(page.getByRole("button", { name: "Isolate region", pressed: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Temporal & memory regions" })).toBeVisible();

  await page.getByRole("button", { name: "Toggle advanced anatomical evidence" }).click();
  await expect(page.getByText("Source objects · 1")).toBeVisible();
  await page.getByText("Source objects · 1").click();
  await expect(page.getByText(/All 283 cortical, subcortical/)).toBeVisible();

  expect(errors).toEqual([]);
  const externalResources = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter(
        (url) => !url.startsWith(location.origin) && !url.startsWith("https://va.vercel-scripts.com/"),
      ),
  );
  expect(externalResources).toEqual([]);
});

test("keeps the system rail, source model, and controls usable at 390 by 844", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);

  const systems = page.getByRole("complementary", { name: "Body systems" });
  await expect(
    page.getByRole("img", { name: /Cardiovascular system, in place view/ }).or(
      page.getByRole("img", { name: /Source-validation render of the cardiovascular system/ }),
    ),
  ).toBeVisible({ timeout: 20_000 });
  await systems.getByRole("button", { name: /08 Skeleton/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Full skeletal system" })).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Full skeletal system, whole skeleton view/ }).or(
      page.getByRole("img", { name: /Source-validation render of the full skeletal system/ }),
    ),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Isolate region" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Zoom in" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();

  const layout = await page.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    railScrollable:
      (document.querySelector('[aria-label="Body systems"] ol')?.scrollWidth ?? 0)
      > (document.querySelector('[aria-label="Body systems"] ol')?.clientWidth ?? 0),
  }));
  expect(layout.horizontalOverflow).toBeLessThanOrEqual(0);
  expect(layout.railScrollable).toBe(true);
});

test("keeps the model controls inside the first desktop viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 947 });
  await page.goto(route);
  await expect(page.getByRole("button", { name: "Zoom in" })).toBeVisible({ timeout: 20_000 });

  const geometry = await page.evaluate(() => {
    const zoom = document.querySelector('button[aria-label="Zoom in"]')?.getBoundingClientRect();
    const title = document.querySelector("main h1")?.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      zoomBottom: zoom?.bottom ?? Infinity,
      titleBottom: title?.bottom ?? Infinity,
      viewportHeight: window.innerHeight,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  expect(geometry.scrollY).toBe(0);
  expect(geometry.zoomBottom).toBeLessThanOrEqual(geometry.viewportHeight);
  expect(geometry.titleBottom).toBeLessThan(260);
  expect(geometry.overflow).toBeLessThanOrEqual(0);
});

test("defaults to light mode and remembers an explicit dark-mode choice", async ({ page }) => {
  await page.goto(route);
  const instrument = page.getByRole("region", { name: "Human Anatomy interactive exhibit" });

  await expect(instrument).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(instrument).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();

  await page.reload();
  await expect(instrument).toHaveAttribute("data-theme", "dark");
});
