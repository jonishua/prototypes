"use client";

import { Float, Html, useCursor } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useAudio } from "@/components/audio/AudioProvider";
import { useCallback, useMemo, useState } from "react";
import * as THREE from "three";
import type { ProjectEntry } from "@/data/projects";

type Props = {
  project: ProjectEntry;
  position: [number, number, number];
};

export function IslandPod({ project, position }: Props) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const { playSfx } = useAudio();

  useCursor(hovered, "pointer", "auto");

  const { platformColor, rimColor, statusColor } = useMemo(() => {
    const base = new THREE.Color("#89F7FE");
    const rim = new THREE.Color("#6DD5FA");
    const statusHex =
      project.status === "Playable"
        ? "#89F7FE"
        : project.status === "Coming Soon"
          ? "#FFD166"
          : "#F78DA7";

    if (hovered) {
      base.offsetHSL(0.05, 0.1, 0.1);
      rim.offsetHSL(0.08, 0.18, 0.2);
    }

    return {
      platformColor: base.getHexString(),
      rimColor: rim.getHexString(),
      statusColor: statusHex
    };
  }, [hovered, project.status]);

  const handlePrimary = useCallback(() => {
    playSfx("click");
    if (project.ctaHref.startsWith("/")) {
      router.push(project.ctaHref);
    } else if (project.ctaHref !== "#") {
      window.open(project.ctaHref, "_blank", "noopener,noreferrer");
    }
  }, [playSfx, project.ctaHref, router]);

  const handleDetail = useCallback(() => {
    playSfx("click");
    router.push(`/projects/${project.slug}`);
  }, [playSfx, project.slug, router]);

  return (
    <Float position={position} speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group
        onPointerOver={() => {
          playSfx("hover");
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh castShadow receiveShadow scale={[2.6, 0.8, 2.6]} position={[0, -0.2, 0]}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial color={`#${platformColor}`} emissive={`#${rimColor}`} emissiveIntensity={hovered ? 0.45 : 0.2} metalness={0.1} roughness={0.4} />
        </mesh>

        <mesh castShadow receiveShadow scale={[2.4, 0.2, 2.4]} position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.8, 1.2, 0.35, 32]} />
          <meshStandardMaterial color="#151F30" emissive={`#${rimColor}`} emissiveIntensity={hovered ? 0.6 : 0.3} roughness={0.8} />
        </mesh>

        <mesh castShadow receiveShadow scale={[1.8, 0.4, 1.8]} position={[0, 0.8, 0]}>
          <torusGeometry args={[1.1, 0.12, 24, 96]} />
          <meshStandardMaterial color={`#${rimColor}`} emissive={`#${rimColor}`} emissiveIntensity={hovered ? 1 : 0.5} roughness={0.2} metalness={0.75} />
        </mesh>

        <Html
          position={[0, 1.7, 0]}
          transform
          distanceFactor={6}
          className="pointer-events-auto"
          style={{ pointerEvents: "auto" }}
        >
          <div className="glass neon-border w-72 rounded-3xl px-6 py-5 text-left shadow-glass transition duration-300 hover:shadow-neon">
            <p className="font-display text-xs uppercase tracking-[0.4em] text-white/60">{project.status}</p>
            <h2 className="mt-1 font-display text-xl uppercase tracking-[0.2em] text-white">{project.title}</h2>
            <p className="mt-3 font-body text-sm text-white/70">{project.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/60">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-2 font-display text-xs uppercase tracking-[0.3em]">
              <button
                type="button"
                className="press-start neon-border rounded-full bg-night/80 px-4 py-2 text-left transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
                onClick={handlePrimary}
              >
                {project.ctaLabel}
              </button>
              <button
                type="button"
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-left text-white/70 transition hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                onClick={handleDetail}
              >
                View Detail
              </button>
            </div>
            <span
              className="absolute right-4 top-4 inline-flex h-3 w-3 items-center justify-center rounded-full shadow-neon"
              style={{ backgroundColor: statusColor }}
            />
          </div>
        </Html>
      </group>
    </Float>
  );
}

