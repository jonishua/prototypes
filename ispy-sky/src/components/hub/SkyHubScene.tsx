"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { AdaptiveDpr, AdaptiveEvents, Environment, OrbitControls, Stars } from "@react-three/drei";
import { type ProjectEntry } from "@/data/projects";
import { IslandPod } from "@/components/hub/IslandPod";
import { SkyLayers } from "@/components/hub/SkyLayers";

type Props = {
  projects: ProjectEntry[];
};

export default function SkyHubScene({ projects }: Props) {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-night">
      <Canvas
        shadows
        camera={{ position: [0, 2.5, 10], fov: 60, near: 0.1, far: 200 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050C1A"]} />
        <fog attach="fog" args={["#0B162A", 30, 120]} />
        <Suspense fallback={null}>
          <SceneContent projects={projects} />
        </Suspense>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between px-8 py-6 text-xs uppercase tracking-[0.4em] text-white/60">
        <span>Scroll or drag to orbit</span>
        <span>Hover islands • Tap to explore</span>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex w-full max-w-4xl -translate-x-1/2 flex-col items-center gap-3 px-6 text-center">
        <div className="glass neon-border w-full rounded-3xl px-8 py-6 shadow-glass">
          <p className="font-display text-base uppercase tracking-[0.45em] text-white/80">
            The Cloud Arcade
          </p>
          <p className="mt-3 font-body text-sm text-white/60">
            Each floating pod is wired to shared project data. Extend the collection by dropping new entries into a single source of truth.
          </p>
        </div>
      </div>
    </div>
  );
}

function SceneContent({ projects }: Props) {
  const positions = useMemo(() => generateIslandPositions(projects.length), [projects.length]);

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[12, 30, 20]}
        intensity={2.4}
        color="#89F7FE"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-18, 10, -10]} intensity={0.6} color="#6DD5FA" />

      <SkyLayers />

      <group position={[0, -2, 0]}>
        {projects.map((project, index) => (
          <IslandPod key={project.id} project={project} position={positions[index]} />
        ))}
      </group>

      <Stars radius={120} depth={60} count={6000} factor={4} saturation={0} fade speed={0.5} />
      <Environment preset="sunset" background={false} />
      <OrbitControls
        enablePan
        enableDamping
        dampingFactor={0.12}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(Math.PI / 2) * 0.98}
        minDistance={8}
        maxDistance={40}
        rotateSpeed={0.3}
        zoomSpeed={0.6}
        panSpeed={0.6}
      />
    </>
  );
}

function generateIslandPositions(count: number) {
  const radius = 8;
  const height = 0.5;
  const positions: [number, number, number][] = [];

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(angle * 1.2) * 1.2 + height;
    positions.push([x, y, z]);
  }

  return positions;
}

