import { useEffect, useState } from "react";
import { ArrowDown, Instagram, MapPin } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VENUE } from "@/data/menu";
import { getOpenState, type OpenState } from "@/lib/hours";

function StarBurst({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={style}>
      <path
        fill="currentColor"
        d="M50 0c4 27 19 42 50 50-31 8-46 23-50 50-4-27-19-42-50-50 31-8 46-23 50-50z"
      />
    </svg>
  );
}

export function Hero() {
  const [state, setState] = useState<OpenState>({ open: false, label: "" });
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setState(getOpenState());
    const tick = window.setInterval(() => setState(getOpenState()), 60_000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setOffset(window.scrollY));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="relative isolate overflow-hidden px-5 pb-20 pt-16 sm:pb-28 sm:pt-20">
      {/* Estrelas e fitas soltas, como no impresso */}
      <StarBurst
        aria-hidden
        className="pointer-events-none absolute -right-6 top-24 h-28 w-28 text-outs-paper/90 animate-float sm:right-10 sm:h-40 sm:w-40"
        style={{ "--tilt": "12deg", transform: `translateY(${offset * -0.08}px)` } as React.CSSProperties}
      />
      <StarBurst
        aria-hidden
        className="pointer-events-none absolute left-2 bottom-10 h-14 w-14 text-outs-red animate-float sm:left-16 sm:h-20 sm:w-20"
        style={{ "--tilt": "-8deg", animationDelay: "1.4s" } as React.CSSProperties}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-8 h-10 w-56 rotate-[-14deg] bg-outs-kraft/70 blur-[0.3px] sm:w-72"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal delay={60}>
          <span className="inline-flex items-center gap-2 rounded-full border border-outs-paper/15 bg-outs-coal/70 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-outs-bone backdrop-blur">
            <span className="relative flex h-2 w-2">
              {state.open && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-ring" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  state.open ? "bg-emerald-400" : "bg-outs-red"
                }`}
              />
            </span>
            {state.label || "Rua Augusta"}
          </span>
        </Reveal>

        {/* Logo em fita vermelha */}
        <Reveal variant="tilt" from={-6} rest={-1.5} delay={140} className="mt-8 inline-block">
          <div className="washi relative">
          <div className="tape-red relative px-8 py-5 shadow-sticker sm:px-14 sm:py-7">
            <h1 className="font-display text-[clamp(3rem,16vw,8rem)] font-black leading-[0.82] tracking-[-0.04em] text-outs-ink">
              <span className="block">OUTS</span>
              <span className="block pl-[0.18em] text-[0.74em]">PUB</span>
            </h1>
          </div>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <p className="mx-auto mt-9 max-w-xl text-balance font-marker text-lg leading-snug text-outs-kraft sm:text-2xl">
            {VENUE.tagline}
          </p>
        </Reveal>

        <Reveal delay={400}>
          <p className="mx-auto mt-4 max-w-lg text-balance text-sm leading-relaxed text-outs-bone/75 sm:text-base">
            Drink dobrado, som bom, cerveja trincando e shot especial de quarta a domingo.
            Entrada franca, sem couvert — na calçada mais barulhenta de São Paulo.
          </p>
        </Reveal>

        <Reveal delay={480} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#cardapio"
            className="group inline-flex items-center gap-2 bg-outs-red px-7 py-3.5 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
          >
            Ver o cardápio
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
          <a
            href={VENUE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 border border-outs-paper/25 px-7 py-3.5 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-outs-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-outs-kraft hover:text-outs-kraft"
          >
            <MapPin className="h-4 w-4" />
            Como chegar
          </a>
          <a
            href={VENUE.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Instagram ${VENUE.instagram}`}
            className="inline-flex h-12 w-12 items-center justify-center border border-outs-paper/25 text-outs-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-outs-red hover:text-outs-red"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </Reveal>

        <Reveal delay={560}>
          <p className="mt-10 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-outs-smoke">
            {VENUE.address}
          </p>
        </Reveal>
      </div>
    </header>
  );
}
