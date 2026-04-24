"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * HeroTitle Component
 * Animates text with word splitting, opacity, blur, and y-offset stagger
 */
export const HeroTitle = ({ children, className = "" }) => {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Split text into words on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get the text content and split into words
    const text = container.textContent;
    const words = text.split(" ");

    // Clear container
    container.innerHTML = "";

    // Create spans for each word
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.className = "hero-word";
      span.style.display = "inline-block";
      span.style.marginRight = "0.3em";

      container.appendChild(span);
    });

    setIsReady(true);
  }, [children]);

  // Animate once words are rendered
  useGSAP(
    () => {
      if (!isReady) return;

      const words = containerRef.current?.querySelectorAll(".hero-word");
      if (!words || words.length === 0) return;

      // Animate each word: opacity, blur, and y-offset with stagger
      gsap.from(words, {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        stagger: {
          amount: 0.6, // Total time for all stagger
          from: "start",
        },
      });
    },
    {
      scope: containerRef,
      dependencies: [isReady],
    },
  );

  return (
    <h1
      ref={containerRef}
      className={`font-bold tracking-wider leading-tight ${className}`}
    >
      {children}
    </h1>
  );
};

export default HeroTitle;
