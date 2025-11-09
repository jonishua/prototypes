"use client";

import { useAudio } from "@/components/audio/AudioProvider";
import { useEffect, useState } from "react";

export function AudioHUD() {
  const { isMuted, toggleMute } = useAudio();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="hud pointer-events-none fixed right-6 top-6 z-50 flex flex-col items-end gap-2">
      <button
        type="button"
        className="press-start neon-border glass flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm uppercase tracking-[0.2em] transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
        onClick={toggleMute}
        aria-pressed={!isMuted}
      >
        <span className="h-2 w-2 rounded-full bg-neon shadow-neon" aria-hidden />
        {isMuted ? "Enable Sound" : "Sound On"}
      </button>
      <div className="glass w-max rounded-full px-4 py-1 font-body text-xs uppercase tracking-[0.3em] text-white/70">
        Ambient wind · Synth pad · Vapor clicks
      </div>
    </div>
  );
}

