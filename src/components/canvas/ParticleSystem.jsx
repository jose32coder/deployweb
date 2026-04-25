"use client";
import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getSpherePositions, getCubePositions, getCodeBracketsPositions } from "./Shapes";

const PARTICLE_COUNT = 7000;
const SPHERE_RADIUS = 1;

export default function ParticleSystem({ 
  activeShape = 0, 
  morphProgress = 0, // 0 to 1 controlled by scroll
  pointerRef, 
  pointerStrengthRef, 
  pulseRef,
  rocketPos,
  tangent
}) {
  const pointsRef = useRef(null);
  
  const shapes = useMemo(() => [
    getSpherePositions(PARTICLE_COUNT, SPHERE_RADIUS),
    getCodeBracketsPositions(PARTICLE_COUNT, SPHERE_RADIUS * 1.2),
    getCubePositions(PARTICLE_COUNT, SPHERE_RADIUS * 1.5)
  ], []);

  const currentPositions = useMemo(() => new Float32Array(shapes[0]), [shapes]);
  
  // Track last shape to know where we are morphing FROM
  const lastShapeRef = useRef(0);
  const targetShapeRef = useRef(0);

  useEffect(() => {
    if (activeShape !== targetShapeRef.current) {
      lastShapeRef.current = targetShapeRef.current;
      targetShapeRef.current = activeShape;
    }
  }, [activeShape]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const attr = pointsRef.current?.geometry?.attributes?.position;
    if (!attr) return;

    // Smooth transition curve
    const ease = morphProgress < 0.5 ? 2 * morphProgress * morphProgress : -1 + (4 - 2 * morphProgress) * morphProgress;

    const fromShape = shapes[lastShapeRef.current];
    const toShape = shapes[targetShapeRef.current];

    const pointer = pointerRef.current;
    const pointerStrength = pointerStrengthRef.current * 0.5;
    const rippleWave = Math.sin(pulseRef.current.value * Math.PI * 4) * pulseRef.current.value;
    const clickStrength = rippleWave * 0.6;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      
      // Interpolate based on SCROLL progress
      let x = fromShape[idx] + (toShape[idx] - fromShape[idx]) * ease;
      let y = fromShape[idx + 1] + (toShape[idx + 1] - fromShape[idx + 1]) * ease;
      let z = fromShape[idx + 2] + (toShape[idx + 2] - fromShape[idx + 2]) * ease;

      // Organic breathing (always active)
      const breathe = 1 + 0.009 * Math.sin(elapsed * 1.25 + i * 0.01);
      x *= breathe; y *= breathe; z *= breathe;

      // Mouse Influence
      const dxp = x - pointer.x;
      const dyp = y - pointer.y;
      const dzp = z - pointer.z;
      const dp = Math.sqrt(dxp * dxp + dyp * dyp + dzp * dzp) || 1;
      const pInfluence = Math.max(0, 1 - dp / 1.1) * (pointerStrength + clickStrength);

      if (pInfluence !== 0) {
        const push = pInfluence * 0.12;
        x += (dxp / dp) * push; y += (dyp / dp) * push; z += (dzp / dp) * push;
      }

      // Rocket Influence (only if visible)
      if (rocketPos && tangent && lastShapeRef.current === 0 && targetShapeRef.current === 0) {
        const dxr = x - rocketPos.x;
        const dyr = y - rocketPos.y;
        const dzr = z - rocketPos.z;
        const dr = Math.sqrt(dxr * dxr + dyr * dyr + dzr * dzr) || 1;
        const rInfluence = Math.max(0, 1 - dr / 0.72) * 0.45;

        if (rInfluence > 0) {
          const swirl = 0.08 * rInfluence;
          x += (-dyr * tangent.z + dzr * tangent.y) * swirl;
          y += (dxr * tangent.z - dzr * tangent.x) * swirl;
          z += (-dxr * tangent.y + dyr * tangent.x) * swirl;
        }
      }

      currentPositions[idx] = x;
      currentPositions[idx + 1] = y;
      currentPositions[idx + 2] = z;
    }

    attr.needsUpdate = true;
    if (pointsRef.current.material) {
      pointsRef.current.material.opacity = 0.8 + Math.sin(elapsed * 2.3) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f2f6ff"
        size={0.0258}
        sizeAttenuation
        transparent
        opacity={0.84}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
