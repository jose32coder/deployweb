"use client";

/**
 * Section Component
 * Reusable section wrapper with consistent padding and spacing
 * Supports vertical padding customization and dark mode
 */
export const Section = ({
  children,
  className = "",
  paddingY = "py-14 md:py-18 lg:py-24",
  paddingX = "px-4 sm:px-6 lg:px-8",
  bgColor = "bg-deep-dark-950",
  id = null,
}) => {
  return (
    <section
      id={id}
      className={`w-full ${bgColor} ${paddingY} ${paddingX} ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;
