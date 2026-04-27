"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/Container";

export const ContactSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  useGSAP(
    () => {
      // Registramos ScrollTrigger por precaución
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out" },
      });

      // Animación del texto LETS CONNECT (de abajo hacia arriba)
      tl.from(".title-line", {
        y: 100,
        opacity: 0,
        rotation: 5,
        stagger: 0.1,
        duration: 1.2,
        clearProps: "all",
      });

      // Animación del formulario (stagger de los elementos)
      tl.from(
        ".form-element",
        {
          y: 30,
          opacity: 0,
          stagger: 0.05,
          duration: 0.8,
          clearProps: "all",
        },
        "-=0.8", // Comienza mientras la animación del título termina
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="contact-shell relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#09090b] py-24 md:py-40"
      id="contact"
    >
      <Container
        maxWidth="max-w-7xl"
        className="contact-content relative z-10 w-full px-6 md:px-12"
      >
        <div className="contact-grid flex flex-col justify-between gap-12 lg:flex-row xl:gap-8">
          {/* Left Column: Title */}
          <div className="contact-left w-full flex flex-col justify-start">
            <div ref={titleRef} className="flex flex-col gap-1 overflow-hidden">
              {/* Animamos las líneas por separado para el efecto "de abajo hacia arriba" */}
              <h2 className="title-line contact-title text-[clamp(2rem,8vw,5rem)] font-black leading-[0.95] tracking-tighter text-white lg:text-[4rem] xl:text-[4rem]">
                CONECTEMOS <br />Y DESPLEGUEMOS
              </h2>
            </div>
          </div>

          {/* Right Column: Form */}
          <div ref={formRef} className="contact-form-wrap w-full flex flex-col">
            <div className="form-element contact-lead mb-2 max-w-lg text-sm leading-relaxed font-light text-zinc-400 md:text-base">
              Hablemos sobre tu próxima gran idea. Usa el formulario para
              contarnos más, o simplemente envíanos un correo a{" "}
              <a
                href="mailto:deploy.coders@gmail.com"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                deploy.coders@gmail.com
              </a>
            </div>

            <form className="contact-form flex w-full flex-col gap-2">
              {/* Row: Name & Last Name */}
              <div className="contact-row flex w-full flex-col gap-8 sm:flex-row">
                <div className="form-element flex flex-col gap-2 w-full">
                  <label className="text-zinc-300 text-sm font-medium tracking-wide">
                    Nombre <span className="text-indigo-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Juan"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="form-element flex flex-col gap-2 w-full">
                  <label className="text-zinc-300 text-sm font-medium tracking-wide">
                    Apellido <span className="text-indigo-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Pérez"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row: Email */}
              <div className="form-element flex flex-col gap-2 w-full">
                <label className="text-zinc-300 text-sm font-medium tracking-wide">
                  Correo Electrónico <span className="text-indigo-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="juan@empresa.com"
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Row: Phone Number */}
              <div className="form-element flex flex-col gap-2 w-full">
                <label className="text-zinc-300 text-sm font-medium tracking-wide">
                  Teléfono <span className="text-indigo-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Row: Service & Budget */}
              <div className="contact-row flex w-full flex-col gap-8 sm:flex-row">
                <div className="form-element flex flex-col gap-2 w-full">
                  <label className="text-zinc-300 text-sm font-medium tracking-wide">
                    Servicio de Interés{" "}
                    <span className="text-indigo-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full bg-transparent border-b border-white/10 py-3 text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                      <option value="" className="bg-[#09090b]">
                        Selecciona un servicio...
                      </option>
                      <option value="web" className="bg-[#09090b]">
                        Desarrollo Web
                      </option>
                      <option value="app" className="bg-[#09090b]">
                        Desarrollo Móvil
                      </option>
                      <option value="design" className="bg-[#09090b]">
                        Diseño UI/UX
                      </option>
                      <option value="consulting" className="bg-[#09090b]">
                        Consultoría
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-zinc-500">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="form-element flex flex-col gap-2 w-full">
                  <label className="text-zinc-300 text-sm font-medium tracking-wide">
                    Presupuesto del Proyecto{" "}
                    <span className="text-indigo-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full bg-transparent border-b border-white/10 py-3 text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                      <option value="" className="bg-[#09090b]">
                        Selecciona un rango...
                      </option>
                      <option value="small" className="bg-[#09090b]">
                        Menos de $1k
                      </option>
                      <option value="medium" className="bg-[#09090b]">
                        $1k - $5k
                      </option>
                      <option value="large" className="bg-[#09090b]">
                        $5k - $15k
                      </option>
                      <option value="enterprise" className="bg-[#09090b]">
                        Más de $15k
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-zinc-500">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row: Message */}
              <div className="form-element flex flex-col gap-2 w-full mt-2">
                <label className="text-zinc-300 text-sm font-medium tracking-wide">
                  Mensaje <span className="text-indigo-500">*</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Cuéntanos más sobre tu proyecto..."
                  className="w-full bg-transparent border-b border-white/10 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="form-element contact-submit mt-6">
                <button
                  type="submit"
                  className="contact-btn group relative w-full cursor-pointer overflow-hidden rounded-full border border-white/10 bg-indigo-500/20 px-8 py-3.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.15)] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-indigo-500/30 hover:shadow-[0_0_35px_rgba(99,102,241,0.3)] sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactSection;
