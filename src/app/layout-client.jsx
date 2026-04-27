"use client";

import { useEffect, useState } from "react";
import { initializeGSAP } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import BackgroundGrid from "@/components/BackgroundGrid";
import { Footer } from "@/components/Footer";
import Preloader from "@/components/Preloader";

/**
 * Client-side layout wrapper
 * Handles GSAP initialization and global layout structure
 */
export default function RootLayoutClient({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initializeGSAP();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoaded(true);
  };

  return (
    <>
      {!isLoaded && <Preloader onLoadingComplete={handleLoadingComplete} />}
      <BackgroundGrid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    </>
  );
}
