"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import Rocket from "./canvas/Rocket";

const ORBIT_RADIUS = 2;
const ROCKET_SCALE = 0.4;

function RocketOrbit({ rocketRef, isLoading }) {
  const orbitPathRef = useRef(null);
  const progressRef = useRef({ t: 0 });

  // Generar trayectoria de órbita circular
  const orbitPath = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * ORBIT_RADIUS,
          0.5,
          Math.sin(a) * ORBIT_RADIUS
        )
      );
    }
    return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);
  }, []);

  useGSAP(() => {
    if (isLoading) {
      // Órbita infinita mientras carga
      gsap.to(progressRef.current, {
        t: 1,
        duration: 8,
        repeat: -1,
        ease: "none",
      });
    } else {
      // Salida rápida hacia arriba
      gsap.to(progressRef.current, {
        t: 2, // Más allá de 1 para que siga hacia arriba
        duration: 1.5,
        ease: "power4.in",
      });
    }
  }, [isLoading]);

  useFrame(() => {
    if (rocketRef.current) {
      let t = progressRef.current.t % 1;

      // Cuando t > 1, extrapolamos hacia arriba
      if (progressRef.current.t > 1) {
        t = 1;
        const extraHeight = (progressRef.current.t - 1) * 8;
        const pos = orbitPath.getPointAt(t);
        rocketRef.current.position.set(pos.x, pos.y + extraHeight, pos.z);
      } else {
        const pos = orbitPath.getPointAt(t);
        const next = orbitPath.getPointAt((t + 0.01) % 1);
        
        rocketRef.current.position.copy(pos);
        rocketRef.current.lookAt(next);
        rocketRef.current.rotateX(Math.PI / 2);
      }
    }
  });

  return <Rocket rocketRef={rocketRef} scale={ROCKET_SCALE} />;
}

export default function PreloaderCanvas({ rocketRef, isLoading }) {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ position: "absolute", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, 5]} intensity={0.4} />

      <RocketOrbit rocketRef={rocketRef} isLoading={isLoading} />
    </Canvas>
  );
}
