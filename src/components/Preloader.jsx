"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import DeployText from "./DeployText";
import PreloaderCanvas from "./PreloaderCanvas";

export default function Preloader({ onLoadingComplete }) {
  const preloaderRef = useRef(null);
  const gateLeftRef = useRef(null);
  const gateRightRef = useRef(null);
  const rocketRef = useRef(null);
  const textRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const loadingManager = new THREE.LoadingManager();
  loadingManager.onLoad = () => setAssetsLoaded(true);

  useEffect(() => {
    // Simular loading de assets
    loadingManager.itemStart('rocket-assets');
    setTimeout(() => {
      loadingManager.itemEnd('rocket-assets');
    }, 3000); // Simular 3 segundos de loading
  }, []);

  const finishLoading = () => {
    if (!isLoading || !assetsLoaded) return;

    setIsLoading(false);

    // Animar el texto hacia arriba y fade out
    gsap.to(textRef.current, {
      y: -200,
      opacity: 0,
      duration: 1.5,
      ease: "power4.in",
    });

    // Abrir las gates
    gsap.to(gateLeftRef.current, {
      x: "-100%",
      duration: 1.5,
      ease: "power4.in",
    });

    gsap.to(gateRightRef.current, {
      x: "100%",
      duration: 1.5,
      ease: "power4.in",
    });

    // Fade out del canvas con el cohete
    gsap.to(canvasRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power4.in",
      delay: 0.3,
      onComplete: () => {
        // Ocultar el preloader completamente
        gsap.set(preloaderRef.current, { display: "none" });
        if (onLoadingComplete) onLoadingComplete();
      },
    });
  };

  // Llamar finishLoading cuando assets estén listos
  useGSAP(() => {
    if (assetsLoaded) {
      gsap.delayedCall(0.5, finishLoading);
    }
  }, [assetsLoaded]);

  return (
    <div
      id="preloader"
      ref={preloaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Gates */}
      <div
        ref={gateLeftRef}
        className="gate-left absolute left-0 top-0 h-full w-1/2 bg-black z-20"
      />
      <div
        ref={gateRightRef}
        className="gate-right absolute right-0 top-0 h-full w-1/2 bg-black z-20"
      />

      {/* Canvas para el cohete */}
      <div
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
        }}
      >
        <PreloaderCanvas rocketRef={rocketRef} isLoading={isLoading} />
      </div>

      {/* Texto "Deploy" */}
      <DeployText textRef={textRef} onAnimationComplete={() => {}} />
    </div>
  );
}