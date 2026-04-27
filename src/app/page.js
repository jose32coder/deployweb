"use client";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import StackSection from "@/components/StackSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#09090b] overflow-x-hidden">
      <HeroSection />

      <div className="relative z-20">
        <ServicesSection />
      </div>

      <div className="relative z-10 bg-[#09090b]">
        <StackSection />
        <CTASection />
        <ContactSection />
      </div>
    </main>
  );
}
