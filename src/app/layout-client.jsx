"use client";

import { useEffect } from "react";
import { initializeGSAP } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import BackgroundGrid from "@/components/BackgroundGrid";

/**
 * Client-side layout wrapper
 * Handles GSAP initialization and global layout structure
 */
export default function RootLayoutClient({ children }) {
  useEffect(() => {
    initializeGSAP();
  }, []);

  return (
    <>
      <BackgroundGrid />
      <div className="relative z-10">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </>
  );
}
