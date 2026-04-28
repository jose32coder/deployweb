"use client";

import { useEffect } from "react";
import { initializeGSAP } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import BackgroundGrid from "@/components/BackgroundGrid";
import { Footer } from "@/components/Footer";
// import Preloader from "@/components/Preloader"; // Comentado temporalmente

/**
 * Client-side layout wrapper
 * Handles GSAP initialization and global layout structure
 */
export default function RootLayoutClient({ children }) {
  useEffect(() => {
    initializeGSAP();
    // El preloader está desactivado; marcamos como listo de inmediato
    window.__deployPreloaderReady = false;
    // El HeroSection maneja la secuencia de animación internamente
  }, []);

  /*
   * PRELOADER DESACTIVADO — mantener comentado para restaurar en el futuro:
   *
   * const [isLoaded, setIsLoaded] = useState(false);
   * const handleLoadingComplete = () => {
   *   window.__deployPreloaderReady = true;
   *   window.dispatchEvent(new Event("deploy:preloader-complete"));
   *   setIsLoaded(true);
   * };
   * {!isLoaded && <Preloader onLoadingComplete={handleLoadingComplete} />}
   */

  return (
    <>
      <BackgroundGrid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    </>
  );
}
