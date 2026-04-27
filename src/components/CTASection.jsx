"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

export default function CTASection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  // Parallax glow follow mouse
  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || !glowRef.current) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glowRef.current.style.background = `radial-gradient(ellipse 60% 50% at ${x}% ${y}%, rgba(139,92,246,0.45) 0%, rgba(99,102,241,0.2) 40%, transparent 70%)`;
  };

  const handleMouseLeave = () => {
    if (!glowRef.current) return;
    glowRef.current.style.background =
      "radial-gradient(ellipse 80% 60% at 60% 60%, rgba(109,40,217,0.35) 0%, rgba(79,70,229,0.15) 40%, transparent 75%)";
  };

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative w-full overflow-hidden bg-[#09090b] px-6 pb-24 pt-8 md:px-12 md:pb-32"
    >
      <div
        ref={cardRef}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0d0d10]"
        style={{
          boxShadow:
            "0 0 80px 0 rgba(109,40,217,0.15), inset 0 0 60px 0 rgba(79,70,229,0.05)",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dynamic glow */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 z-0 transition-[background] duration-300"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 60%, rgba(109,40,217,0.35) 0%, rgba(79,70,229,0.15) 40%, transparent 75%)",
          }}
        />

        {/* Subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 60px)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-8 px-8 py-14 md:flex-row md:items-center md:justify-between md:px-16 md:py-20">
          {/* Left: text */}
          <div className="flex flex-col gap-4 md:max-w-xl">
            <span className="w-fit rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
              ¿Listo para comenzar?
            </span>
            <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-black leading-[1.05] tracking-tighter text-white">
              Convertimos ideas audaces
              <br className="hidden sm:block" />
              en realidades digitales
              <span className="text-transparent"
                style={{
                  WebkitTextStroke: "1px rgba(139,92,246,0.8)",
                }}
              > poderosas.</span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
              Nuestro equipo está listo para llevar tu próximo proyecto al
              siguiente nivel. Desde diseño hasta despliegue, te acompañamos en
              cada etapa.
            </p>
          </div>

          {/* Right: CTA button */}
          <div className="flex shrink-0 items-center">
            <Link
              href="#contact"
              className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-violet-500/40 bg-violet-600/20 px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.2)] backdrop-blur-xl transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-600/30 hover:shadow-[0_0_50px_rgba(139,92,246,0.4)]"
            >
              {/* Shimmer */}
              <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
              <span>Trabajemos juntos</span>
              <svg
                className="transition-transform duration-300 group-hover:translate-x-1"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
