import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MEMBERS } from "@/lib/members";
import { ArrowLeft, Heart } from "lucide-react";

export const Route = createFileRoute("/hearts")({
  head: () => ({
    meta: [
      { title: "Catch the Hearts — ARIRANG BTS ARCADE" },
      { name: "description", content: "Catch falling BTS hearts in 30 seconds. Hit milestones for member bonuses!" },
    ],
  }),
  component: HeartsGame,
});

type FallingHeart = { id: number; x: number; speed: number; size: number; hue: number };

function HeartsGame() {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [popMember, setPopMember] = useState<{ name: string; emoji: string } | null>(null);
  const idRef = useRef(0);
  const milestonesHit = useRef(new Set<number>());

  const start = () => {
    setScore(0);
    setTime(30);
    setHearts([]);
    milestonesHit.current = new Set();
    setPhase("playing");
  };

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => {
      setTime((s) => {
        if (s <= 1) {
          setPhase("over");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Spawn hearts
  useEffect(() => {
    if (phase !== "playing") return;
    const spawn = setInterval(() => {
      idRef.current += 1;
      setHearts((h) => [
        ...h,
        {
          id: idRef.current,
          x: Math.random() * 90 + 5,
          speed: 4 + Math.random() * 3, // 4-7s (slow/medium)
          size: 28 + Math.random() * 18,
          hue: Math.random() < 0.7 ? 22 : 18,
        },
      ]);
    }, 700);
    return () => clearInterval(spawn);
  }, [phase]);

  // Cleanup hearts
  useEffect(() => {
    if (phase !== "playing") return;
    const cleanup = setInterval(() => {
      setHearts((h) => h.slice(-25));
    }, 2000);
    return () => clearInterval(cleanup);
  }, [phase]);

  // Milestones
  useEffect(() => {
    [10, 20, 30].forEach((m, i) => {
      if (score >= m && !milestonesHit.current.has(m)) {
        milestonesHit.current.add(m);
        const member = MEMBERS[(i * 2 + 1) % MEMBERS.length];
        setPopMember({ name: member.name, emoji: member.emoji });
        setScore((s) => s + 5); // bonus
        setTimeout(() => setPopMember(null), 1800);
      }
    });
  }, [score]);

  const catchHeart = (id: number) => {
    setHearts((h) => h.filter((x) => x.id !== id));
    setScore((s) => s + 1);
    if (navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 mx-auto max-w-3xl px-5 py-6">
        <div className="flex items-center justify-between">
          <Link to="/menu" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          {phase === "playing" && (
            <div className="flex items-center gap-3 text-sm font-bold">
              <span className="rounded-full bg-card px-4 py-2 shadow-soft">⏱ {time}s</span>
              <span className="rounded-full bg-gradient-rose px-4 py-2 text-white shadow-soft">❤️ {score}</span>
            </div>
          )}
        </div>

        {phase === "idle" && (
          <div className="mt-20 text-center">
            <h1 className="font-display text-4xl font-black sm:text-5xl">
              Catch the <span className="text-gradient-rose">Hearts</span>
            </h1>
            <p className="mt-3 text-muted-foreground">30 seconds. Tap as many as you can. Hit 10, 20, 30 for bonuses!</p>
            <button
              onClick={start}
              className="mt-10 rounded-full bg-gradient-rose px-10 py-4 text-lg font-bold text-white shadow-glow transition hover:scale-105 active:scale-95"
            >
              Start ❤️
            </button>
          </div>
        )}

        {phase === "over" && (
          <div className="mt-20 text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Time's up</p>
              <h2 className="mt-3 font-display text-6xl font-black text-gradient-rose">{score}</h2>
              <p className="mt-3 text-lg text-muted-foreground">
                {score >= 30 ? "Borahae! ARMY level 💜" : score >= 15 ? "Great catch! BTS approves." : "Sweet try! One more time?"}
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <button onClick={start} className="rounded-full bg-gradient-rose px-8 py-3 font-bold text-white shadow-soft hover:scale-105">
                  Play Again
                </button>
                <Link to="/menu" className="rounded-full border border-border bg-card px-8 py-3 font-semibold hover:shadow-soft">
                  Menu
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Game field */}
      {phase === "playing" && (
        <div className="pointer-events-none absolute inset-0">
          <AnimatePresence>
            {hearts.map((h) => (
              <motion.button
                key={h.id}
                className="pointer-events-auto absolute"
                style={{ left: `${h.x}%`, top: "-10%" }}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: "115vh", opacity: 1 }}
                exit={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: h.speed, ease: "linear" }}
                onAnimationComplete={() => setHearts((cur) => cur.filter((x) => x.id !== h.id))}
                onClick={() => catchHeart(h.id)}
                whileTap={{ scale: 1.4 }}
              >
                <Heart
                  className="drop-shadow-lg"
                  style={{ width: h.size, height: h.size, color: `oklch(0.7 0.22 ${h.hue})`, fill: `oklch(0.75 0.2 ${h.hue})` }}
                />
              </motion.button>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {popMember && (
              <motion.div
                key={popMember.name}
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: -30 }}
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="rounded-3xl bg-card px-8 py-6 text-center shadow-glow">
                  <div className="text-6xl">{popMember.emoji}</div>
                  <div className="mt-2 font-display text-2xl font-black text-gradient-rose">{popMember.name} +5!</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
