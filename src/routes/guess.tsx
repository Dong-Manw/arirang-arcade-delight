import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MEMBERS, type Member, pickGif } from "@/lib/members";
import { ArrowLeft } from "lucide-react";
import { sounds } from "@/lib/sound";
import { SoundToggle } from "@/components/SoundToggle";

export const Route = createFileRoute("/guess")({
  head: () => ({
    meta: [
      { title: "Guess the Member — ARIRANG BTS ARCADE" },
      { name: "description", content: "A blurred BTS portrait. Four options. Beat the timer!" },
    ],
  }),
  component: GuessGame,
});

function pickRound(prevName?: string) {
  let target = MEMBERS[Math.floor(Math.random() * MEMBERS.length)];
  while (target.name === prevName) target = MEMBERS[Math.floor(Math.random() * MEMBERS.length)];
  const others = MEMBERS.filter((m) => m.name !== target.name).sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [...others, target].sort(() => Math.random() - 0.5);
  const gifUrl = pickGif(target);
  return { target, options, gifUrl };
}

function GuessGame() {
  const [round, setRound] = useState(() => pickRound());
  const [picked, setPicked] = useState<Member | null>(null);
  const [time, setTime] = useState(10);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    if (revealed) return;
    if (time <= 0) {
      setRevealed(true);
      setScore((s) => ({ correct: s.correct, total: s.total + 1 }));
      sounds.fail();
      return;
    }
    const t = setTimeout(() => {
      setTime((x) => x - 1);
      if (time <= 4) sounds.tick();
    }, 1000);
    return () => clearTimeout(t);
  }, [time, revealed]);

  const choose = (m: Member) => {
    if (revealed) return;
    setPicked(m);
    setRevealed(true);
    const isCorrect = m.name === round.target.name;
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
    if (isCorrect) sounds.reward();
    else sounds.fail();
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const next = () => {
    sounds.click();
    setRound(pickRound(round.target.name));
    setPicked(null);
    setRevealed(false);
    setTime(10);
  };

  const correct = picked?.name === round.target.name;

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="mx-auto max-w-2xl px-5 py-8">
        <div className="flex items-center justify-between">
          <Link to="/menu" onClick={() => sounds.click()} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-card px-4 py-2 text-sm font-bold shadow-soft">
              ✓ {score.correct}/{score.total}
            </span>
            <SoundToggle />
          </div>
        </div>

        <div className="mt-8 text-center">
          <h1 className="font-display text-4xl font-black sm:text-5xl">
            Guess the <span className="text-gradient-rose">Member</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Trust your ARMY instincts.</p>
        </div>

        {/* Image card */}
        <div className="mt-8 flex justify-center">
          <motion.div
            key={round.target.name + revealed}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative h-64 w-64 overflow-hidden rounded-3xl border border-border bg-card shadow-card sm:h-80 sm:w-80"
          >
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 50% 35%, ${round.target.color}, oklch(0.95 0.05 20))`,
              }}
            />
            <img
              src={round.gifUrl}
              alt={revealed ? round.target.name : "Mystery member"}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
              style={{
                filter: revealed ? "blur(0px)" : "blur(28px)",
                transform: revealed ? "scale(1)" : "scale(1.15)",
              }}
            />
            <div className="pointer-events-none absolute right-3 bottom-3 text-4xl drop-shadow-lg">
              {revealed ? round.target.emoji : ""}
            </div>
            {!revealed && (
              <div className="absolute right-4 top-4 rounded-full bg-card/90 px-3 py-1 text-sm font-bold backdrop-blur">
                ⏱ {time}s
              </div>
            )}
            {revealed && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-center text-white"
              >
                <div className="text-2xl font-black">{round.target.name}</div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Options */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {round.options.map((m) => {
            const isTarget = m.name === round.target.name;
            const isPicked = picked?.name === m.name;
            return (
              <motion.button
                key={m.name}
                onClick={() => choose(m)}
                disabled={revealed}
                whileTap={{ scale: 0.96 }}
                className="rounded-2xl border bg-card p-4 text-left font-semibold shadow-soft transition disabled:cursor-default"
                style={{
                  borderColor: revealed
                    ? isTarget
                      ? "oklch(0.7 0.2 145)"
                      : isPicked
                        ? "oklch(0.65 0.25 27)"
                        : "var(--border)"
                    : "var(--border)",
                  background: revealed
                    ? isTarget
                      ? "oklch(0.95 0.1 145)"
                      : isPicked
                        ? "oklch(0.95 0.1 27)"
                        : "var(--card)"
                    : "var(--card)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.emoji}</span>
                  <span>{m.name}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="mt-6 rounded-3xl border border-border bg-card p-5 text-center shadow-soft"
            >
              <div className="text-lg font-bold">
                {picked == null ? "⏰ Out of time!" : correct ? "✅ Correct!" : "❌ Not quite"}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{round.target.message}</p>
              <ul className="mx-auto mt-3 max-w-sm space-y-1.5 text-sm text-foreground/80">
                {round.target.extraLines.map((line, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-start justify-center gap-2"
                  >
                    <span className="text-rose-500">•</span>
                    <span>{line}</span>
                  </motion.li>
                ))}
              </ul>
              <button
                onClick={next}
                className="mt-4 rounded-full bg-gradient-rose px-8 py-3 font-bold text-white shadow-soft hover:scale-105 active:scale-95"
              >
                Next Round →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
