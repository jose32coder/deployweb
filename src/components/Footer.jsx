"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const Footer = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    // Función para formatear la hora
    const updateTime = () => {
      const now = new Date();
      // Formato: 02:42:48 PM
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTime(formattedTime);
    };

    updateTime(); // Llamada inicial
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Para separar la hora y AM/PM para el estilo (el PM es más pequeño en el diseño)
  const timeParts = time.split(" ");
  const timeString = timeParts[0] || "00:00:00";
  const ampmString = timeParts.slice(1).join(" ") || "PM";

  return (
    <footer className="relative w-full bg-[#09090b] text-white pt-24 pb-8 overflow-hidden z-20 border-t border-white/5 font-sans">
      {/* Efectos de brillo de fondo */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/4"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none translate-y-1/2 translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col justify-between min-h-[400px]">
        {/* Contenedor Principal (Usando Flex en lugar de Grid) */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 w-full justify-between">
          {/* Columna Izquierda (Info y Reloj) */}
          <div className="flex flex-col justify-between w-full lg:w-5/12">
            <div className="flex flex-col space-y-6">
              <div>
                <a
                  href="mailto:deploy.coders@gmail.com"
                  className="text-xl md:text-2xl font-light hover:text-blue-400 transition-colors duration-300"
                >
                  deploy.coders@gmail.com
                </a>
              </div>
              <div>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-300 pb-1 border-b border-gray-700 hover:border-white"
                >
                  Instagram <span className="ml-1 text-xs">↗</span>
                </a>
              </div>
            </div>

            <div className="mt-20 lg:mt-32">
              <p className="text-sm text-gray-400 mb-2">
                Basada en la <span className="text-white">hora local</span>
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter tabular-nums leading-none">
                  {timeString}
                </span>
                <span className="text-xl md:text-2xl font-medium text-gray-300 uppercase">
                  {ampmString}
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha (Enlaces usando Flex) */}
          <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap gap-8 md:gap-4 lg:gap-8 w-full lg:w-7/12 justify-center">
            {/* Columna Servicios */}
            <div className="flex flex-col space-y-4 w-[45%] md:w-auto">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Servicios
              </h4>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Landing Pages
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Full Pages
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Aplicaciones móviles
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                E-commerces
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Automatizaciones
              </Link>
            </div>

            {/* Columna Proyectos */}
            <div className="flex flex-col space-y-4 w-[45%] md:w-auto">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Proyectos
              </h4>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                EVP
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                AFM
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Rifas web
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                App
              </Link>
            </div>

            {/* Columna Contactos */}
            <div className="flex flex-col space-y-4 w-[45%] md:w-auto">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Contactos
              </h4>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Instagram
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                LinkedIn
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Correo
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                WhatsApp
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Telegram
              </Link>
            </div>

            <div className="flex flex-col space-y-4 w-[45%] md:w-auto">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Equipo</h4>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Jesus Mura
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Jose Lopez
              </Link>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            Deploy, © {new Date().getFullYear()}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
