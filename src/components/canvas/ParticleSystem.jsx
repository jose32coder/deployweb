"use client";
import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  getSpherePositions,
  getCubePositions,
  getCodeBracketsPositions,
} from "./Shapes";

const PARTICLE_COUNT = 7000;
const SPHERE_RADIUS = 1;

export default function ParticleSystem({
  activeShape = 0,
  morphProgress = 0, // 0 to 1 controlled by scroll
  pointerRef,
  pointerStrengthRef,
  pulseRef,
  rocketPos,
  tangent,
}) {
  const pointsRef = useRef(null);

  const shapes = useMemo(
    () => [
      getSpherePositions(PARTICLE_COUNT, SPHERE_RADIUS),
      getCodeBracketsPositions(PARTICLE_COUNT, SPHERE_RADIUS * 1.2),
      getCubePositions(PARTICLE_COUNT, SPHERE_RADIUS * 1.5),
    ],
    [],
  );

  const currentPositions = useMemo(() => new Float32Array(shapes[0]), [shapes]);
  const currentColors = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const currentSizes = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT);
    arr.fill(1.2);
    return arr;
  }, []);
  const displacements = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const velocities = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  const baseColor = useMemo(() => new THREE.Color("#b1bfe5"), []); // Soft blueish background
  const coreColor = useMemo(() => new THREE.Color("#ffffff"), []); // Bright core
  const hoverColor = useMemo(() => new THREE.Color("#ffe449"), []); // Amarillo brillante
  const spotlightColor = useMemo(() => new THREE.Color("#ffcc22"), []); // Amarillo fuego para el foco
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Texture to make particles soft and glowing ("bombillas")
  const particleTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.15, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.3)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Per-particle random offsets for organic, independent movement
  const randomOffsets = useMemo(() => {
    const offsets = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return offsets;
  }, []);

  // Track last shape to know where we are morphing FROM
  const lastShapeRef = useRef(0);
  const targetShapeRef = useRef(0);
  const smoothedStrengthRef = useRef(0);

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
    const ease =
      morphProgress < 0.5
        ? 2 * morphProgress * morphProgress
        : -1 + (4 - 2 * morphProgress) * morphProgress;

    const fromShape = shapes[lastShapeRef.current];
    const toShape = shapes[targetShapeRef.current];

    const pointer = pointerRef.current;

    // Suavizado del puntero (fade in/out gradual al tocar o dejar de tocar)
    smoothedStrengthRef.current = THREE.MathUtils.lerp(
      smoothedStrengthRef.current,
      pointerStrengthRef.current,
      0.1,
    );
    const pointerStrength = smoothedStrengthRef.current * 0.5;

    const rippleWave =
      Math.sin(pulseRef.current.value * Math.PI * 4) * pulseRef.current.value;
    const clickStrength = rippleWave * 0.6;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      // Interpolate based on SCROLL progress
      let x = fromShape[idx] + (toShape[idx] - fromShape[idx]) * ease;
      let y =
        fromShape[idx + 1] + (toShape[idx + 1] - fromShape[idx + 1]) * ease;
      let z =
        fromShape[idx + 2] + (toShape[idx + 2] - fromShape[idx + 2]) * ease;

      // Organic breathing and independent fluid movement
      // Add a slight sine wave displacement based on the particle's random offset
      const timeScale = elapsed * 0.4;
      x += Math.sin(timeScale + randomOffsets[idx]) * 0.015;
      y += Math.cos(timeScale + randomOffsets[idx + 1]) * 0.015;
      z += Math.sin(timeScale + randomOffsets[idx + 2]) * 0.015;

      // Rotación que se aplicará a la malla
      const rotY = elapsed * 0.08;
      const rotX = Math.sin(elapsed * 0.1) * 0.05;

      // Transformamos el puntero al espacio local de las partículas para que no se quede "pegado" al girar
      const meshQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(rotX, rotY, 0),
      );
      const invQuat = meshQuat.invert();
      const localPointer = pointer.clone().applyQuaternion(invQuat);

      // Mouse Influence (Cráter suave con anillo brillante y grueso)
      const dxp = x - localPointer.x;
      const dyp = y - localPointer.y;
      const dzp = z - localPointer.z;
      const dp = Math.sqrt(dxp * dxp + dyp * dyp + dzp * dzp) || 1;

      const MOUSE_RADIUS = 0.3;
      let targetDx = 0;
      let targetDy = 0;
      let targetDz = 0;

      if (dp < MOUSE_RADIUS && pointerStrength + clickStrength > 0) {
        const normalizedDist = dp / MOUSE_RADIUS;
        const pushFactor =
          Math.pow(1 - normalizedDist, 1.5) * (pointerStrength + clickStrength);
        const force = pushFactor * MOUSE_RADIUS * 1.5; // Fuerza mayor para crear el anillo limpio

        targetDx = (dxp / dp) * force;
        targetDy = (dyp / dp) * force;
        targetDz = (dzp / dp) * force;

        // Inflado leve para que salten sutilmente hacia la cámara
        const distToOrigin = Math.sqrt(x * x + y * y + z * z) || 1;
        const popOut = pushFactor * 0.15; // Reducido de 0.45 a 0.15
        targetDx += (x / distToOrigin) * popOut;
        targetDy += (y / distToOrigin) * popOut;
        targetDz += (z / distToOrigin) * popOut;
      }

      // Física de resorte (Estiramiento elástico y rebote)
      velocities[idx] += (targetDx - displacements[idx]) * 0.12; // Rigidez del resorte
      velocities[idx] *= 0.82; // Amortiguación (más alto = más rebote)
      displacements[idx] += velocities[idx];

      velocities[idx + 1] += (targetDy - displacements[idx + 1]) * 0.12;
      velocities[idx + 1] *= 0.82;
      displacements[idx + 1] += velocities[idx + 1];

      velocities[idx + 2] += (targetDz - displacements[idx + 2]) * 0.12;
      velocities[idx + 2] *= 0.82;
      displacements[idx + 2] += velocities[idx + 2];

      x += displacements[idx];
      y += displacements[idx + 1];
      z += displacements[idx + 2];

      // Coloring: Core glow + Hover glow
      tempColor.copy(baseColor);
      let pSize = 0.6; // Tamaño base

      const distToCenter = Math.sqrt(x * x + y * y + z * z);
      const coreMix = Math.max(0, 1 - distToCenter / (SPHERE_RADIUS * 0.85));
      if (coreMix > 0) {
        tempColor.lerp(coreColor, coreMix);
      }

      // Efecto "Foco" Amarillo Suave: Las partículas cerca del mouse se iluminan sin exagerar
      if (dp < MOUSE_RADIUS * 1.5 && pointerStrength > 0) {
        const spotlightMix =
          Math.max(0, 1 - dp / (MOUSE_RADIUS * 1.5)) * pointerStrength;
        tempColor.lerp(spotlightColor, spotlightMix * 0.5); // Mezcla amarilla suave
        pSize += spotlightMix * 0.6; // Crecimiento muy leve (no llega a 2)
      }

      // El color amarillo y tamaño extra también se aplica por la física de rebote
      const currentDisp = Math.sqrt(
        displacements[idx] ** 2 +
          displacements[idx + 1] ** 2 +
          displacements[idx + 2] ** 2,
      );

      if (currentDisp > 0.005) {
        const hoverMix = Math.min(1, currentDisp * 5.0);
        tempColor.lerp(coreColor, hoverMix * 0.25); // Núcleo levemente blanco
        tempColor.lerp(hoverColor, hoverMix * 0.5); // Halo amarillo suave
        pSize += hoverMix * 0.7; // Crecimiento sutil al rebotar
      }

      currentColors[idx] = tempColor.r;
      currentColors[idx + 1] = tempColor.g;
      currentColors[idx + 2] = tempColor.b;
      currentSizes[i] = pSize;

      // Rocket Influence (only if visible)
      if (
        rocketPos &&
        tangent &&
        lastShapeRef.current === 0 &&
        targetShapeRef.current === 0
      ) {
        // Transformar la posición del cohete al espacio local también!
        const localRocketPos = rocketPos.clone().applyQuaternion(invQuat);
        const localTangent = tangent.clone().applyQuaternion(invQuat);

        const dxr = x - localRocketPos.x;
        const dyr = y - localRocketPos.y;
        const dzr = z - localRocketPos.z;
        const dr = Math.sqrt(dxr * dxr + dyr * dyr + dzr * dzr) || 1;
        const rInfluence = Math.max(0, 1 - dr / 0.72) * 0.45;

        if (rInfluence > 0) {
          const swirl = 0.08 * rInfluence;
          x += (-dyr * localTangent.z + dzr * localTangent.y) * swirl;
          y += (dxr * localTangent.z - dzr * localTangent.x) * swirl;
          z += (-dxr * localTangent.y + dyr * localTangent.x) * swirl;
        }
      }

      currentPositions[idx] = x;
      currentPositions[idx + 1] = y;
      currentPositions[idx + 2] = z;
    }

    attr.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
    pointsRef.current.geometry.attributes.customSize.needsUpdate = true;

    if (pointsRef.current) {
      // Aplicamos la rotación que usamos en los cálculos
      pointsRef.current.rotation.y = elapsed * 0.08;
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.1) * 0.05;

      if (pointsRef.current.material) {
        pointsRef.current.material.opacity =
          0.8 + Math.sin(elapsed * 2.3) * 0.05;
      }
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
        <bufferAttribute
          attach="attributes-color"
          args={[currentColors, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-customSize"
          args={[currentSizes, 1]}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
        uniforms={{
          pointTexture: { value: particleTexture },
        }}
        vertexShader={`
          attribute float customSize;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            // El multiplicador bajó a 35.0 para dejarlas pequeñas como estaban antes
            gl_PointSize = customSize * (35.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          void main() {
            vec4 texColor = texture2D(pointTexture, gl_PointCoord);
            if (texColor.a < 0.01) discard;
            gl_FragColor = vec4(vColor, texColor.a * 0.85); // Brillo restaurado
          }
        `}
      />
    </points>
  );
}
