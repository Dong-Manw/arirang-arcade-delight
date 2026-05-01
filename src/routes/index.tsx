import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARIRANG BTS ARCADE — Play & Purple You 💜" },
      { name: "description", content: "A premium Korean-inspired BTS mini-arcade. Tap to reveal members, catch hearts, and guess BTS." },
      { property: "og:title", content: "ARIRANG BTS ARCADE" },
      { property: "og:description", content: "Three delightful BTS mini-games. White & red, Korean-minimal, made with love." },
    ],
  }),
  component: Intro,
});

function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/menu" }), 2800);
    return () => clearTimeout(t);
  }, [navigate]);

  // Build segmented circle dots
  const dots = Array.from({ length: 12 });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Segmented circle around logo */}
        <div className="relative mb-8 h-48 w-48 sm:h-56 sm:w-56">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent, oklch(0.7 0.25 22 / 0.4), transparent, oklch(0.75 0.2 18 / 0.3), transparent)",
              filter: "blur(8px)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          {dots.map((_, i) => {
            const angle = (i / dots.length) * Math.PI * 2;
            const r = 88;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-gradient-rose"
                style={{ x, y }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.85] }}
                transition={{ duration: 1, delay: 0.3 + i * 0.05, ease: "easeOut" }}
              />
            );
          })}

          <motion.div
            className="absolute inset-6 rounded-full"
            style={{ background: "var(--gradient-glow)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="text-center">
              <div className="font-korean text-5xl text-gradient-rose sm:text-6xl">아리랑</div>
            </div>
          </motion.div>
        </div>

        <motion.h1
          className="font-display text-4xl font-black tracking-tight text-gradient-rose sm:text-6xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          ARIRANG
        </motion.h1>
        <motion.p
          className="mt-2 text-sm font-medium tracking-[0.4em] text-muted-foreground sm:text-base"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          BTS · ARCADE
        </motion.p>
        <motion.p
          className="mt-3 font-korean text-lg text-foreground/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          방탄소년단 💜
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-10 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Loading the stage…
      </motion.div>
    </div>
  );
}
