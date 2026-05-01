import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Play, Pause, SkipForward, X } from "lucide-react";
import { SONGS, type Song } from "@/lib/songs";

// Minimal YouTube IFrame API typing
declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: Record<string, unknown>,
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (id: string) => void;
  setVolume: (v: number) => void;
  getPlayerState: () => number;
};

let apiLoading: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoading) return apiLoading;
  apiLoading = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = () => resolve();
  });
  return apiLoading;
}

export function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [songIdx, setSongIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const current: Song = SONGS[songIdx];

  // Init the YouTube player once
  useEffect(() => {
    let cancelled = false;
    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "0",
        width: "0",
        videoId: SONGS[0].id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            playerRef.current?.setVolume(35);
            setReady(true);
          },
          onStateChange: (e: { data: number }) => {
            if (!window.YT) return;
            if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true);
            else if (e.data === window.YT.PlayerState.PAUSED) setPlaying(false);
            else if (e.data === window.YT.PlayerState.ENDED) {
              setSongIdx((i) => (i + 1) % SONGS.length);
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-advance: when songIdx changes, load + play
  useEffect(() => {
    if (!ready || !playerRef.current) return;
    playerRef.current.loadVideoById(current.id);
    playerRef.current.playVideo();
  }, [songIdx, ready, current.id]);

  const toggle = () => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const pick = (i: number) => {
    setSongIdx(i);
    setOpen(false);
  };

  const next = () => setSongIdx((i) => (i + 1) % SONGS.length);

  return (
    <>
      {/* Hidden YouTube iframe host */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        <div ref={containerRef} />
      </div>

      {/* Floating control bar */}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <motion.div
          layout
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-2 shadow-glow backdrop-blur"
        >
          <button
            onClick={toggle}
            disabled={!ready}
            aria-label={playing ? "Pause music" : "Play music"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-rose text-white shadow-soft transition hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex max-w-[180px] items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold hover:bg-muted sm:max-w-[260px] sm:text-sm"
          >
            <Music className="h-3.5 w-3.5 shrink-0 text-rose-500" />
            <span className="truncate">{current.title}</span>
          </button>

          <button
            onClick={next}
            disabled={!ready}
            aria-label="Next song"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted disabled:opacity-50"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </motion.div>
      </div>

      {/* Song picker sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-hidden rounded-t-3xl border border-border bg-card shadow-glow"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h3 className="font-display text-lg font-black">
                    Pick a <span className="text-gradient-rose">BTS song</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Plays in the background while you play.</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 hover:bg-muted"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ul className="max-h-[55vh] overflow-y-auto p-2">
                {SONGS.map((s, i) => {
                  const active = i === songIdx;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => pick(i)}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-muted"
                        style={{
                          background: active ? "var(--muted)" : undefined,
                        }}
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: active
                              ? "var(--gradient-rose, linear-gradient(135deg, oklch(0.7 0.2 25), oklch(0.65 0.22 350)))"
                              : "oklch(0.95 0.02 20)",
                          }}
                        >
                          {active && playing ? (
                            <Pause className="h-4 w-4 text-white" />
                          ) : (
                            <Play
                              className="h-4 w-4"
                              style={{ color: active ? "white" : "oklch(0.6 0.2 25)" }}
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">{s.title}</div>
                          <div className="text-xs text-muted-foreground">{s.era}</div>
                        </div>
                        {active && (
                          <span className="rounded-full bg-gradient-rose px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            Now
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
