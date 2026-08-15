"use client";

import { useEffect, useRef } from "react";
import { useLivingAtlasStore } from "@/lib/living-atlas/store";
import type { ChapterId } from "@/lib/living-atlas/schema";

const chapterFrequencies: Record<ChapterId, [number, number]> = {
  surface: [54, 81],
  signal: [61, 92],
  breath: [48, 72],
  pulse: [58, 87],
  "fuel-motion": [65, 98],
  whole: [52, 78],
};

type SoundNodes = {
  context: AudioContext;
  master: GainNode;
  voices: [OscillatorNode, OscillatorNode];
  lfo: OscillatorNode;
};

/** A quiet, generative drone built with the Web Audio API—no downloaded audio asset. */
export function AmbientSoundscape() {
  const enabled = useLivingAtlasStore((state) => state.soundEnabled);
  const chapterId = useLivingAtlasStore((state) => state.currentChapterId);
  const nodes = useRef<SoundNodes | null>(null);

  useEffect(() => {
    if (!enabled || typeof window.AudioContext === "undefined") return;

    const context = new window.AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const firstVoice = context.createOscillator();
    const secondVoice = context.createOscillator();
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    const [firstFrequency, secondFrequency] = chapterFrequencies[chapterId];

    firstVoice.type = "sine";
    secondVoice.type = "triangle";
    lfo.type = "sine";
    firstVoice.frequency.setValueAtTime(firstFrequency, context.currentTime);
    secondVoice.frequency.setValueAtTime(secondFrequency, context.currentTime);
    lfo.frequency.setValueAtTime(0.075, context.currentTime);
    lfoGain.gain.setValueAtTime(0.004, context.currentTime);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(480, context.currentTime);
    filter.Q.setValueAtTime(0.7, context.currentTime);
    master.gain.setValueAtTime(0, context.currentTime);
    master.gain.linearRampToValueAtTime(0.018, context.currentTime + 1.4);

    firstVoice.connect(filter);
    secondVoice.connect(filter);
    filter.connect(master);
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    master.connect(context.destination);
    firstVoice.start();
    secondVoice.start();
    lfo.start();
    void context.resume();

    nodes.current = {
      context,
      master,
      voices: [firstVoice, secondVoice],
      lfo,
    };

    return () => {
      const now = context.currentTime;
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.12);
      window.setTimeout(() => {
        firstVoice.stop();
        secondVoice.stop();
        lfo.stop();
        void context.close();
      }, 140);
      nodes.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    const active = nodes.current;
    if (!active) return;
    const [firstFrequency, secondFrequency] = chapterFrequencies[chapterId];
    active.voices[0].frequency.setTargetAtTime(
      firstFrequency,
      active.context.currentTime,
      0.8,
    );
    active.voices[1].frequency.setTargetAtTime(
      secondFrequency,
      active.context.currentTime,
      0.8,
    );
  }, [chapterId]);

  return null;
}
