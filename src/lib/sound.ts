// Lightweight WebAudio sound engine — no network, instant playback.
// Respects a global mute flag stored in localStorage.

let ctx: AudioContext | null = null;

const MUTE_KEY = "arirang:muted";

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(v: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MUTE_KEY, v ? "1" : "0");
  window.dispatchEvent(new CustomEvent("arirang:mute", { detail: v }));
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

type ToneOpts = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  glide?: number; // target frequency to glide to
};

function tone({ freq, duration, type = "sine", gain = 0.2, glide }: ToneOpts, when = 0) {
  const ac = getCtx();
  if (!ac || isMuted()) return;
  const t0 = ac.currentTime + when;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glide) osc.frequency.exponentialRampToValueAtTime(glide, t0 + duration);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const sounds = {
  click: () => tone({ freq: 520, duration: 0.08, type: "triangle", gain: 0.12 }),
  tap: () => tone({ freq: 380, duration: 0.1, type: "sine", gain: 0.15, glide: 720 }),
  catch: () => {
    tone({ freq: 600, duration: 0.09, type: "sine", gain: 0.16, glide: 900 });
  },
  reveal: () => {
    tone({ freq: 440, duration: 0.18, type: "triangle", gain: 0.18, glide: 660 });
    tone({ freq: 660, duration: 0.22, type: "sine", gain: 0.14, glide: 880 }, 0.08);
  },
  reward: () => {
    // C - E - G arpeggio chime
    tone({ freq: 523, duration: 0.18, type: "triangle", gain: 0.18 }, 0);
    tone({ freq: 659, duration: 0.18, type: "triangle", gain: 0.18 }, 0.1);
    tone({ freq: 784, duration: 0.3, type: "triangle", gain: 0.2 }, 0.2);
    tone({ freq: 1047, duration: 0.45, type: "sine", gain: 0.15 }, 0.32);
  },
  rare: () => {
    tone({ freq: 880, duration: 0.4, type: "triangle", gain: 0.18, glide: 1760 });
    tone({ freq: 660, duration: 0.5, type: "sine", gain: 0.14, glide: 1320 }, 0.1);
    tone({ freq: 1320, duration: 0.6, type: "sine", gain: 0.12 }, 0.3);
  },
  fail: () => tone({ freq: 280, duration: 0.25, type: "sawtooth", gain: 0.12, glide: 140 }),
  tick: () => tone({ freq: 1100, duration: 0.04, type: "square", gain: 0.06 }),
  start: () => {
    tone({ freq: 440, duration: 0.12, type: "triangle", gain: 0.16 }, 0);
    tone({ freq: 660, duration: 0.18, type: "triangle", gain: 0.16 }, 0.1);
  },
};
