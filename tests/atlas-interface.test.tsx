import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AtlasExperience } from "@/components/space/AtlasExperience";

describe("Atlas of Worlds instrument shell", () => {
  it("uses a clear Loupe home identity and explains the active scientific view", () => {
    render(<AtlasExperience initialWorld="sun" />);

    expect(screen.getByRole("link", { name: /loupe museum home/i })).toHaveAttribute("href", "/");
    expect(screen.getByText("Atlas of Worlds")).not.toHaveAttribute("href");
    expect(screen.getByText(/self-luminous visible surface/i)).toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: /sunlight/i })).not.toBeInTheDocument();
  });

  it("keeps selectable visible features in an edge rail instead of static globe labels", async () => {
    const user = userEvent.setup();
    render(<AtlasExperience initialWorld="sun" />);

    const rail = screen.getByRole("navigation", { name: /visible features/i });
    const feature = within(rail).getByRole("button", { name: /active region/i });
    expect(screen.queryByRole("button", { name: /explore active region/i })).not.toBeInTheDocument();

    await user.click(feature);
    expect(feature).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: /active region/i })).toBeInTheDocument();
  });

  it("offers Survey light for Earth and angle controls only where they are scientifically useful", async () => {
    const user = userEvent.setup();
    render(<AtlasExperience initialWorld="earth" />);

    const survey = screen.getByRole("button", { name: /survey light/i });
    expect(survey).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("slider", { name: /sunlight elevation/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^moon/i }));
    await user.click(screen.getByRole("tab", { name: /^lighting$/i }));
    expect(screen.getByRole("slider", { name: /sunlight elevation/i })).toBeInTheDocument();
  });

  it("explains extreme-ultraviolet wavelength modes and exposes authored motion", async () => {
    const user = userEvent.setup();
    render(<AtlasExperience initialWorld="sun" />);

    await user.click(screen.getByRole("tab", { name: /171 å/i }));
    expect(screen.getByText(/ångström/i)).toBeInTheDocument();
    expect(screen.getByText(/about 0.6 million k/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /turn motion off/i })).toBeInTheDocument();
  });

  it("shows feature-specific NASA media in the Field Guide", async () => {
    const user = userEvent.setup();
    render(<AtlasExperience initialWorld="earth" />);

    const rail = screen.getByRole("navigation", { name: /visible features/i });
    await user.click(within(rail).getByRole("button", { name: /himalaya/i }));
    expect(screen.getByRole("img", { name: /landsat view of mount everest/i })).toHaveAttribute(
      "src",
      "/media/space/atlas/features/earth-himalaya.webp",
    );

    await user.click(screen.getByRole("button", { name: /^jupiter/i }));
    const jupiterRail = screen.getByRole("navigation", { name: /visible features/i });
    await user.click(within(jupiterRail).getByRole("button", { name: /great red spot/i }));
    expect(screen.getByRole("img", { name: /juno.*great red spot/i })).toHaveAttribute(
      "src",
      "/media/space/atlas/features/jupiter-great-red-spot.webp",
    );
  });

  it("adapts the scientific mode rail to the selected world", async () => {
    const user = userEvent.setup();
    render(<AtlasExperience initialWorld="moon" />);

    const worldIndex = screen.getByRole("navigation", { name: /world index/i });
    await user.click(within(worldIndex).getByRole("button", { name: /^earth/i }));

    expect(screen.getByRole("tab", { name: /night lights/i })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /water & ice/i })).not.toBeInTheDocument();

    await user.click(within(worldIndex).getByRole("button", { name: /^moon/i }));

    expect(screen.getByRole("tab", { name: /water & ice/i })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /night lights/i })).not.toBeInTheDocument();
  });

  it("keeps selected scientific detail in the persistent Field Guide", async () => {
    const user = userEvent.setup();
    render(<AtlasExperience initialWorld="moon" />);

    await user.click(screen.getByRole("tab", { name: /missions/i }));
    const rail = screen.getByRole("navigation", { name: /visible features/i });
    await user.click(within(rail).getByRole("button", { name: /apollo 11/i }));

    const guide = screen.getByRole("complementary", { name: /field guide/i });
    expect(within(guide).getByRole("heading", { name: /apollo 11/i })).toBeInTheDocument();
    expect(within(guide).getByText(/humanity's first crewed lunar landing/i)).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("exposes theme, compare, and camera tools as working controls", async () => {
    const user = userEvent.setup();
    render(<AtlasExperience initialWorld="moon" />);

    await user.click(screen.getByRole("button", { name: /switch to dark theme/i }));
    expect(screen.getByTestId("atlas-instrument")).toHaveAttribute("data-theme", "dark");

    await user.click(screen.getByRole("button", { name: /compare worlds/i }));
    const selector = screen.getByRole("combobox", { name: /compare with/i });
    await user.selectOptions(selector, "mars");
    expect(selector).toHaveValue("mars");
    expect(screen.getByTestId("compare-tray")).toHaveTextContent(/mars/i);

    await user.click(screen.getByRole("button", { name: /zoom in/i }));
    expect(screen.getByTestId("atlas-stage")).toHaveAttribute("data-camera-command", "zoom-in");
    await user.click(screen.getByRole("button", { name: /reset view/i }));
    expect(screen.getByTestId("atlas-stage")).toHaveAttribute("data-camera-command", "reset");
  });

  it("supports arrow-key travel through the World Index", async () => {
    const user = userEvent.setup();
    render(<AtlasExperience initialWorld="moon" />);

    const worldIndex = screen.getByRole("navigation", { name: /world index/i });
    const moon = within(worldIndex).getByRole("button", { name: /^moon/i });
    moon.focus();
    await user.keyboard("{ArrowRight}");

    expect(within(worldIndex).getByRole("button", { name: /^mars/i })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("heading", { name: /^mars$/i })).toBeInTheDocument();
  });

  it("centres mobile world selection inside its own rail without moving the page", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.fn();
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });

    render(<AtlasExperience initialWorld="earth" />);
    const worldIndex = screen.getByRole("navigation", { name: /world index/i });
    await user.click(within(worldIndex).getByRole("button", { name: /^neptune/i }));

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
