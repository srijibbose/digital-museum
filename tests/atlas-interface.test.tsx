import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AtlasExperience } from "@/components/space/AtlasExperience";

describe("Atlas of Worlds instrument shell", () => {
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
    await user.click(screen.getByRole("button", { name: /explore apollo 11/i }));

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
});
