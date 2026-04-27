"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const items = ["Trabajos", "Servicios", "Nosotros", "Contacto"];

  useGSAP(
    () => {
      // Entrada suave desde arriba
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.2,
      });

      // Animación de los links con stagger
      gsap.from(".nav-link", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.6,
      });
    },
    { scope: navRef },
  );

  return (
    <nav
      ref={navRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-4 sm:pt-6"
    >
      <div className="mx-auto flex w-[94%] max-w-[1440px] items-center justify-between rounded-full border border-white/5 bg-black/20 px-6 py-3 backdrop-blur-md sm:px-8 sm:py-4">
        {/* Logo */}
        <div className="pointer-events-auto text-xl font-bold tracking-[0.2em] text-white sm:text-2xl">
          <a href="/" className="">
            DEPLOY
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="pointer-events-auto hidden items-center gap-8 lg:flex">
          {items.map((item) => (
            <a
              key={item}
              href="#"
              className="nav-link text-sm font-medium tracking-wide text-zinc-400 transition-colors hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="pointer-events-auto hidden items-center gap-4 lg:flex">
          <button className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black">
            Contáctanos
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`pointer-events-auto absolute inset-x-0 top-full mt-2 overflow-hidden px-4 transition-all duration-500 lg:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-black/80 p-6 backdrop-blur-xl">
          {items.map((item) => (
            <a
              key={item}
              href="#"
              className="text-lg font-medium text-zinc-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <button className="mt-2 rounded-full bg-white py-3 font-bold text-black">
            Despliega Tu Proyecto
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
