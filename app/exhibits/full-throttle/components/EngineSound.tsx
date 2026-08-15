"use client";

import { useEffect, useRef } from "react";
import type { EngineState } from "../types";

type EngineSoundProps = {
  enabled: boolean;
  engine: EngineState;
};

type SoundGraph = {
  context: AudioContext;
  n1FanOsc: OscillatorNode;
  n2CoreOsc: OscillatorNode;
  combustionNoise: AudioBufferSourceNode | null;
  combustionGain: GainNode;
  n1Gain: GainNode;
  n2Gain: GainNode;
  masterGain: GainNode;
  lowPass: BiquadFilterNode;
  highPass: BiquadFilterNode;
};

export function EngineSound({ enabled, engine }: EngineSoundProps) {
  const graphRef = useRef<SoundGraph | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const AudioContextClass =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const masterGain = context.createGain();
    const n1Gain = context.createGain();
    const n2Gain = context.createGain();
    const combustionGain = context.createGain();

    const lowPass = context.createBiquadFilter();
    const highPass = context.createBiquadFilter();

    // N1 Fan Whine (Sawtooth / Sine mix)
    const n1FanOsc = context.createOscillator();
    n1FanOsc.type = "sawtooth";
    n1FanOsc.frequency.value = 42;

    // N2 High-Frequency Core Compressor Scream
    const n2CoreOsc = context.createOscillator();
    n2CoreOsc.type = "sine";
    n2CoreOsc.frequency.value = 160;

    // Generate Pink/Brownian Filtered Combustion Noise
    const bufferSize = context.sampleRate * 2;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const combustionNoise = context.createBufferSource();
    combustionNoise.buffer = noiseBuffer;
    combustionNoise.loop = true;

    // Filter settings
    lowPass.type = "lowpass";
    lowPass.frequency.value = 450;
    highPass.type = "highpass";
    highPass.frequency.value = 30;

    // Initial gains
    masterGain.gain.value = 0.05;
    n1Gain.gain.value = 0.035;
    n2Gain.gain.value = 0.025;
    combustionGain.gain.value = 0.04;

    // Graph routing
    n1FanOsc.connect(n1Gain);
    n2CoreOsc.connect(n2Gain);
    combustionNoise.connect(combustionGain);

    n1Gain.connect(lowPass);
    n2Gain.connect(lowPass);
    combustionGain.connect(lowPass);

    lowPass.connect(highPass);
    highPass.connect(masterGain);
    masterGain.connect(context.destination);

    n1FanOsc.start();
    n2CoreOsc.start();
    combustionNoise.start();

    graphRef.current = {
      context,
      n1FanOsc,
      n2CoreOsc,
      combustionNoise,
      combustionGain,
      n1Gain,
      n2Gain,
      masterGain,
      lowPass,
      highPass,
    };

    return () => {
      try {
        n1FanOsc.stop();
        n2CoreOsc.stop();
        combustionNoise.stop();
        void context.close();
      } catch {
        // cleanup safety
      }
      graphRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    const now = graph.context.currentTime;

    // Dual-spool acoustic harmonic scaling
    const targetN1Freq = 42 + engine.lowSpool * 140;
    const targetN2Freq = 160 + engine.highSpool * 420;
    const targetLowPass = 450 + engine.thrust * 1200;

    graph.n1FanOsc.frequency.setTargetAtTime(targetN1Freq, now, 0.08);
    graph.n2CoreOsc.frequency.setTargetAtTime(targetN2Freq, now, 0.08);
    graph.lowPass.frequency.setTargetAtTime(targetLowPass, now, 0.08);

    graph.n1Gain.gain.setTargetAtTime(0.035 + engine.lowSpool * 0.045, now, 0.08);
    graph.n2Gain.gain.setTargetAtTime(0.025 + engine.highSpool * 0.035, now, 0.08);
    graph.combustionGain.gain.setTargetAtTime(0.04 + engine.heat * 0.08 + engine.thrust * 0.06, now, 0.08);
    graph.masterGain.gain.setTargetAtTime(0.05 + engine.thrust * 0.04, now, 0.08);
  }, [engine.highSpool, engine.lowSpool, engine.thrust, engine.heat]);

  return null;
}
