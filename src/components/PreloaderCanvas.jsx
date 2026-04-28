"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import Rocket from "./canvas/Rocket";

const START_RADIUS = 2.6;
const DOCK_RADIUS = 0.75;
const DEPTH_START = -4.8;
const DEPTH_END = -0.2;
const ROCKET_SCALE = 0.82;

const seededRandom = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453123;
  return value - Math.floor(value);
};

function Starfield({
  count = 900,
  radiusMin = 9,
  radiusMax = 24,
  color = "#d9e2ff",
  size = 0.03,
  opacity = 0.82,
  speed = 0.012,
}) {
  const starsRef = useRef(null);

  const starPositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const seed = i + count * 0.37 + radiusMin * 0.19;
      const theta = seededRandom(seed + 1) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(seed + 2) - 1);
      const radius =
        radiusMin + seededRandom(seed + 3) * (radiusMax - radiusMin);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, [count, radiusMax, radiusMin]);

  useFrame((state, delta) => {
    if (!starsRef.current) return;
    starsRef.current.rotation.y += delta * speed;
    starsRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starPositions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function EnergySphere({ motionRef }) {
  const innerShellRef = useRef(null);
  const outerGlowRef = useRef(null);

  useFrame((state) => {
    const motion = motionRef.current;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.015;
    const dock = motion.dock;
    const exit = motion.exit;

    if (innerShellRef.current) {
      const shellScale = 1 + dock * 0.16 - exit * 0.09;
      innerShellRef.current.scale.setScalar(shellScale * pulse);
      innerShellRef.current.material.opacity = 0.32 + dock * 0.28 - exit * 0.2;
    }

    if (outerGlowRef.current) {
      const glowScale = 1.18 + dock * 0.2 - exit * 0.08;
      outerGlowRef.current.scale.setScalar(glowScale * pulse);
      outerGlowRef.current.material.opacity = 0.22 + dock * 0.22 - exit * 0.16;
    }
  });

  return (
    <group>
      <mesh ref={innerShellRef}>
        <icosahedronGeometry args={[1.02, 8]} />
        <meshStandardMaterial
          color="#a4b9ff"
          emissive="#6f8cff"
          emissiveIntensity={1.6}
          metalness={0.08}
          roughness={0.32}
          transparent
          opacity={0.34}
          wireframe
        />
      </mesh>

      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[1.2, 38, 38]} />
        <meshBasicMaterial
          color="#8aa5ff"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function RocketFlight({ isExiting, targetCoords, onRocketProjectedPosition }) {
  const rocketRef = useRef(null);
  const motionRef = useRef({ orbit: 0, dock: 0, exit: 0, thruster: 0 });
  const exitTargetRef = useRef(new THREE.Vector3(-5.6, 3.4, 6.4));

  const orbitTweenRef = useRef(null);
  const dockTweenRef = useRef(null);
  const thrusterTweenRef = useRef(null);
  const exitTweenRef = useRef(null);

  const temp = useMemo(
    () => ({
      orbitPos: new THREE.Vector3(),
      nextPos: new THREE.Vector3(),
      currentPos: new THREE.Vector3(),
      direction: new THREE.Vector3(),
      projected: new THREE.Vector3(),
    }),
    [],
  );

  useGSAP(() => {
    gsap.set(motionRef.current, { orbit: 0, dock: 0, exit: 0, thruster: 0 });

    orbitTweenRef.current = gsap.to(motionRef.current, {
      orbit: 1,
      duration: 7.6,
      repeat: -1,
      ease: "none",
    });

    dockTweenRef.current = gsap.to(motionRef.current, {
      dock: 1,
      duration: 2.8,
      ease: "expo.out",
    });

    thrusterTweenRef.current = gsap.to(motionRef.current, {
      thruster: 1,
      duration: 0.45,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      orbitTweenRef.current?.kill();
      dockTweenRef.current?.kill();
      thrusterTweenRef.current?.kill();
      exitTweenRef.current?.kill();
    };
  }, []);

  const targetX = targetCoords?.x ?? -240;
  const targetY = targetCoords?.y ?? -140;

  useGSAP(
    () => {
      if (!isExiting) return;

      orbitTweenRef.current?.kill();
      dockTweenRef.current?.kill();
      exitTweenRef.current?.kill();

      const normalizedX = THREE.MathUtils.clamp(
        targetX / (window.innerWidth * 0.5),
        -1,
        1,
      );
      const normalizedY = THREE.MathUtils.clamp(
        targetY / (window.innerHeight * 0.5),
        -1,
        1,
      );

      exitTargetRef.current.set(
        normalizedX * 6.8,
        -normalizedY * 4.1 + 0.6,
        6.8,
      );

      gsap.to(motionRef.current, {
        dock: 1,
        duration: 0.35,
        ease: "power2.out",
      });

      exitTweenRef.current = gsap.to(motionRef.current, {
        exit: 1,
        duration: 1.5,
        ease: "power4.inOut",
      });

      gsap.to(motionRef.current, {
        thruster: 1.2,
        duration: 0.3,
        ease: "power1.out",
      });
    },
    { dependencies: [isExiting, targetX, targetY] },
  );

  useFrame((state) => {
    const motion = motionRef.current;

    const angle = motion.orbit * Math.PI * 2;
    const dock = motion.dock;

    const orbitNoise = Math.sin(angle * 2.1) * 0.24 * (1 - dock * 0.64);
    const orbitRadius =
      THREE.MathUtils.lerp(START_RADIUS, DOCK_RADIUS, dock) + orbitNoise;

    temp.orbitPos.set(
      Math.cos(angle) * orbitRadius,
      Math.sin(angle * 1.4) * (0.4 - dock * 0.16) + 0.15,
      Math.sin(angle) * orbitRadius * 0.62 +
        THREE.MathUtils.lerp(DEPTH_START, DEPTH_END, dock),
    );

    const lookAhead = angle + 0.03;
    const nextNoise = Math.sin(lookAhead * 2.1) * 0.24 * (1 - dock * 0.64);
    const nextRadius =
      THREE.MathUtils.lerp(START_RADIUS, DOCK_RADIUS, dock) + nextNoise;

    temp.nextPos.set(
      Math.cos(lookAhead) * nextRadius,
      Math.sin(lookAhead * 1.4) * (0.4 - dock * 0.16) + 0.15,
      Math.sin(lookAhead) * nextRadius * 0.62 +
        THREE.MathUtils.lerp(DEPTH_START, DEPTH_END, dock),
    );

    temp.currentPos.copy(temp.orbitPos);
    temp.direction.copy(temp.nextPos).sub(temp.orbitPos).normalize();

    if (motion.exit > 0) {
      temp.currentPos.lerp(exitTargetRef.current, motion.exit);
      temp.direction
        .copy(exitTargetRef.current)
        .sub(temp.currentPos)
        .normalize();
    }

    if (rocketRef.current) {
      rocketRef.current.position.copy(temp.currentPos);
      rocketRef.current.lookAt(temp.currentPos.clone().add(temp.direction));
      rocketRef.current.rotateX(Math.PI / 2);

      const boostScale = 1 + motion.thruster * 0.07 + motion.exit * 0.25;
      rocketRef.current.scale.setScalar(ROCKET_SCALE * boostScale);
    }

    if (onRocketProjectedPosition) {
      temp.projected.copy(temp.currentPos).project(state.camera);
      onRocketProjectedPosition({
        x: (temp.projected.x * 0.5 + 0.5) * state.size.width,
        y: (-temp.projected.y * 0.5 + 0.5) * state.size.height,
        depth: temp.projected.z,
      });
    }
  });

  return (
    <group>
      <EnergySphere motionRef={motionRef} />

      <Rocket rocketRef={rocketRef} scale={ROCKET_SCALE} />
    </group>
  );
}

export default function PreloaderCanvas({
  isExiting = false,
  targetCoords = null,
  onRocketProjectedPosition,
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 8], fov: 41 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#06070d", 9, 28]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[4.5, 4.5, 6]} intensity={1.05} color="#f1f4ff" />
      <pointLight
        position={[-4.8, -2.8, 5.8]}
        intensity={0.75}
        color="#7b94ff"
      />
      <pointLight position={[0, 0, -4]} intensity={0.5} color="#607fff" />

      <Starfield count={950} radiusMin={11} radiusMax={24} />
      <Starfield
        count={430}
        radiusMin={7}
        radiusMax={15}
        size={0.043}
        opacity={0.95}
        color="#eef3ff"
        speed={0.02}
      />

      <RocketFlight
        isExiting={isExiting}
        targetCoords={targetCoords}
        onRocketProjectedPosition={onRocketProjectedPosition}
      />
    </Canvas>
  );
}
