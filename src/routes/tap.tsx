import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MEMBERS, type Member, pickGif } from "@/lib/members";
import { ArrowLeft } from "lucide-react";
import { sounds } from "@/lib/sound";
import { SoundToggle } from "@/components/SoundToggle";

export const Route = createFileRoute("/tap")({
  head: () => ({
    meta: [
      { title: "Tap to Reveal — ARIRANG BTS ARCADE" },
      { name: "description", content: "Tap and reveal a random BTS member with a fun message." },
    ],
  }),
  component: TapGame,
});

function TapGame() {
  const [member, setMember] = useState<Member | null>(null);
  const [gifUrl, setGifUrl] = useState<string>("");
  const [rare, setRare] = useState(false);
  const [key, setKey] = useState(0);
  const [lastIdx, setLastIdx] = useState(-1);

  const reveal = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    let idx = Math.floor(Math.random() * MEMBERS.length);
    while (idx === lastIdx) idx = Math.floor(Math.random() * MEMBERS.length);
    setLastIdx(idx);
    const isRare = Math.random() < 0.1;
    setRare(isRare);
    const m = MEMBERS[idx];
    setMember(m);
    setGifUrl(pickGif(m));
    setKey((k) => k + 1);

    if (isRare) {
      sounds.rare();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#ff4d4d", "#ff6b6b", "#ffe5e5", "#c084fc"],
      });
    } else {
      sounds.reveal();
    }
  };


  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="mx-auto max-w-2xl px-5 py-8">
        <div className="flex items-center justify-between">
          <Link to="/menu" onClick={() => sounds.click()} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <SoundToggle />
        </div>

        <div className="mt-10 text-center">
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            Tap to <span className="text-gradient-rose">Reveal</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Who will appear today?</p>
        </div>

        <div className="mt-12 flex min-h-[420px] items-center justify-center">
          <AnimatePresence mode="wait">
            {!member ? (
              <motion.button
                key="btn"
                onClick={reveal}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-rose text-2xl font-bold text-white shadow-glow sm:h-56 sm:w-56"
              >
                <motion.span
                  className="absolute inset-0 rounded-full bg-white/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative">Tap Here 💜</span>
              </motion.button>
            ) : (
              <motion.div
                key={key}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm"
              >
                <div
                  className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-card"
                  style={{ boxShadow: rare ? `0 0 60px ${member.color}` : undefined }}
                >
                  {rare && (
                    <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-gradient-rose px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      ✨ Rare reveal
                    </div>
                  )}
                  <motion.div
                    className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${member.color}30, ${member.color}10)`,
                      boxShadow: `0 10px 40px -10px ${member.color}`,
                    }}
                    animate={rare ? { scale: [1, 1.06, 1] } : {}}
                    transition={{ duration: 1.5, repeat: rare ? Infinity : 0 }}
                  >
                    <img
                      src={gifUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  </motion.div>
                  <h2 className="mt-6 text-3xl font-black tracking-tight">{member.name}</h2>
                  <p className="mt-3 text-muted-foreground">{member.message}</p>
                </div>

                <button
                  onClick={reveal}
                  className="mt-6 w-full rounded-2xl bg-gradient-rose py-4 font-bold text-white shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  Try Again 💜
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
