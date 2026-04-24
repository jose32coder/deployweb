"use client";

export const BackgroundGrid = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        style={{ filter: "opacity(0.075)" }}
      >
        <defs>
          <pattern
            id="grid"
            width="90"
            height="90"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 90 0 L 0 0 0 90"
              fill="none"
              stroke="rgba(164, 174, 255, 0.18)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div
        className="absolute left-[-16%] top-[-18%] h-130 w-130"
        style={{
          background:
            "radial-gradient(circle, rgba(209,218,255,0.36) 0%, rgba(112,129,255,0.24) 28%, rgba(9,9,11,0) 66%)",
          filter: "blur(38px)",
        }}
      />

      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 54%, rgba(93,110,242,0.16) 0%, rgba(9,9,11,0) 58%)",
        }}
      />
    </div>
  );
};

export default BackgroundGrid;
