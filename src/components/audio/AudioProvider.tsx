"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type AudioContextValue = {
  isMuted: boolean;
  toggleMute: () => void;
  playSfx: (id: "hover" | "click") => void;
};

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

const SFX_SOURCES: Record<"hover" | "click", string> = {
  hover: "/audio/hover-bell.mp3",
  click: "/audio/vapor-click.mp3"
};

type Props = {
  children: React.ReactNode;
};

export function AudioProvider({ children }: Props) {
  const [isMuted, setMuted] = useState(true);
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  const toggleMute = useCallback(() => {
    setMuted((previous) => !previous);
  }, []);

  const playSfx = useCallback(
    (id: "hover" | "click") => {
      if (isMuted) {
        return;
      }
      const src = SFX_SOURCES[id];
      const instance = new Audio(src);
      instance.volume = id === "hover" ? 0.35 : 0.45;
      void instance.play().catch(() => undefined);
    },
    [isMuted]
  );

  const value = useMemo(
    () => ({
      isMuted,
      toggleMute,
      playSfx
    }),
    [isMuted, toggleMute, playSfx]
  );

  useEffect(() => {
    const ambient = ambientRef.current;
    if (!ambient) {
      return;
    }
    if (isMuted) {
      ambient.pause();
      ambient.currentTime = 0;
    } else {
      ambient.volume = 0.28;
      void ambient.play().catch(() => undefined);
    }
  }, [isMuted]);

  return (
    <AudioContext.Provider value={value}>
      <audio
        ref={ambientRef}
        src="/audio/ambient-wind.mp3"
        loop
        preload="auto"
        style={{ display: "none" }}
        muted={isMuted}
        onCanPlay={(event) => {
          if (!isMuted) {
            const target = event.currentTarget;
            void target.play().catch(() => undefined);
          }
        }}
        onPlay={(event) => {
          event.currentTarget.volume = 0.28;
        }}
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

