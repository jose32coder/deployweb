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
    title: "Desarrollo",
    number: "01",
    description:
      "Productos robustos y escalables para web y móvil—desde interfaces elegantes hasta APIs confiables y DevOps automatizado.",
    services: [
      "Plataformas Frontend",
      "APIs Backend",
      "Apps Móviles",
      "Operaciones Cloud",
    ],
  },
  {
    id: "product-design",
    title: "Diseño de Producto",
    number: "02",
    description:
      "Diseño de producto de principio a fin—desde investigación y flujos UX hasta sistemas de UI pulidos y entrega lista para desarrolladores.",
    services: [
      "Diseño UX",
      "Diseño de Interfaz",
      "Sistemas de Diseño",
      "Prototipado",
    ],
  },
  {
    id: "gtm-strategy",
    title: "Estrategia GTM",
    number: "03",
    description:
      "Estrategias basadas en datos para lanzar y escalar tu producto, asegurando que llegue a la audiencia correcta en el momento adecuado.",
    services: [
      "Investigación de Mercado",
      "Growth Hacking",
      "Estrategia SEO",
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
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-zinc-400">
            Desliza para explorar nuestras capacidades.
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
      <section className="services-desktop hidden h-screen items-center overflow-hidden pt-24 pb-8 lg:flex">
        <div
          ref={pinRef}
          className="services-track flex h-full w-fit items-center px-[10vw] will-change-transform"
        >
          {/* Texto Intro */}
          <div className="services-intro w-[40vw] shrink-0 pr-20">
            <h2 className="services-title text-8xl font-bold tracking-tighter text-white">
              Nuestros
              <br />
              Servicios
            </h2>
            <p className="mt-8 text-xl text-zinc-400 max-w-xs">
              Soluciones digitales que transforman negocios e impulsan la innovación.
            </p>
          </div>

          {/* Tarjetas Horizontales */}
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              className={`services-card-shell card-${i} flex h-[70vh] w-[50vw] shrink-0 items-center justify-center px-10`}
            >
              <div className="services-card relative flex h-full w-full flex-col justify-center rounded-[3rem] border border-white/10 bg-white/5 p-12 backdrop-blur-2xl">
                <span className="services-card-number absolute top-10 left-12 text-6xl font-bold text-white/5">
                  {service.number}
                </span>
                <div className={`card-content-${i}`}>
                  <h3 className="services-card-title text-7xl font-black italic tracking-tighter text-white">
                    {service.title}
                  </h3>
                  <p className="services-card-description mt-6 max-w-md text-xl text-zinc-300">
                    {service.description}
                  </p>
                  <div className="services-card-list mt-10 grid grid-cols-2 gap-4">
                    {service.services.map((s, idx) => (
                      <div
                        key={idx}
                        className="services-card-item flex items-center gap-3 text-zinc-400"
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
