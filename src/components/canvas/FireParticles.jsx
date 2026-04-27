"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 500;

export default function FireParticles() {
  const pointsRef = useRef(null);
  const alphasRef = useRef(new Float32Array(PARTICLE_COUNT));
  const velocitiesRef = useRef(new Float32Array(PARTICLE_COUNT * 3));

  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const alphas = alphasRef.current;
    const velocities = velocitiesRef.current;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Posiciones iniciales en la base del cohete, en forma de cono
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.05;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -0.5 + Math.random() * 0.1;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      // Velocidades hacia abajo y ligeramente radiales
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = -Math.random() * 0.02 - 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      alphas[i] = Math.random() * 0.8 + 0.2;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Colores naranjas/rojos para fuego
      const intensity = Math.random();
      cols[i * 3] = 1; // R
      cols[i * 3 + 1] = intensity * 0.5 + 0.3; // G
      cols[i * 3 + 2] = intensity * 0.2; // B
    }
    return cols;
  }, []);

  useFrame((state) => {
    const attr = pointsRef.current?.geometry?.attributes;
    if (!attr) return;

    const positions = attr.position.array;
    const alphas = alphasRef.current;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      // Actualizar posiciones
      positions[idx] += velocities[idx];
      positions[idx + 1] += velocities[idx + 1];
      positions[idx + 2] += velocities[idx + 2];

      // Fade out
      alphas[i] -= 0.01;
      if (alphas[i] <= 0) {
        // Reset particle
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.05;
        positions[idx] = Math.cos(angle) * radius;
        positions[idx + 1] = -0.5 + Math.random() * 0.1;
        positions[idx + 2] = Math.sin(angle) * radius;

        velocities[idx] = (Math.random() - 0.5) * 0.01;
        velocities[idx + 1] = -Math.random() * 0.02 - 0.01;
        velocities[idx + 2] = (Math.random() - 0.5) * 0.01;

        alphas[i] = Math.random() * 0.8 + 0.2;
      }
    }

    attr.position.needsUpdate = true;
    if (attr.color) attr.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        alphaTest={0.001}
        sizeAttenuation
      />
    </points>
  );
}