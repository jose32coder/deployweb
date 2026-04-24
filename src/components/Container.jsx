"use client";

/**
 * Container Component
 * Provides consistent max-width and padding for content sections
 * Uses the design system's spacing scale
 */
export const Container = ({
  children,
  className = "",
  maxWidth = "max-w-7xl",
  padding = "px-4 sm:px-6 lg:px-8",
}) => {
  return (
    <div className={`mx-auto ${maxWidth} ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
