"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PreloaderCanvas from "./PreloaderCanvas";

const PRELOADER_DURATION_SECONDS = 4.6;
const DEFAULT_TARGET_SCALE = 0.22;
const SCROLL_BLOCK_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

function resolveNavLogoTarget(anchorEl) {
  const defaultX = -window.innerWidth * 0.39;
  const defaultY = -window.innerHeight * 0.44;

  const navLogo = document.querySelector("[data-nav-logo]");
  if (!navLogo || !anchorEl) {
    return { x: defaultX, y: defaultY, scale: DEFAULT_TARGET_SCALE };
  }

  const navRect = navLogo.getBoundingClientRect();
  const anchorRect = anchorEl.getBoundingClientRect();

  const x = navRect.left + navRect.width / 2 - window.innerWidth / 2;
  const y = navRect.top + navRect.height / 2 - window.innerHeight / 2;
  const scaleRatio = navRect.width / Math.max(anchorRect.width, 1);
  const scale = Math.max(0.14, Math.min(0.42, scaleRatio));

  return { x, y, scale };
}

export default function Preloader({ onLoadingComplete }) {
  const preloaderRef = useRef(null);
  const nebulaRef = useRef(null);
  const starsFarRef = useRef(null);
  const starsNearRef = useRef(null);
  const textAnchorRef = useRef(null);
  const textFollowRef = useRef(null);
  const subtitleRef = useRef(null);
  const hudRef = useRef(null);
  const progressWrapRef = useRef(null);
  const progressBarRef = useRef(null);

  const isExitingRef = useRef(false);
  const completedRef = useRef(false);
  const rocketScreenRef = useRef({
    x: 0,
    y: 0,
    depth: 0,
  });

  const [isExiting, setIsExiting] = useState(false);
  const [targetCoords, setTargetCoords] = useState(null);

  const handleRocketProjectedPosition = useCallback((coords) => {
    rocketScreenRef.current = coords;
  }, []);

  const beginExit = useCallback(() => {
    if (isExitingRef.current || completedRef.current) return;
    if (!preloaderRef.current || !textAnchorRef.current) return;

    isExitingRef.current = true;
    setIsExiting(true);

    const target = resolveNavLogoTarget(textAnchorRef.current);
    setTargetCoords(target);

    const exitTimeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        if (completedRef.current) return;
        completedRef.current = true;
        onLoadingComplete?.();
      },
    });

    exitTimeline.to(
      [subtitleRef.current, hudRef.current, progressWrapRef.current],
      {
        opacity: 0,
        y: -18,
        duration: 0.42,
        stagger: 0.06,
      },
      0,
    );

    exitTimeline.to(
      textFollowRef.current,
      {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.26,
        ease: "power1.out",
      },
      0.05,
    );

    exitTimeline.to(
      textAnchorRef.current,
      {
        x: target.x,
        y: target.y,
        scale: target.scale,
        letterSpacing: "0.14em",
        duration: 1.35,
        ease: "power3.inOut",
      },
      0.08,
    );

    exitTimeline.to(
      textAnchorRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
      },
      1.04,
    );

    exitTimeline.to(
      preloaderRef.current,
      {
        opacity: 0,
        duration: 0.62,
        ease: "power2.out",
      },
      1.23,
    );
  }, [onLoadingComplete]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";

    const blockScroll = (event) => {
      event.preventDefault();
    };

    const blockKeys = (event) => {
      if (!SCROLL_BLOCK_KEYS.has(event.key)) return;
      event.preventDefault();
    };

    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", blockKeys);

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.touchAction = previousBodyTouchAction;

      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", blockKeys);
    };
  }, []);

  useGSAP(() => {
    if (!starsFarRef.current || !starsNearRef.current || !nebulaRef.current) {
      return;
    }

    gsap.to(starsFarRef.current, {
      backgroundPosition: "0px 780px",
      duration: 42,
      repeat: -1,
      ease: "none",
    });

    gsap.to(starsNearRef.current, {
      backgroundPosition: "0px 540px",
      duration: 30,
      repeat: -1,
      ease: "none",
    });

    gsap.to(nebulaRef.current, {
      opacity: 0.84,
      duration: 4.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, []);

  useGSAP(() => {
    if (!textFollowRef.current || !textAnchorRef.current) return;

    // El texto DEPLOY permanece centrado y no sigue al cohete
    gsap.set(textFollowRef.current, {
      x: 0,
      y: 0,
      scale: 1,
    });
  }, []);

  useGSAP(
    () => {
      if (
        !textAnchorRef.current ||
        !subtitleRef.current ||
        !hudRef.current ||
        !progressWrapRef.current ||
        !progressBarRef.current
      ) {
        return;
      }

      gsap.set(textAnchorRef.current, {
        opacity: 0,
        y: 28,
        scale: 0.78,
        letterSpacing: "0.3em",
      });
      gsap.set([subtitleRef.current, hudRef.current, progressWrapRef.current], {
        opacity: 0,
        y: 24,
      });
      gsap.set(progressBarRef.current, {
        scaleX: 0.06,
        transformOrigin: "0% 50%",
      });

      const introTl = gsap.timeline({ defaults: { ease: "expo.out" } });
      introTl.to(textAnchorRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        letterSpacing: "0.24em",
        duration: 1.35,
      });

      introTl.to(
        [subtitleRef.current, hudRef.current, progressWrapRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
        },
        0.45,
      );

      introTl.to(
        progressBarRef.current,
        {
          scaleX: 1,
          duration: PRELOADER_DURATION_SECONDS,
          ease: "power1.inOut",
        },
        0.38,
      );

      const driftTween = gsap.to(textAnchorRef.current, {
        y: -9,
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const subtitleFloatTween = gsap.to(subtitleRef.current, {
        y: -4,
        duration: 3.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const exitDelay = gsap.delayedCall(PRELOADER_DURATION_SECONDS, beginExit);
      return () => {
        introTl.kill();
        driftTween.kill();
        subtitleFloatTween.kill();
        exitDelay.kill();
      };
    },
    { scope: preloaderRef, dependencies: [beginExit] },
  );

  return (
    <div
      id="preloader"
      ref={preloaderRef}
      className="fixed inset-0 z-[999] overflow-hidden bg-[#000000]"
      aria-hidden
    >
      <div
        ref={nebulaRef}
        className="pointer-events-none absolute inset-0 opacity-68"
        style={{
          background:
            "radial-gradient(circle at 54% 48%, rgba(116,142,255,0.26) 0%, rgba(59,78,160,0.2) 20%, rgba(16,18,28,0.55) 44%, rgba(3,4,10,0.95) 76%)",
          filter: "blur(10px)",
        }}
      />

      <div
        ref={starsFarRef}
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5) 0 1px, transparent 1px), radial-gradient(circle at 70% 80%, rgba(172,194,255,0.45) 0 1px, transparent 1px), radial-gradient(circle at 40% 70%, rgba(255,255,255,0.35) 0 1px, transparent 1px)",
          backgroundSize: "250px 250px, 330px 330px, 280px 280px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />

      <div
        ref={starsNearRef}
        className="pointer-events-none absolute inset-0 opacity-55 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.85) 0 1.5px, transparent 1.8px), radial-gradient(circle at 60% 60%, rgba(188,208,255,0.65) 0 1.2px, transparent 1.5px), radial-gradient(circle at 85% 40%, rgba(255,255,255,0.72) 0 1px, transparent 1.4px)",
          backgroundSize: "180px 180px, 230px 230px, 260px 260px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />

      <div className="absolute inset-0">
        <PreloaderCanvas
          isExiting={isExiting}
          targetCoords={targetCoords}
          onRocketProjectedPosition={handleRocketProjectedPosition}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <div
          ref={textAnchorRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold uppercase text-white"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            textShadow:
              "0 0 20px rgba(207,217,255,0.75), 0 0 40px rgba(142,167,255,0.58), 0 0 60px rgba(90,127,255,0.42)",
            letterSpacing: "0.24em",
            fontSize: "clamp(2.8rem, 6vw, 4.2rem)",
            willChange: "transform, opacity, letter-spacing",
          }}
        >
          <span
            ref={textFollowRef}
            className="inline-block"
            style={{ willChange: "transform" }}
          >
            DEPLOY
          </span>
        </div>

        <p
          ref={subtitleRef}
          className="absolute left-1/2 top-[calc(50%+76px)] -translate-x-1/2 text-center text-[9px] font-medium tracking-[0.32em] text-white/72 uppercase sm:text-[10px]"
        >
          Alineando trayectoria orbital
        </p>

        <div
          ref={progressWrapRef}
          className="absolute left-1/2 top-[calc(50%+108px)] -translate-x-1/2"
        >
          <div className="h-1 w-[min(340px,62vw)] overflow-hidden rounded-full bg-white/10">
            <div
              ref={progressBarRef}
              className="h-full w-full origin-left bg-linear-to-r from-[#cfd9ff] via-[#8ea7ff] to-[#5f7fff] shadow-lg shadow-blue-500/40"
            />
          </div>
        </div>

        <div
          ref={hudRef}
          className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[8px] font-semibold tracking-[0.2em] text-white/75 uppercase backdrop-blur-xl sm:right-6 sm:top-5 sm:text-[9px] sm:px-4 sm:py-2"
        >
          Secuencia // Deploy
        </div>
      </div>
    </div>
  );
}
