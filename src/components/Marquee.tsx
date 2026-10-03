import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  /** Duração de uma volta completa, em segundos. */
  duration?: number;
  reverse?: boolean;
  separator?: string;
}

export function Marquee({
  items,
  className,
  duration = 32,
  reverse = false,
  separator = "✦",
}: MarqueeProps) {
  // A lista é duplicada para o loop ficar contínuo (o track anda -50%).
  const loop = [...items, ...items];

  return (
    <div className={cn("marquee relative overflow-hidden", className)}>
      <div
        className="marquee-track items-center gap-6 whitespace-nowrap will-change-transform"
        data-reverse={reverse}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {loop.map((item, index) => (
          <Fragment key={`${item}-${index}`}>
            <span className="font-ticker text-xl uppercase tracking-[0.14em] sm:text-2xl">{item}</span>
            <span aria-hidden className="text-outs-red/80 text-sm">
              {separator}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
