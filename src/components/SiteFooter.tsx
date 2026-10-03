import { Instagram, MapPin } from "lucide-react";
import { VENUE } from "@/data/menu";

export function SiteFooter() {
  return (
    <footer className="border-t border-outs-paper/10 px-5 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 text-center">
        <span className="tape-red inline-block px-7 py-3">
          <span className="font-display text-2xl font-black tracking-[-0.01em] text-outs-ink">
            OUTS PUB
          </span>
        </span>

        <p className="font-marker text-sm text-outs-kraft">{VENUE.tagline}</p>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href={VENUE.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-outs-bone/70 transition-colors hover:text-outs-paper"
          >
            <Instagram className="h-4 w-4" />
            {VENUE.instagram}
          </a>
          <a
            href={VENUE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-outs-bone/70 transition-colors hover:text-outs-paper"
          >
            <MapPin className="h-4 w-4" />
            {VENUE.address}
          </a>
        </div>

        <p className="max-w-md text-[0.7rem] leading-relaxed text-outs-smoke">
          Preços sujeitos a alteração sem aviso. Venda de bebida alcoólica proibida para menores de
          18 anos. Se beber, não dirija.
        </p>

        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-outs-smoke/60">
          © {new Date().getFullYear()} Outs Pub · Rua Augusta
        </p>
      </div>
    </footer>
  );
}
