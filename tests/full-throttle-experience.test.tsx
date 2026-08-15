import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FullThrottleExperience } from "@/app/exhibits/full-throttle/components/FullThrottleExperience";

describe("FullThrottleExperience", () => {
  it("lets visitors inspect parts, then follow the airflow", async () => {
    const user = userEvent.setup();
    render(<FullThrottleExperience />);

    expect(screen.getByRole("heading", { name: /take it apart/i })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /^combustor$/i }));
    expect(screen.getByText(/continuous flame/i)).toBeVisible();
    expect(screen.getByText(/1 of 7 explored/i)).toBeVisible();

    await user.click(screen.getByRole("button", { name: /make it breathe/i }));
    expect(screen.getByRole("heading", { name: /follow one breath/i })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /the turbines/i }));
    expect(screen.getByText(/two shafts close the loop/i)).toBeVisible();
  });

  it("offers direct throttle and opt-in sound controls", async () => {
    const user = userEvent.setup();
    render(<FullThrottleExperience />);

    await user.click(screen.getByRole("button", { name: /take the throttle/i }));
    expect(screen.getByRole("heading", { name: "Take the throttle" })).toBeVisible();

    const throttle = screen.getByRole("slider", { name: /engine throttle/i });
    expect(throttle).toHaveAttribute("value", "12");
    expect(screen.getByRole("button", { name: /turn engine sound on/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("keeps all three acts reachable as ordinary buttons", () => {
    render(<FullThrottleExperience />);

    expect(screen.getByRole("button", { name: /take it apart/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /make it breathe/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /take the throttle/i })).toBeVisible();
  });
});
