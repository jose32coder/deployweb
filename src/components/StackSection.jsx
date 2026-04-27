"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Tech logos via react-icons
import { SiTailwindcss } from "react-icons/si";
import { SiNextdotjs } from "react-icons/si";
import { SiReact } from "react-icons/si";
import { SiTypescript } from "react-icons/si";
import { SiNodedotjs } from "react-icons/si";
import { SiCloudflare } from "react-icons/si";
import { SiNetlify } from "react-icons/si";
import { SiVercel } from "react-icons/si";
import { SiCloudinary } from "react-icons/si";
import { SiSupabase } from "react-icons/si";
import { SiGodaddy } from "react-icons/si";
import { SiFlutter } from "react-icons/si";

const TECHNOLOGIES = [
  { icon: SiNextdotjs, name: "Next.js", color: "#ffffff" },
  { icon: SiReact, name: "React", color: "#61DAFB" },
  { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
  { icon: SiTailwindcss, name: "Tailwind", color: "#38BDF8" },
  { icon: SiNodedotjs, name: "Node.js", color: "#68A063" },
  { icon: SiFlutter, name: "Flutter", color: "#02569B" },
  { icon: SiCloudflare, name: "Cloudflare", color: "#F38020" },
  { icon: SiNetlify, name: "Netlify", color: "#00C7B7" },
  { icon: SiVercel, name: "Vercel", color: "#ffffff" },
  { icon: SiCloudinary, name: "Cloudinary", color: "#3448C5" },
  { icon: SiSupabase, name: "Supabase", color: "#3ECF8E" },
  { icon: SiGodaddy, name: "GoDaddy", color: "#1BDBDB" },
];

/* ─── Curved Arc Marquee ─────────────────────────────────────────
   Each item is placed along a semicircular arc using sin/cos math.
   The entire arc scrolls continuously via GSAP, giving the illusion
   of logos traveling along a curved horizon line.
   ────────────────────────────────────────────────────────────── */

const ARC_ITEMS_COUNT = 24;
const ARC_RADIUS = 3000; // Middle ground radius
const ARC_SPAN_DEG = 75; // Balanced span

function buildArcItems(items, totalSlots) {
  const result = [];
  for (let i = 0; i < totalSlots; i++) {
    result.push(items[i % items.length]);
  }
  return result;
}

function ArcCarousel() {
  const trackRef = useRef(null);
  const animRef = useRef(null);

  const items = buildArcItems(TECHNOLOGIES, ARC_ITEMS_COUNT);

  useEffect(() => {
    let offset = 0;
    const speed = 0.03; // Reduced speed for smoother motion

    function render() {
      if (!trackRef.current) return;
      const children = trackRef.current.children;

      for (let i = 0; i < children.length; i++) {
        const slotAngle =
          ((i / ARC_ITEMS_COUNT) * ARC_SPAN_DEG - ARC_SPAN_DEG / 2 + offset) %
          ARC_SPAN_DEG;

        let angle = slotAngle;
        if (angle > ARC_SPAN_DEG / 2) angle -= ARC_SPAN_DEG;
        if (angle < -ARC_SPAN_DEG / 2) angle += ARC_SPAN_DEG;

        const rad = (angle * Math.PI) / 180;

        const x = Math.sin(rad) * ARC_RADIUS;
        const y = -Math.cos(rad) * ARC_RADIUS + ARC_RADIUS;

        const normalizedPos = Math.abs(angle) / (ARC_SPAN_DEG / 2);
        const scale = 1 - normalizedPos * 0.2;
        const opacity = 1 - normalizedPos * 0.8;

        const el = children[i];
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = opacity;
        el.style.zIndex = Math.round((1 - normalizedPos) * 100);
      }

      offset -= speed;
      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "320px" }}
    >


      {/* Arc track — all items positioned absolutely from the center-bottom */}
      <div
        ref={trackRef}
        className="absolute bottom-28 left-1/2"
        style={{ width: 0, height: 0 }}
      >
        {items.map((tech, i) => {
          const Icon = tech.icon;
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center gap-2 will-change-transform"
              style={{ left: 0, top: 0 }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm md:h-[4.5rem] md:w-[4.5rem]"
                style={{
                  boxShadow: `0 0 12px 2px ${tech.color}22`,
                }}
              >
                <Icon
                  size={28}
                  color={tech.color}
                  className="md:!w-[34px] md:!h-[34px]"
                />
              </div>
              <span className="whitespace-nowrap text-[10px] font-medium tracking-wide text-zinc-500 md:text-xs">
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Section wrapper ────────────────────────────────────────── */

export default function TechStackSection() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".ts-heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".ts-sub", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="tecnologias"
      className="relative w-full overflow-hidden bg-[#09090b] py-20 md:py-28"
    >
      {/* Ambient glow behind carousel */}
      <div
        className="pointer-events-none absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "70%",
          height: "300px",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(99,102,241,0.15) 0%, transparent 80%)",
          filter: "blur(20px)",
        }}
      />

      {/* Heading */}
      <div className="relative z-10 mb-16 flex flex-col items-center gap-3 px-6 text-center">
        <span className="ts-sub inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Stack Tecnológico
        </span>
        <h2 className="ts-heading text-[clamp(1.6rem,4vw,2.8rem)] font-black leading-tight tracking-tighter text-white">
          Tecnologías que impulsan
          <br />
          nuestros proyectos
        </h2>
        <p className="ts-sub max-w-md text-sm text-zinc-500">
          Trabajamos con las herramientas más modernas y confiables de la
          industria para garantizar resultados de alto rendimiento.
        </p>
      </div>

      {/* Curved Arc Carousel */}
      <div className="relative z-10">
        <ArcCarousel />
      </div>
    </section>
  );
}
