import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, setMuted, sounds } from "@/lib/sound";

export function SoundToggle({ className = "" }: { className?: string }) {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
    const onChange = (e: Event) => setMutedState((e as CustomEvent).detail);
    window.addEventListener("arirang:mute", onChange);
    return () => window.removeEventListener("arirang:mute", onChange);
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) sounds.click();
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute" : "Mute"}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur transition hover:shadow-soft ${className}`}
    >
      {muted ? <VolumeX className="h-4 w-4 text-muted-foreground" /> : <Volume2 className="h-4 w-4 text-primary" />}
    </button>
  );
}
