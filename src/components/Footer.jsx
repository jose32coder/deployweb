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
          <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap gap-8 md:gap-4 lg:gap-8 w-full lg:w-7/12 justify-between">
            {/* Columna Servicios */}
            <div className="flex flex-col space-y-4 w-[45%] md:w-auto">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Servicios
              </h4>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Diseño de Producto
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Desarrollo
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Estrategia GTM
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Apps de Salud
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Desarrollo de IA
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Desarrollo IoT
              </Link>
            </div>

            {/* Columna Deploy */}
            <div className="flex flex-col space-y-4 w-[45%] md:w-auto">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Deploy</h4>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Deploy Enterprise
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Deploy Agentic
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Deploy IntentIQ
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Comparar Deploy
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Deploy GIS
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Deploy Red Team
              </Link>
            </div>

            {/* Columna Demos */}
            <div className="flex flex-col space-y-4 w-[45%] md:w-auto">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Demos</h4>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Agentes de Voz
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                UI Generativa
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                IA de Sentimiento
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Detector de Mentiras
              </Link>
            </div>

            {/* Columna Recursos */}
            <div className="flex flex-col space-y-4 w-[45%] md:w-auto">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Recursos
              </h4>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Open Deploy
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Plataforma Clinix IA
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Clinix IA
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Synergies4
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Curehire
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Feature
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Vidzee
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Rhym3
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                OWASP
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Contacto
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
