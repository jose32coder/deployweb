"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";

// Manual tuning knobs
const SPHERE_RADIUS = 1; // smaller globe
const PARTICLE_COUNT = 7000; // denser look
const PARTICLE_SIZE = 0.0258;
const ORBIT_SCALE = 1.15; // rocket distance from sphere
const ROCKET_SPEED_SECONDS = 14.5;
const ROCKET_PATH_POINTS = 12;
const ROCKET_SIZE_MULTIPLIER = 3;
const ROCKET_SCALE = (SPHERE_RADIUS / 1.28) * ROCKET_SIZE_MULTIPLIER;

function RocketAndParticles({ pointerRef, pointerStrengthRef, pulseRef }) {
  const pointsRef = useRef(null);
  const rocketRef = useRef(null);
  const trailRef = useRef(null);
  const progressRef = useRef({ t: 0 });
  const currentPointer = useRef(new THREE.Vector3(10, 10, 10));

  const basePositions = useMemo(() => {
    const data = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const radialBias = 1 - Math.pow(Math.random(), 8) * 0.01;
      const r = SPHERE_RADIUS * radialBias;
      const s = Math.sin(phi);
      data[i * 3] = Math.cos(theta) * s * r;
      data[i * 3 + 1] = Math.cos(phi) * r;
      data[i * 3 + 2] = Math.sin(theta) * s * r;
    }
    return data;
  }, []);

  const positions = useMemo(
    () => new Float32Array(basePositions),
    [basePositions],
  );
  const trailPositions = useMemo(() => new Float32Array(120 * 3), []);

  const rocketPath = useMemo(() => {
    const pts = [];
    for (let i = 0; i < ROCKET_PATH_POINTS; i += 1) {
      const t = i / ROCKET_PATH_POINTS;
      const a = t * Math.PI * 2;
      const b = Math.sin(t * Math.PI * 2 * 1.5) * 0.48;
      const r =
        SPHERE_RADIUS *
        (ORBIT_SCALE + 0.04 * Math.sin(i * 1.4) + 0.03 * Math.cos(i * 0.8));

      pts.push(
        new THREE.Vector3(
          Math.cos(a) * Math.cos(b) * r,
          Math.sin(b) * r * 0.92,
          Math.sin(a) * Math.cos(b) * r,
        ),
      );
    }

    return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);
  }, []);

  useGSAP(() => {
    gsap.to(progressRef.current, {
      t: 1,
      duration: ROCKET_SPEED_SECONDS,
      repeat: -1,
      ease: "none",
    });
  });

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    
    // Smooth pointer movement using lerp
    currentPointer.current.lerp(pointerRef.current, 0.07);
    const pointer = currentPointer.current;
    
    // Elastic strength decay
    const targetStrength = pointerStrengthRef.current > 0 ? 1 : 0;
    pointerStrengthRef.current = THREE.MathUtils.lerp(
      pointerStrengthRef.current,
      targetStrength,
      targetStrength > 0 ? 0.12 : 0.04, // Slower decay for 'lingering' effect
    );

    const pulse = pulseRef.current;
    // Slower pulse decay for ripple effect
    pulse.value = Math.max(0, pulse.value - delta * 0.8);

    const rocketPos = rocketPath.getPointAt(progressRef.current.t);
    const rocketNext = rocketPath.getPointAt(
      (progressRef.current.t + 0.0027) % 1,
    );
    const tangent = rocketNext.clone().sub(rocketPos).normalize();

    if (rocketRef.current) {
      rocketRef.current.position.copy(rocketPos);
      rocketRef.current.lookAt(rocketNext);
      rocketRef.current.rotateX(Math.PI / 2);
    }

    if (trailRef.current) {
      for (let i = trailPositions.length - 3; i >= 3; i -= 3) {
        trailPositions[i] = trailPositions[i - 3];
        trailPositions[i + 1] = trailPositions[i - 2];
        trailPositions[i + 2] = trailPositions[i - 1];
      }

      trailPositions[0] = rocketPos.x - tangent.x * 0.06;
      trailPositions[1] = rocketPos.y - tangent.y * 0.06;
      trailPositions[2] = rocketPos.z - tangent.z * 0.06;
      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }

    const attr = pointsRef.current?.geometry?.attributes?.position;
    if (!attr) return;

    const pointerStrength = pointerStrengthRef.current * 0.5;
    // Ripple effect: use sin to create waves
    const rippleWave = Math.sin(pulse.value * Math.PI * 4) * pulse.value;
    const clickStrength = rippleWave * 0.6;
    const rocketStrength = 0.45;

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const idx = i * 3;
      const bx = basePositions[idx];
      const by = basePositions[idx + 1];
      const bz = basePositions[idx + 2];

      let x = bx;
      let y = by;
      let z = bz;

      // Organic breathing
      const breathe = 1 + 0.009 * Math.sin(elapsed * 1.25 + i * 0.01);
      x *= breathe;
      y *= breathe;
      z *= breathe;

      const dxp = x - pointer.x;
      const dyp = y - pointer.y;
      const dzp = z - pointer.z;
      const dp = Math.sqrt(dxp * dxp + dyp * dyp + dzp * dzp) || 1;
      
      // Calculate influence with a 'bounce' factor
      const pInfluence = Math.max(0, 1 - dp / 1.1) * (pointerStrength + clickStrength);

      if (pInfluence !== 0) {
        // Ripple physics: push/pull based on the wave
        const push = pInfluence * 0.12;
        x += (dxp / dp) * push;
        y += (dyp / dp) * push;
        z += (dzp / dp) * push;
      }

      const dxr = x - rocketPos.x;
      const dyr = y - rocketPos.y;
      const dzr = z - rocketPos.z;
      const dr = Math.sqrt(dxr * dxr + dyr * dyr + dzr * dzr) || 1;
      const rInfluence = Math.max(0, 1 - dr / 0.72) * rocketStrength;

      if (rInfluence > 0) {
        const swirl = 0.08 * rInfluence;
        x += (-dyr * tangent.z + dzr * tangent.y) * swirl;
        y += (dxr * tangent.z - dzr * tangent.x) * swirl;
        z += (-dxr * tangent.y + dyr * tangent.x) * swirl;
      }

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
    }

    attr.needsUpdate = true;
    if (pointsRef.current.material) {
      pointsRef.current.material.opacity = 0.8 + Math.sin(elapsed * 2.3) * 0.05;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#f2f6ff"
          size={PARTICLE_SIZE}
          sizeAttenuation
          transparent
          opacity={0.84}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <line ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions, 3]}
            count={120}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#b9c6ff"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </line>

      <group ref={rocketRef} scale={ROCKET_SCALE}>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.026, 0.032, 0.19, 14]} />
          <meshStandardMaterial
            color="#e8ecff"
            metalness={0.25}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.125, 0]}>
          <coneGeometry args={[0.026, 0.07, 14]} />
          <meshStandardMaterial
            color="#f7fbff"
            metalness={0.25}
            roughness={0.26}
          />
        </mesh>
        <mesh position={[0, 0.028, 0.028]}>
          <sphereGeometry args={[0.0085, 10, 10]} />
          <meshStandardMaterial
            emissive="#9dc2ff"
            emissiveIntensity={1.3}
            color="#89abff"
          />
        </mesh>
        <mesh position={[0, -0.078, 0]}>
          <cylinderGeometry args={[0.013, 0.019, 0.043, 12]} />
          <meshStandardMaterial
            color="#8295ff"
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, -0.116, 0]}>
          <coneGeometry args={[0.013, 0.045, 10]} />
          <meshBasicMaterial color="#9ab4ff" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.029, -0.043, 0]} rotation={[0, 0, Math.PI * 0.2]}>
          <boxGeometry args={[0.011, 0.034, 0.0035]} />
          <meshStandardMaterial
            color="#d5e1ff"
            metalness={0.25}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[-0.029, -0.043, 0]} rotation={[0, 0, -Math.PI * 0.2]}>
          <boxGeometry args={[0.011, 0.034, 0.0035]} />
          <meshStandardMaterial
            color="#d5e1ff"
            metalness={0.25}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, -0.043, 0.029]} rotation={[Math.PI * 0.2, 0, 0]}>
          <boxGeometry args={[0.0035, 0.034, 0.011]} />
          <meshStandardMaterial
            color="#d5e1ff"
            metalness={0.25}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, -0.043, -0.029]} rotation={[-Math.PI * 0.2, 0, 0]}>
          <boxGeometry args={[0.0035, 0.034, 0.011]} />
          <meshStandardMaterial
            color="#d5e1ff"
            metalness={0.25}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function ParticleGlobe() {
  const wrapperRef = useRef(null);
  const pointerRef = useRef(new THREE.Vector3(10, 10, 10));
  const pointerStrengthRef = useRef(0);
  const pulseRef = useRef({ value: 0 });

  const updatePointer = (event) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current.set(
      nx * SPHERE_RADIUS * 1.3,
      ny * SPHERE_RADIUS * 1.3,
      0.14,
    );
    pointerStrengthRef.current = 1;
  };

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full"
      style={{ touchAction: "pan-y" }}
      onPointerMove={updatePointer}
      onPointerDown={(event) => {
        updatePointer(event);
        pulseRef.current.value = 1;
      }}
      onPointerLeave={() => {
        pointerStrengthRef.current = 0;
        pulseRef.current.value = 1.2; // Trigger wave/ripple effect on leave
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.7], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={0.75} />
        <pointLight position={[2.2, 1.5, 2]} intensity={1.1} color="#e8eeff" />
        <pointLight
          position={[-2, -1.4, 1.2]}
          intensity={0.6}
          color="#748fff"
        />
        <RocketAndParticles
          pointerRef={pointerRef}
          pointerStrengthRef={pointerStrengthRef}
          pulseRef={pulseRef}
        />
      </Canvas>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle, rgba(135,149,255,0.25) 0%, rgba(60,72,185,0.12) 42%, rgba(9,9,11,0) 72%)",
        }}
      />
    </div>
  );
}
