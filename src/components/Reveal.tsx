import { createElement, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Atraso em ms — use para escalonar listas. */
  delay?: number;
  /** "up" sobe reto; "tilt" entra torto, como papel colado na parede. */
  variant?: "up" | "tilt";
  /** Rotação de entrada (só no tilt). */
  from?: number;
  /** Rotação em repouso (só no tilt). */
  rest?: number;
  style?: CSSProperties;
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  variant = "up",
  from = -3,
  rest = 0,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return createElement(
    Tag,
    {
      ref,
      "data-visible": visible,
      className: cn(variant === "tilt" ? "reveal-tilt" : "reveal", className),
      style: {
        "--reveal-delay": `${delay}ms`,
        "--reveal-rot": `${from}deg`,
        "--rest-rot": `${rest}deg`,
        ...style,
      } as CSSProperties,
    },
    children,
  );
}
