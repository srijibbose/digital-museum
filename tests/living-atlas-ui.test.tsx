import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LivingAtlasExperience } from "@/components/living-atlas/LivingAtlasExperience";
import { useLivingAtlasStore } from "@/lib/living-atlas/store";

describe("Living Atlas threshold", () => {
  beforeEach(() => {
    useLivingAtlasStore.getState().resetExperience();
    vi.stubGlobal("scrollTo", vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  it("catches an entry screen that hides the exhibit promise or expected duration", () => {
    render(<LivingAtlasExperience />);

    expect(
      screen.getByRole("heading", { name: /the living atlas/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/12–15 minute/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /begin the journey/i }),
    ).toBeInTheDocument();
  });

  it("catches a begin action that fails to reveal the first chapter", async () => {
    const user = userEvent.setup();
    render(<LivingAtlasExperience />);

    await user.click(
      screen.getByRole("button", { name: /begin the journey/i }),
    );

    expect(
      screen.getByRole("heading", { name: /where does the outside world end/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("01 / 06")).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("catches a simplified-view choice that still starts WebGL-only content", async () => {
    const user = userEvent.setup();
    render(<LivingAtlasExperience />);

    await user.click(
      screen.getByRole("button", { name: /use simplified view/i }),
    );

    expect(useLivingAtlasStore.getState().simplifiedView).toBe(true);
    expect(
      screen.getByRole("img", { name: /warm porcelain outer layer/i }),
    ).toBeInTheDocument();
  });
});

describe("Living Atlas guided experience", () => {
  beforeEach(() => {
    useLivingAtlasStore.getState().resetExperience();
    vi.stubGlobal("scrollTo", vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  async function begin(user: ReturnType<typeof userEvent.setup>) {
    render(<LivingAtlasExperience />);
    await user.click(
      screen.getByRole("button", { name: /begin the journey/i }),
    );
  }

  it("catches next and previous controls that do not preserve chapter order", async () => {
    const user = userEvent.setup();
    await begin(user);

    await user.click(screen.getByRole("button", { name: /next: signal/i }));
    expect(
      screen.getByRole("heading", { name: /how does a touch become/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("02 / 06")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /previous: surface/i }));
    expect(
      screen.getByRole("heading", { name: /where does the outside world end/i }),
    ).toBeInTheDocument();
  });

  it("catches view and motion preferences that are not exposed as accessible toggles", async () => {
    const user = userEvent.setup();
    await begin(user);

    await user.click(screen.getByRole("button", { name: /reduce motion/i }));
    expect(useLivingAtlasStore.getState().reducedMotion).toBe(true);
    expect(
      screen.getByRole("button", { name: /enable full motion/i }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(
      screen.getByRole("button", { name: /switch to simplified atlas/i }),
    );
    expect(useLivingAtlasStore.getState().simplifiedView).toBe(true);
  });

  it("catches an ambient-sound control that changes state without starting audio", async () => {
    const resume = vi.fn();
    const close = vi.fn();
    const makeParam = () => ({
      value: 0,
      setValueAtTime: vi.fn(),
      setTargetAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    });
    const makeNode = () => ({
      connect: vi.fn(),
      disconnect: vi.fn(),
    });
    const AudioContextMock = vi.fn(function MockAudioContext() {
      return {
      currentTime: 0,
      destination: {},
      state: "suspended",
      resume,
      close,
      createGain: vi.fn(() => ({ ...makeNode(), gain: makeParam() })),
      createOscillator: vi.fn(() => ({
        ...makeNode(),
        type: "sine",
        frequency: makeParam(),
        start: vi.fn(),
        stop: vi.fn(),
      })),
      createBiquadFilter: vi.fn(() => ({
        ...makeNode(),
        type: "lowpass",
        frequency: makeParam(),
        Q: makeParam(),
      })),
      };
    });
    vi.stubGlobal("AudioContext", AudioContextMock);
    const user = userEvent.setup();
    await begin(user);

    await user.click(screen.getByRole("button", { name: /enable ambient sound/i }));
    await waitFor(() => expect(AudioContextMock).toHaveBeenCalledOnce());
    expect(resume).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: /mute ambient sound/i }));
    await waitFor(() => expect(close).toHaveBeenCalledOnce());
  });

  it("catches an organ explorer that cannot open and dismiss a semantic detail", async () => {
    const user = userEvent.setup();
    await begin(user);

    await user.click(screen.getByRole("button", { name: /next: signal/i }));
    await user.click(screen.getByRole("button", { name: /next: breath/i }));
    await user.click(screen.getByRole("button", { name: /next: pulse/i }));
    await user.click(screen.getByRole("button", { name: /explore heart/i }));

    const dialog = screen.getByRole("dialog", { name: /heart/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/two connected circuits/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close organ detail/i }));
    expect(screen.queryByRole("dialog", { name: /heart/i })).not.toBeInTheDocument();
  });

  it("catches a journey that cannot reach and restart its epilogue", async () => {
    const user = userEvent.setup();
    await begin(user);

    for (const label of [
      /next: signal/i,
      /next: breath/i,
      /next: pulse/i,
      /next: fuel & motion/i,
      /next: together/i,
      /complete the journey/i,
    ]) {
      await user.click(screen.getByRole("button", { name: label }));
    }

    expect(
      screen.getByRole("heading", { name: /you are a conversation/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /restart journey/i }));
    expect(
      screen.getByRole("heading", { name: /where does the outside world end/i }),
    ).toBeInTheDocument();
  });
});
