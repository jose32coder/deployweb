"use client";

import { useRef, useEffect } from "react";

export default function DeployText({ textRef, onAnimationComplete }) {
  const DEPLOY_TEXT = "Deploy";

  useEffect(() => {
    // Animar la escritura del texto
    let charIndex = 0;
    const interval = setInterval(() => {
      if (textRef.current && charIndex <= DEPLOY_TEXT.length) {
        textRef.current.textContent = DEPLOY_TEXT.substring(0, charIndex);
        charIndex++;
      }
      if (charIndex > DEPLOY_TEXT.length) {
        clearInterval(interval);
        if (onAnimationComplete) onAnimationComplete();
      }
    }, 120); // 120ms por letra

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={textRef}
      className="absolute text-6xl md:text-7xl font-bold text-white tracking-widest select-none z-10"
      style={{
        fontFamily: 'Space Mono, monospace',
        letterSpacing: '0.15em',
        textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
      }}
    ></div>
  );
}
