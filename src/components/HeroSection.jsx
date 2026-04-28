"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Container from "@/components/Container";
import ParticleGlobe from "@/components/ParticleGlobe";

export const HeroSection = () => {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const bgTextRef = useRef(null);

  useGSAP(
    () => {
      // ─── Estado inicial: todo invisible (excepto DEPLOY que empieza visible y sobresaliente) ──
      gsap.set(bgTextRef.current, {
        scale: 0.35, // Aumentado para mejor legibilidad (especialmente en móvil)
        opacity: 1,
        z: 0,
        filter: "blur(0px)",
      });

      gsap.set(globeRef.current, {
        opacity: 0,
        filter: "blur(20px)",
      });

      gsap.set(".hero-title span", {
        y: 90,
        opacity: 0,
        rotateX: -35,
      });

      gsap.set([".hero-description-container", ".hero-stats-wrapper > div"], {
        y: 24,
        opacity: 0,
      });

      gsap.set(".hero-bg-lights", { opacity: 0 });

      // Navbar: ocultar desde el principio con querySelector (fuera del scope)
      const navEl = document.querySelector("[data-navbar]");
      const navLinks = document.querySelectorAll(".nav-link");
      const navCta = document.querySelector(".nav-cta");
      const navLogo = document.querySelector(".nav-logo-text");

      if (navEl) gsap.set(navEl, { opacity: 0, y: -34 });
      if (navLinks.length) gsap.set(navLinks, { opacity: 0, y: -16 });
      if (navCta) gsap.set(navCta, { opacity: 0, y: -14 });
      if (navLogo) gsap.set(navLogo, { opacity: 0 });

      // ─── Master Timeline ──────────────────────────────────────────────────
      const master = gsap.timeline({ defaults: { ease: "expo.out" } });

      // 1. Efecto "Typing" (escribir DEPLOY)
      master.to(
        ".deploy-char",
        {
          opacity: 1,
          duration: 0.15, // Un poco más lento cada letra
          stagger: 0.15,  // Más espacio entre letras
          ease: "none",
        },
        0.4, // Un pequeño respiro inicial
      );

      // 2. DEPLOY se engrandece y se retira al fondo
      master.to(
        bgTextRef.current,
        {
          opacity: 0.03,
          scale: 1,
          filter: "blur(2px)",
          duration: 1.6, // Escalado más suave y cinemático
          ease: "expo.inOut",
        },
        "+=0.4", // Pausa tras terminar de escribir
      );

      // 3. Luces de fondo aparecen
      master.to(
        ".hero-bg-lights",
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        2.5,
      );

      // 4. Navbar entra
      if (navEl)
        master.to(
          navEl,
          { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
          2.8,
        );

      if (navLinks.length)
        master.to(
          navLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          },
          3.1,
        );

      const navTargets = [navCta, navLogo].filter(Boolean);
      if (navTargets.length)
        master.to(
          navTargets,
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          3.2,
        );

      // 5. Globo entra
      master.to(
        globeRef.current,
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.8,
          ease: "power2.inOut",
        },
        2.8,
      );

      // 6. Títulos hero entran en cascada
      master.to(
        ".hero-title span",
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: "expo.out",
        },
        3.1,
      );

      // 7. Descripción y stats
      master.to(
        [".hero-description-container", ".hero-stats-wrapper > div"],
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power2.out",
        },
        3.6,
      );

      // ─── Loops ambientales (una vez visible todo) ─────────────────────────
      master.call(
        () => {
          gsap.to(".hero-title", {
            y: -12,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            force3D: true,
          });

          gsap.to(globeRef.current, {
            y: 12,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            force3D: true,
          });
        },
        null,
        3.8,
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="hero-shell relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#09090b]"
      style={{ perspective: "900px" }}
    >
      {/* Background Lighting Effects */}
      <div className="hero-bg-lights pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div
          className="absolute left-[-15%] top-[-15%] h-[180vh] w-[40vw] rotate-[-31deg] origin-top-left opacity-30"
          style={{
            background:
              "linear-gradient(180deg, rgba(156, 173, 255, 0.4) 0%, transparent 60%)",
            filter: "blur(100px)",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute left-[-5%] top-[-10%] h-[160vh] w-[8vw] rotate-[-31deg] origin-top-left"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, rgba(156, 173, 255, 0.6) 20%, rgba(88, 106, 236, 0.1) 50%, transparent 90%)",
            filter: "blur(25px)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Background Text (DEPLOY) — animado con GSAP */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <h2
          ref={bgTextRef}
          className="hero-bg-deploy flex items-center justify-center whitespace-nowrap select-none text-[30vw] font-bold uppercase leading-none tracking-tighter text-white/50"
          style={{
            willChange: "transform, opacity, filter",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative flex items-center">
            {"DEPLOY".split("").map((char, i) => (
              <span key={i} className="deploy-char inline-block opacity-0">
                {char}
              </span>
            ))}
          </div>
        </h2>
      </div>

      {/* Centered Globe Container */}
      <div className="absolute inset-0 bottom-[25%] z-10 flex items-center justify-center pointer-events-none md:bottom-0">
        <div
          ref={globeRef}
          className="hero-globe-shell pointer-events-auto h-[100vmin] w-[100vmin] max-h-[850px] max-w-[850px] mix-blend-screen will-change-transform sm:h-[80vmin] sm:w-[80vmin]"
        >
          <ParticleGlobe />
        </div>
      </div>

      {/* Main Content */}
      <Container
        maxWidth="max-w-none"
        className="hero-content pointer-events-none relative z-30 flex min-h-screen w-full flex-col items-center px-6 py-12 sm:py-16 md:px-12 lg:px-20"
      >
        {/* Main Center Area */}
        <div className="hero-main mt-20 flex flex-1 flex-col items-center justify-center text-center sm:mt-0">
          <div className="hero-title hero-title-block flex flex-col items-center gap-1 perspective-1000 will-change-transform">
            <span className="hero-title-line-one inline-block py-2 text-[clamp(2rem,8vw,7.5rem)] sm:text-[clamp(2.1rem,11.7vw,7.5rem)] font-light leading-[0.2] tracking-tighter text-white sm:leading-[0.6] md:text-[clamp(2.4rem,11vw,7.8rem)]">
              Desplegamos
            </span>
            <span className="hero-title-line-two bg-clip-text bg-linear-to-r from-blue-400 via-indigo-300 to-white px-4 py-2 text-[clamp(2rem,8vw,7.5rem)] sm:text-[clamp(2.1rem,11.7vw,7.5rem)] font-black italic leading-6 sm:leading-[1.1] tracking-tighter text-transparent">
              Experiencias Digitales
            </span>
          </div>
        </div>

        {/* Bottom Section (Full Width Layout) */}
        <div className="hero-bottom mt-auto flex w-full flex-col items-center justify-between gap-12 pb-4 md:flex-row md:items-end md:pb-10">
          {/* Left: Description & Button */}
          <div className="hero-description-container pointer-events-auto flex max-w-4xl flex-col items-center text-center md:items-start md:text-left">
            <p className="text-balance text-[12px] leading-relaxed tracking-wide text-zinc-300 sm:text-[17px] md:max-w-162.5">
              Desde conceptualización hasta lanzamiento, optimizamos cada
              detalle para impulsar tu crecimiento.
            </p>
            <button className="hero-btn group mt-4 cursor-pointer rounded-full border border-white/10 bg-indigo-500/20 px-10 py-3.5 text-[17px] font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.15)] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-indigo-500/30 hover:shadow-[0_0_35px_rgba(99,102,241,0.3)] md:mt-8">
              Despleguemos tu proyecto
            </button>
          </div>

          {/* Right: Stats (Horizontal Layout per Stat) */}
          <div className="hero-stats-wrapper pointer-events-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:justify-end lg:gap-20">
            <StatItem label="Proyectos Entregados" value="50+" />
            <StatItem label="Satisfacción del Cliente" value="100%" />
            <StatItem label="Soporte Disponible" value="24/7" />
          </div>
        </div>
      </Container>

      {/* Additional Ambient Gradients */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(98,113,255,0.06)_0%,rgba(9,9,11,0)_70%)]" />
    </section>
  );
};

export default HeroSection;

const StatItem = ({ label, value }) => (
  <div className="hero-stat group flex items-center gap-3">
    <div className="hero-stat-value text-2xl font-bold tracking-tighter text-white sm:text-3xl md:text-4xl">
      {value}
    </div>
    <div className="hero-stat-label flex flex-col text-[9px] font-bold leading-[1.1] tracking-widest text-zinc-500 uppercase transition-colors group-hover:text-zinc-300 sm:text-[10px]">
      {label.split(" ").map((word, i) => (
        <span key={i}>{word}</span>
      ))}
    </div>
  </div>
);
