"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

const CLOUD_POINTS = 400;

export function SkyLayers() {
  const positions = useMemo(() => {
    const temp = [];
    for (let index = 0; index < CLOUD_POINTS; index += 1) {
      const radius = 24 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const y = Math.random() * 6;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
        <circleGeometry args={[38, 64]} />
        <meshStandardMaterial
          color="#12243D"
          emissive="#1F2F4A"
          emissiveIntensity={0.25}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={1.8}
          sizeAttenuation
          depthWrite={false}
          opacity={0.18}
        />
      </Points>
      <CloudBands />
    </group>
  );
}

function CloudBands() {
  const ringMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#6DD5FA",
        emissive: "#89F7FE",
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.2,
        roughness: 0.5,
        metalness: 0.6
      }),
    []
  );

  return (
    <group>
      <mesh
        geometry={new THREE.RingGeometry(14, 15, 128)}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.3, 0]}
        material={ringMaterial}
      />
      <mesh
        geometry={new THREE.RingGeometry(20, 22, 128)}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.6, 0]}
        material={ringMaterial}
      />
      <mesh
        geometry={new THREE.RingGeometry(28, 29.5, 128)}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 1.1, 0]}
        material={ringMaterial}
      />
    </group>
  );
}

