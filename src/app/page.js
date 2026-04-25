"use client";

import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#09090b]">
      <HeroSection />
      <ContactSection />
    </main>
  );
}
