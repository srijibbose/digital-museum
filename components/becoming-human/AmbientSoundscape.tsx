"use client";

import { useEffect, useRef } from "react";

interface SoundGraph {
  context: AudioContext;
  master: GainNode;
  airFilter: BiquadFilterNode;
  airGain: GainNode;
  air: AudioBufferSourceNode;
  tone: OscillatorNode;
  toneGain: GainNode;
  pulse: OscillatorNode;
  pulseDepth: GainNode;
}

const presets = [
  { air: 1450, q: 0.5, airGain: 0.013, tone: 48, toneGain: 0.0024, pulse: 0.08 },
  { air: 520, q: 0.8, airGain: 0.017, tone: 42, toneGain: 0.0038, pulse: 0.13 },
  { air: 2100, q: 0.45, airGain: 0.010, tone: 55, toneGain: 0.0022, pulse: 0.055 },
  { air: 980, q: 0.7, airGain: 0.012, tone: 62, toneGain: 0.0028, pulse: 0.17 },
  { air: 760, q: 0.6, airGain: 0.016, tone: 51, toneGain: 0.002, pulse: 0.10 },
  { air: 310, q: 1.15, airGain: 0.010, tone: 38, toneGain: 0.0055, pulse: 0.72 },
  { air: 2480, q: 0.9, airGain: 0.006, tone: 50, toneGain: 0.0035, pulse: 1.2 },
  { air: 3300, q: 0.5, airGain: 0.006, tone: 59, toneGain: 0.0028, pulse: 0.24 },
] as const;

function actForEpisode(index: number) {
  if (index <= 3) return 0;
  if (index <= 11) return 1;
  if (index <= 18) return 2;
  if (index <= 24) return 3;
  if (index <= 27) return 4;
  if (index <= 30) return 5;
  if (index <= 33) return 6;
  return 7;
}

function makeNoise(context: AudioContext) {
  const buffer = context.createBuffer(1, context.sampleRate * 5, context.sampleRate);
  const data = buffer.getChannelData(0);
  let previous = 0;
  for (let index = 0; index < data.length; index += 1) {
    const white = Math.random() * 2 - 1;
    previous = previous * 0.985 + white * 0.015;
    data[index] = previous * 2.7;
  }
  return buffer;
}

export function AmbientSoundscape({ enabled, chapterIndex }: { enabled: boolean; chapterIndex: number }) {
  const graphRef = useRef<SoundGraph | null>(null);

  useEffect(() => {
    if (!enabled) {
      const graph = graphRef.current;
      if (graph) graph.master.gain.setTargetAtTime(0, graph.context.currentTime, 0.16);
      return;
    }

    const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!graphRef.current) {
      const context = new AudioContextClass();
      const master = context.createGain();
      master.gain.value = 0;

      const air = context.createBufferSource();
      air.buffer = makeNoise(context);
      air.loop = true;
      const airFilter = context.createBiquadFilter();
      airFilter.type = "bandpass";
      const airGain = context.createGain();

      const tone = context.createOscillator();
      tone.type = "sine";
      const toneFilter = context.createBiquadFilter();
      toneFilter.type = "lowpass";
      toneFilter.frequency.value = 150;
      const toneGain = context.createGain();

      const pulse = context.createOscillator();
      pulse.type = "sine";
      const pulseDepth = context.createGain();
      pulseDepth.gain.value = 0.0025;
      pulse.connect(pulseDepth).connect(toneGain.gain);
      air.connect(airFilter).connect(airGain).connect(master);
      tone.connect(toneFilter).connect(toneGain).connect(master);
      master.connect(context.destination);
      air.start();
      tone.start();
      pulse.start();
      graphRef.current = { context, master, airFilter, airGain, air, tone, toneGain, pulse, pulseDepth };
    }

    const graph = graphRef.current;
    void graph.context.resume();
    const now = graph.context.currentTime;
    const preset = presets[actForEpisode(chapterIndex)];
    graph.master.gain.setTargetAtTime(0.72, now, 0.8);
    graph.airFilter.frequency.setTargetAtTime(preset.air, now, 1.2);
    graph.airFilter.Q.setTargetAtTime(preset.q, now, 1.2);
    graph.airGain.gain.setTargetAtTime(preset.airGain, now, 1.1);
    graph.tone.frequency.setTargetAtTime(preset.tone, now, 1.4);
    graph.toneGain.gain.setTargetAtTime(preset.toneGain, now, 1.1);
    graph.pulse.frequency.setTargetAtTime(preset.pulse, now, 1.1);
  }, [chapterIndex, enabled]);

  useEffect(() => () => {
    const graph = graphRef.current;
    if (!graph) return;
    graph.air.stop();
    graph.tone.stop();
    graph.pulse.stop();
    void graph.context.close();
    graphRef.current = null;
  }, []);

  return null;
}
