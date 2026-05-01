import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { SoundToggle } from "@/components/SoundToggle";
import { sounds } from "@/lib/sound";
import { useState } from "react";
import { Share2, Check } from "lucide-react";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Choose Your Game — ARIRANG BTS ARCADE" },
      { name: "description", content: "Pick a BTS mini-game: Tap to Reveal, Catch the Hearts, or Guess the Member." },
    ],
  }),
  component: Menu,
});

const GAMES = [
  {
    to: "/tap" as const,
    title: "Tap to Reveal",
    icon: "💜",
    desc: "Reveal a random BTS member with a magical flip.",
    accent: "oklch(0.62 0.2 305)",
  },
  {
    to: "/hearts" as const,
    title: "Catch the Hearts",
    icon: "❤️",
    desc: "Catch falling hearts in 30 seconds. Score big!",
    accent: "oklch(0.7 0.22 22)",
  },
  {
    to: "/guess" as const,
    title: "Guess the Member",
    icon: "👁",
    desc: "A blurred photo. Four choices. One chance.",
    accent: "oklch(0.75 0.18 18)",
  },
];

function Menu() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-16">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <Link to="/" className="font-korean text-2xl text-gradient-rose">아리랑</Link>
          <button
            onClick={share}
            className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium backdrop-blur transition hover:shadow-soft"
          >
            {copied ? <><Check className="h-4 w-4 text-primary" /> Copied!</> : <><Share2 className="h-4 w-4" /> Share</>}
          </button>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-12 text-center sm:mt-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Welcome to</p>
          <h1 className="mt-3 font-display text-5xl font-black tracking-tight sm:text-7xl">
            <span className="text-gradient-rose">ARIRANG</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Three premium BTS mini-games. Pick your moment of joy. <span className="font-korean text-foreground/80">방탄 💜</span>
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-3">
          {GAMES.map((g, i) => (
            <motion.div
              key={g.to}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={g.to} className="group relative block">
                <div
                  className="absolute -inset-px rounded-3xl opacity-60 blur-md transition group-hover:opacity-100"
                  style={{ background: `linear-gradient(135deg, ${g.accent}, oklch(0.85 0.1 20))` }}
                />
                <div className="relative flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-card transition group-hover:shadow-glow">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                    style={{ background: `${g.accent}1a`, boxShadow: `0 8px 24px -8px ${g.accent}` }}
                  >
                    {g.icon}
                  </div>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight">{g.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{g.desc}</p>
                  <div className="mt-6 flex items-center text-sm font-semibold text-primary">
                    Play now
                    <span className="ml-1 transition group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center text-xs text-muted-foreground"
        >
          Made for ARMY · No login · Works on any device
        </motion.p>
      </div>
    </div>
  );
}
