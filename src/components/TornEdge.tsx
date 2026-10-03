const EDGE =
  "M0,24 L0,10 L40,4 L80,12 L120,3 L160,11 L200,2 L240,10 L280,4 L320,12 L360,5 L400,11 " +
  "L440,3 L480,10 L520,5 L560,13 L600,4 L640,11 L680,3 L720,12 L760,5 L800,10 L840,3 " +
  "L880,12 L920,6 L960,11 L1000,3 L1040,10 L1080,4 L1120,12 L1160,5 L1200,11 L1200,24 Z";

/** Beirada rasgada do papel. `color` é a cor do próprio papel. */
export function TornEdge({ color, position }: { color: string; position: "top" | "bottom" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 h-[14px] w-full ${
        position === "top" ? "-top-[13px] -scale-y-100" : "-bottom-[13px]"
      }`}
      style={{ color }}
    >
      <path d={EDGE} fill="currentColor" />
    </svg>
  );
}
