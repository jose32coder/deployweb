"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import Rocket from "./canvas/Rocket";
import ParticleSystem from "./canvas/ParticleSystem";

const SPHERE_RADIUS = 1;
const ORBIT_SCALE = 1.08;
const ROCKET_SPEED_SECONDS = 14.5;
const ROCKET_PATH_POINTS = 12;
const ROCKET_SIZE_MULTIPLIER = 2.6;
const ROCKET_SCALE = (SPHERE_RADIUS / 1.5) * ROCKET_SIZE_MULTIPLIER;

function RocketAndParticles({
  activeShape,
  morphProgress,
  rocketOpacity = 1,
  pointerRef,
  pointerStrengthRef,
  pulseRef,
}) {
  const rocketRef = useRef(null);
  const trailRef = useRef(null);
  const progressRef = useRef({ t: 0 });
  const trailPositions = useMemo(() => new Float32Array(120 * 3), []);
  const [rocketState, setRocketState] = useState({ pos: null, tangent: null });

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

  useFrame((state) => {
    const rocketPos = rocketPath.getPointAt(progressRef.current.t);
    const rocketNext = rocketPath.getPointAt(
      (progressRef.current.t + 0.0027) % 1,
    );
    const tangent = rocketNext.clone().sub(rocketPos).normalize();

    setRocketState({ pos: rocketPos, tangent: tangent });

    if (rocketRef.current) {
      rocketRef.current.position.copy(rocketPos);
      rocketRef.current.lookAt(rocketNext);
      rocketRef.current.rotateX(Math.PI / 2);

      // Visual feedback for docking/parking
      rocketRef.current.visible = rocketOpacity > 0.01;
      rocketRef.current.scale.setScalar(ROCKET_SCALE * rocketOpacity);
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
      trailRef.current.material.opacity = 0.55 * rocketOpacity;
    }
  });

  return (
    <group>
      <ParticleSystem
        activeShape={activeShape}
        morphProgress={morphProgress}
        pointerRef={pointerRef}
        pointerStrengthRef={pointerStrengthRef}
        pulseRef={pulseRef}
        rocketPos={rocketState.pos}
        tangent={rocketState.tangent}
      />

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

      <Rocket rocketRef={rocketRef} scale={ROCKET_SCALE} />
    </group>
  );
}

export default function ParticleGlobe({
  activeShape = 0,
  morphProgress = 0,
  rocketOpacity = 1,
}) {
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
      className="h-full w-full"
      onPointerMove={updatePointer}
      onPointerDown={(e) => {
        updatePointer(e);
        pulseRef.current.value = 1;
      }}
      onPointerLeave={() => {
        pointerStrengthRef.current = 0;
        pulseRef.current.value = 1.2;
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.7], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.75} />
        <pointLight position={[2.2, 1.5, 2]} intensity={1.1} color="#e8eeff" />
        <pointLight
          position={[-2, -1.4, 1.2]}
          intensity={0.6}
          color="#748fff"
        />
        <RocketAndParticles
          activeShape={activeShape}
          morphProgress={morphProgress}
          rocketOpacity={rocketOpacity}
          pointerRef={pointerRef}
          pointerStrengthRef={pointerStrengthRef}
          pulseRef={pulseRef}
        />
      </Canvas>
    </div>
  );
}
