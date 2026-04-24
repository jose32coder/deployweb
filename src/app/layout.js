import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "../styles/effects.css";
import RootLayoutClient from "./layout-client";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Deploy - High Performance Web Platform",
  description:
    "A sophisticated web platform built with Next.js, GSAP, and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${jakarta.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-deep-dark-950 text-deep-dark-50 font-sans">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
