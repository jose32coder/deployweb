// Global GSAP configuration and plugin registration
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Initialize GSAP plugins globally
 * This should be called once before using any GSAP animations
 */
export const initializeGSAP = () => {
  // Register plugins
  gsap.registerPlugin(ScrollTrigger, useGSAP);
};

/**
 * Default animation configuration
 * Provides consistent easing and timing across the app
 */
export const animationDefaults = {
  duration: 0.8,
  ease: "power2.inOut",
};

/**
 * ScrollTrigger configuration defaults
 */
export const scrollTriggerDefaults = {
  trigger: null,
  start: "top center+=100",
  end: "bottom center",
  markers: false, // Set to true for debugging
  refresh: true,
};

/**
 * Utility function to create smooth scroll animations
 * @param {string|element} target - Target element or selector
 * @param {number} duration - Animation duration
 * @param {object} vars - Additional GSAP vars
 */
export const smoothScrollTo = (target, duration = 0.8, vars = {}) => {
  const defaults = {
    scrollTo: target,
    duration,
    ...animationDefaults,
    ...vars,
  };
  return gsap.to(window, defaults);
};

/**
 * Get reduced motion preference
 * Returns true if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export default gsap;
