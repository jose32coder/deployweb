"use client";
import React from "react";
import * as THREE from "three";

export default function Rocket({ rocketRef, scale }) {
  return (
    <group ref={rocketRef} scale={scale}>
      {/* Main Body - Balanced thickness */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.16, 20]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Bullet-shaped Rounded Nose */}
      <mesh position={[0, 0.08, 0]} scale={[1, 1.4, 1]}>
        <sphereGeometry args={[0.052, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Engine Bell */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.035, 0.052, 0.04, 12]} />
        <meshStandardMaterial
          color="#222222"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Porthole */}
      <mesh position={[0, 0.04, 0.048]} rotation={[Math.PI * 0.5, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.01, 16]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#3366ff"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Fins - 3 Aerodynamic wings */}
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          <mesh position={[0.06, -0.05, 0]} rotation={[0, 0, -Math.PI * 0.08]}>
            <boxGeometry args={[0.055, 0.075, 0.007]} />
            <meshStandardMaterial
              color="#ff3b3b" 
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* Engine Glow */}
      <mesh position={[0, -0.14, 0]}>
        <coneGeometry args={[0.03, 0.08, 12]} />
        <meshBasicMaterial 
          color="#7799ff" 
          transparent 
          opacity={0.6} 
        />
      </mesh>
    </group>
  );
}
