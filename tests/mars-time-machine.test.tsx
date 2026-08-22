import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MarsTimeMachine } from "@/components/space/MarsTimeMachine";

function Harness({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [value, setValue] = useState(3700);
  const [presentPreview, setPresentPreview] = useState(false);

  return (
    <>
      <output data-testid="mars-value">{value}</output>
      <MarsTimeMachine
        value={value}
        presentPreview={presentPreview}
        reducedMotion={reducedMotion}
        onChange={setValue}
        onPresentPreviewChange={setPresentPreview}
      />
    </>
  );
}

function PresentHarness() {
  const [presentPreview, setPresentPreview] = useState(false);

  return (
    <MarsTimeMachine
      value={0}
      presentPreview={presentPreview}
      reducedMotion={false}
      onChange={() => undefined}
      onPresentPreviewChange={setPresentPreview}
    />
  );
}

describe("Mars time machine", () => {
  it("exposes the live date, scientific status, anchors, and direct range control", () => {
    render(<Harness />);

    expect(screen.getByText("3.7 billion years ago")).toBeInTheDocument();
    expect(screen.getByText(/interpolated between authored states/i)).toBeInTheDocument();
    expect(screen.getByText(/observed terrain/i)).toBeInTheDocument();
    expect(screen.getAllByText(/constrained reconstruction/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /go to/i })).toHaveLength(6);

    const slider = screen.getByRole("slider", { name: /mars deep time/i });
    expect(slider).toHaveAttribute("aria-valuetext", expect.stringMatching(/3.7 billion.*interpolated/i));
    fireEvent.change(slider, { target: { value: "1100" } });
    expect(screen.getByTestId("mars-value")).toHaveTextContent("3000");
    expect(screen.getByText("3 billion years ago")).toBeInTheDocument();
  });

  it("travels to authored anchors and identifies them without false precision", async () => {
    const user = userEvent.setup();
    render(<Harness reducedMotion />);

    await user.click(screen.getByRole("button", { name: /go to lake worlds/i }));

    expect(screen.getByTestId("mars-value")).toHaveTextContent("3500");
    expect(screen.getByText("Authored scientific state")).toBeInTheDocument();
    expect(screen.getByText(/Late Noachian–Early Hesperian.*Lake worlds/)).toBeInTheDocument();
  });

  it("previews present day without destroying the selected ancient date", () => {
    render(<Harness />);
    const reference = screen.getByRole("button", { name: /present reference/i });

    fireEvent.pointerDown(reference);
    expect(reference).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("mars-value")).toHaveTextContent("3700");
    fireEvent.pointerUp(reference);
    expect(reference).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByTestId("mars-value")).toHaveTextContent("3700");
  });

  it("identifies present day as an observed reference rather than a reconstruction", () => {
    render(<PresentHarness />);

    expect(screen.getAllByText(/observed reference/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/constrained reconstruction: water/i)).not.toBeInTheDocument();
  });

  it("supports keyboard scrubbing and a persistent keyboard present reference", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const slider = screen.getByRole("slider", { name: /mars deep time/i });
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByTestId("mars-value")).toHaveTextContent("3690");

    const reference = screen.getByRole("button", { name: /present reference/i });
    reference.focus();
    await user.keyboard("{Enter}");
    expect(reference).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("mars-value")).toHaveTextContent("3690");
  });

  it("offers cancellable autoplay and respects reduced motion", async () => {
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(42);
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    const user = userEvent.setup();
    const { rerender } = render(<Harness />);
    const play = screen.getByRole("button", { name: /play toward present/i });

    await user.click(play);
    expect(play).toHaveAttribute("aria-pressed", "true");
    expect(play).toHaveAccessibleName(/pause journey/i);
    await user.click(play);
    expect(play).toHaveAttribute("aria-pressed", "false");

    rerender(<Harness reducedMotion />);
    expect(screen.getByRole("button", { name: /play toward present/i })).toBeDisabled();
    expect(screen.getByRole("slider", { name: /mars deep time/i })).not.toBeDisabled();
    vi.restoreAllMocks();
  });
});
