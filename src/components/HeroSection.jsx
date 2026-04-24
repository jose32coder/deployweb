"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Container from "@/components/Container";
import ParticleGlobe from "@/components/ParticleGlobe";

export const HeroSection = () => {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const titleRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Animación inicial del fondo/esfera
      tl.from(
        globeRef.current,
        {
          opacity: 0,
          filter: "blur(15px)",
          duration: 2.8,
          ease: "power2.inOut",
        },
        0.2,
      );

      // Revelado de textos
      tl.from(
        ".hero-title span",
        {
          y: 80,
          opacity: 0,
          rotateX: -30,
          stagger: 0.2,
          duration: 2,
          clearProps: "all",
        },
        0.4,
      );

      // Animación sincronizada para descripción y stats
      tl.from(
        [".hero-description-container", ".hero-stats-wrapper > div"],
        {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 1.2,
          clearProps: "all",
        },
        0.8, // Empezamos antes para que se sienta más fluido
      );

      // Animación de flotación ultra suave (Sin stutter)
      gsap.to(".hero-title", {
        y: -12,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true,
      });

      // Flotación del globo corregida
      gsap.to(globeRef.current, {
        y: 12,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true,
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#09090b]"
    >
      {/* Background Lighting Effects */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
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

      {/* Background Text (DEPLOY) */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.03]">
        <h2 className="select-none text-[30vw] font-bold uppercase leading-none tracking-tighter text-white/50">
          DEPLOY
        </h2>
      </div>

      {/* Centered Globe Container */}
      <div className="absolute bottom-68 md:bottom-0 inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div
          ref={globeRef}
          className="pointer-events-auto h-[100vmin] w-[100vmin] max-h-[850px] max-w-[850px] mix-blend-screen will-change-transform sm:h-[80vmin] sm:w-[80vmin]"
        >
          <ParticleGlobe />
        </div>
      </div>

      {/* Main Content */}
      <Container
        maxWidth="max-w-none"
        className="pointer-events-none relative z-30 flex min-h-screen w-full flex-col items-center px-6 py-12 md:px-12 lg:px-20 sm:py-16"
      >
        {/* Main Center Area */}
        <div className="flex flex-1 flex-col mt-20 sm:mt-0 items-center justify-center text-center">
          <div
            ref={titleRef}
            className="hero-title flex flex-col items-center gap-1 perspective-1000 will-change-transform"
          >
            <span className="inline-block py-2 text-[clamp(2.4rem,11.7vw,7.8rem)] md:text-[clamp(2.4rem,11vw,7.8rem)] font-light leading-[0.2] sm:leading-[0.6] tracking-tighter text-white">
              Desplegamos
            </span>
            <span className="bg-clip-text bg-linear-to-r from-blue-400 via-indigo-300 to-white font-black italic text-transparent text-[clamp(2.1rem,11.7vw,7.5rem)] leading-[1.1] tracking-tighter py-2 px-4">
              Experiencias Digitales
            </span>
          </div>
        </div>

        {/* Bottom Section (Full Width Layout) */}
        <div className="mt-auto flex w-full flex-col items-center justify-between gap-12 pb-4 md:flex-row md:items-end md:pb-10">
          {/* Left: Description & Button */}
          <div className="hero-description-container pointer-events-auto flex max-w-4xl flex-col items-center text-center md:items-start md:text-left">
            <p className="text-balance text-[12px] leading-relaxed tracking-wide text-zinc-300 sm:text-[17px] md:max-w-[650px]">
              Desde conceptualización hasta lanzamiento, optimizamos cada
              detalle para impulsar tu crecimiento.
            </p>
            <button className="hero-btn group mt-4 md:mt-8 cursor-pointer rounded-full border border-white/10 bg-indigo-500/20 px-10 py-3.5 text-[17px] font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.15)] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-indigo-500/30 hover:shadow-[0_0_35px_rgba(99,102,241,0.3)]">
              Despleguemos tu proyecto
            </button>
          </div>

          {/* Right: Stats (Horizontal Layout per Stat) */}
          <div className="hero-stats-wrapper pointer-events-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:justify-end lg:gap-20">
            <StatItem label="Projects Delivered" value="50+" />
            <StatItem label="Client Satisfaction" value="100%" />
            <StatItem label="Support Available" value="24/7" />
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
  <div className="group flex items-center gap-3">
    <div className="text-2xl font-bold tracking-tighter text-white sm:text-3xl md:text-4xl">
      {value}
    </div>
    <div className="flex flex-col text-[9px] font-bold uppercase tracking-widest leading-[1.1] text-zinc-500 transition-colors group-hover:text-zinc-300 sm:text-[10px]">
      {label.split(" ").map((word, i) => (
        <span key={i}>{word}</span>
      ))}
    </div>
  </div>
);
