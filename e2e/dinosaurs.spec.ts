import { expect, test } from "@playwright/test";

test("operates the dinosaur specimen atlas and its evidence modes", async ({ page }) => {
  const requestedModels: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/models/dinosaurs/")) requestedModels.push(request.url());
  });
  await page.goto("/exhibits/dinosaurs");

  await expect(page.getByRole("heading", { name: "Damage becomes biography." })).toBeVisible();
  await expect(page.getByRole("button", { name: /T\. rex/i })).toHaveAttribute("aria-current", "true");
  await expect(page.getByRole("button", { name: "Skeleton", pressed: true })).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();
  await expect.poll(() => requestedModels.some((url) => url.includes("field-sue-pr2081.glb"))).toBe(true);
  expect(requestedModels.some((url) => url.includes("smithsonian-triceratops-pal500000.glb"))).toBe(false);
  await expect(page.getByRole("button", { name: /T\. rex/i }).locator("img")).toHaveAttribute("src", /_next\/image/);
  await expect(page.getByRole("button", { name: "Inspect Jaw" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Bone" })).toHaveCount(0);

  await page.getByRole("button", { name: /Triceratops Late Cretaceous/i }).click();
  await expect(page.getByRole("heading", { name: "A skull can carry a social argument." })).toBeVisible();
  await expect(page).toHaveURL(/species=triceratops/);

  await page.getByRole("button", { name: "Inspect Frill" }).click();
  await expect(
    page.getByRole("group", { name: "Bone regions" }).getByText(/Display, defence, recognition/),
  ).toBeVisible();
  await expect(page).toHaveURL(/mode=skeleton/);

  await page.getByRole("button", { name: "Anatomy" }).click();
  await page.getByRole("button", { name: /Plant-processing gut/i }).click();
  await expect(
    page.getByRole("group", { name: "Comparative organ systems" }).getByText(/chambering, microbiome/i),
  ).toBeVisible();

  await page.getByRole("button", { name: /Sources/i }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("USNM PAL500000");
  await expect(dialog.getByRole("link", { name: /Open institution record/i })).toHaveAttribute("href", /si\.edu/);
  await dialog.getByRole("button", { name: /Close provenance/i }).click();
});

test("opens hosted specimens directly in 3D and retains theme choice", async ({ page }) => {
  await page.route("https://static.sketchfab.com/api/**", async (route) => {
    await route.fulfill({
      contentType: "application/javascript",
      body: `window.__loupeSketchfabOptions = [];
      window.__loupeTextureQualities = [];
      window.Sketchfab = class {
        constructor(_version, _iframe) {}
        init(_uid, options) {
          window.__loupeSketchfabOptions.push(options);
          const api = {
            start() {},
            stop() {},
            addEventListener(event, callback) {
              if (event === "viewerready") setTimeout(callback, 0);
            },
            getCameraLookAt(callback) { callback({ position: [0, 0, 5], target: [0, 0, 0] }); },
            setCameraLookAt() {},
            recenterCamera() {},
            setBackground() {},
            setTextureQuality(quality) { window.__loupeTextureQualities.push(quality); },
          };
          options.success(api);
        }
      };`,
    });
  });
  await page.goto("/exhibits/dinosaurs");

  for (const record of [
    { button: /Diplodocus Late Jurassic/i, name: "Diplodocus" },
    { button: /Plateosaurus Late Triassic/i, name: "Plateosaurus" },
    { button: /Protoceratops Late Cretaceous/i, name: "Protoceratops" },
    { button: /Psittacosaurus Early Cretaceous/i, name: "Psittacosaurus" },
  ]) {
    await page.getByRole("button", { name: record.button }).click();
    await expect(page.getByTitle(`${record.name} institutional 3D specimen`)).toBeVisible();
    await expect(
      page.getByRole("img", { name: `${record.name} museum specimen static view` }),
    ).toHaveCount(0);
  }

  const viewerOptions = await page.evaluate(() => {
    const options = (window as unknown as { __loupeSketchfabOptions: Record<string, number>[] })
      .__loupeSketchfabOptions;
    return options.at(-1);
  });
  expect(viewerOptions).toMatchObject({
    preload: 0,
    ui_controls: 0,
    ui_inspector: 0,
    ui_settings: 0,
    ui_help: 0,
    ui_vr: 0,
    ui_fullscreen: 0,
  });
  await expect.poll(() => page.evaluate(() => (
    window as unknown as { __loupeTextureQualities: string[] }
  ).__loupeTextureQualities.includes("hd"))).toBe(true);

  await page.getByRole("button", { name: /Allosaurus Late Jurassic/i }).click();
  await expect(page.getByTitle("Allosaurus institutional 3D specimen")).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect Mounted spine" })).toBeVisible();
  await expect(
    page.getByRole("complementary", { name: "Scientific evidence panel" })
      .getByText(/corrected digital mount/i),
  ).toBeVisible();

  await page.getByRole("button", { name: /Archaeopteryx Late Jurassic/i }).click();
  await expect(page.getByTitle("Archaeopteryx institutional 3D specimen")).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect Feather impressions" })).toBeVisible();

  await page.getByRole("button", { name: "Life model" }).click();
  await expect(page.getByTitle("Archaeopteryx interactive 3D life reconstruction")).toBeVisible();
  await expect(page.getByText(/khata/i).first()).toBeVisible();

  await page.getByRole("switch", { name: "Dark mode" }).click();
  await expect(page.locator("main[data-theme='dark']")).toBeVisible();
  await expect(page.getByRole("switch", { name: "Dark mode" })).toBeChecked();
  await page.reload();
  await expect(page.locator("main[data-theme='dark']")).toBeVisible();
});

test("keeps the static mobile edition usable without horizontal overflow", async ({ page }) => {
  const requestedModels: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/models/dinosaurs/")) requestedModels.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/exhibits/dinosaurs?species=allosaurus&mode=trace");

  await expect(page.getByRole("heading", { name: "A correction makes interpretation visible." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Trace", pressed: true })).toBeVisible();
  expect(requestedModels).toEqual([]);
  await page.getByRole("button", { name: "Static" }).click();
  await expect(page.getByText(/Static museum record/i)).toBeVisible();
  await expect(
    page.getByRole("complementary", { name: "Scientific evidence panel" })
      .getByRole("heading", { name: /The missing tail mark changed the mount/i }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("uses a fleshed 3D T. rex reconstruction on the homepage card", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator('img[src="/media/dinosaurs/specimens/tyrannosaurus-life-3d.jpg"]'),
  ).toBeVisible();
});

test("preserves the evidence record when WebGL is unavailable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function getContext(
      this: HTMLCanvasElement,
      contextId: string,
      ...args: unknown[]
    ) {
      if (contextId === "webgl" || contextId === "webgl2") return null;
      return original.call(this, contextId as never, ...(args as []));
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/exhibits/dinosaurs?species=archaeopteryx&mode=lineage");

  await expect(
    page.getByRole("heading", { name: "The boundary between bird and dinosaur dissolves." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Lineage", pressed: true })).toBeVisible();
  await expect(page.getByRole("img", { name: /Archaeopteryx museum specimen static view/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Enable 3D", pressed: true })).toBeDisabled();
});
