"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCreative } from "swiper/modules";

// Estilos de Swiper
import "swiper/css";
import "swiper/css/pagination";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES = [
  {
    id: "development",
    title: "Development",
    number: "01",
    description:
      "Robust, scalable products across web and mobile—from elegant UIs to reliable APIs and automated DevOps.",
    services: [
      "Frontend Platforms",
      "Backend APIs",
      "Mobile Apps",
      "Cloud Ops",
    ],
  },
  {
    id: "product-design",
    title: "Product Design",
    number: "02",
    description:
      "End-to-end product design—from research and UX flows to polished UI systems and developer-ready handoff.",
    services: [
      "UX Design",
      "Interface Design",
      "Design Systems",
      "Prototyping",
    ],
  },
  {
    id: "gtm-strategy",
    title: "GTM Strategy",
    number: "03",
    description:
      "Data-driven strategies to launch and scale your product, ensuring it reaches the right audience at the right time.",
    services: [
      "Market Research",
      "Growth Hacking",
      "SEO Strategy",
      "Marketing",
    ],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // CONFIGURACIÓN DESKTOP (1024px en adelante)
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            // El end calcula el ancho real del contenedor para que no se monte la siguiente sección
            end: () =>
              `+=${pinRef.current.scrollWidth - window.innerWidth + 200}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        tl.to(pinRef.current, {
          x: () => -(pinRef.current.scrollWidth - window.innerWidth),
          ease: "none",
        });

        // Animaciones de entrada para el contenido de las cartas
        SERVICES.forEach((_, i) => {
          gsap.fromTo(
            `.card-content-${i}`,
            { opacity: 0, y: 40, filter: "blur(10px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              scrollTrigger: {
                trigger: `.card-${i}`,
                containerAnimation: tl,
                start: "left 80%",
                end: "left 50%",
                scrub: true,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className="w-full bg-[#09090b]">
      {/* VERSION MOBILE: Se muestra solo en pantallas pequeñas */}
      <section className="block lg:hidden py-20 px-6">
        <div className="mb-12">
          <h2 className="text-5xl font-bold tracking-tighter text-white">
            Our Services
          </h2>
          <p className="mt-4 text-zinc-400">
            Swipe to explore our capabilities.
          </p>
        </div>

        <Swiper
          modules={[Pagination, EffectCreative]}
          spaceBetween={20}
          slidesPerView={1.1}
          centeredSlides={true}
          pagination={{ clickable: true }}
          className="pb-12"
        >
          {SERVICES.map((service) => (
            <SwiperSlide key={service.id}>
              <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl min-h-[400px] flex flex-col">
                <span className="text-2xl font-bold text-white/20">
                  {service.number}
                </span>
                <h3 className="mt-4 text-3xl font-black italic text-white">
                  {service.title}
                </h3>
                <p className="mt-4 text-zinc-400 text-sm">
                  {service.description}
                </p>
                <div className="mt-auto pt-6 space-y-2">
                  {service.services.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-zinc-500"
                    >
                      <div className="h-1 w-1 rounded-full bg-indigo-500" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* VERSION DESKTOP: Se muestra solo en LG (1024px+) */}
      <section className="hidden lg:flex h-screen items-center overflow-hidden">
        <div
          ref={pinRef}
          className="flex h-full w-fit items-center px-[10vw] will-change-transform"
        >
          {/* Texto Intro */}
          <div className="w-[40vw] shrink-0 pr-20">
            <h2 className="text-8xl font-bold tracking-tighter text-white">
              Our
              <br />
              Services
            </h2>
            <p className="mt-8 text-xl text-zinc-400 max-w-xs">
              Digital solutions that transform businesses and drive innovation.
            </p>
          </div>

          {/* Tarjetas Horizontales */}
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              className={`card-${i} flex h-[70vh] w-[50vw] shrink-0 items-center justify-center px-10`}
            >
              <div className="relative h-full w-full rounded-[3rem] border border-white/10 bg-white/5 p-12 backdrop-blur-2xl flex flex-col justify-center">
                <span className="absolute top-10 left-12 text-6xl font-bold text-white/5">
                  {service.number}
                </span>
                <div className={`card-content-${i}`}>
                  <h3 className="text-7xl font-black italic tracking-tighter text-white">
                    {service.title}
                  </h3>
                  <p className="mt-6 text-xl text-zinc-300 max-w-md">
                    {service.description}
                  </p>
                  <div className="mt-10 grid grid-cols-2 gap-4">
                    {service.services.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-zinc-400"
                      >
                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
