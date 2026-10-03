import { useState } from "react";
import { Check, Clock, Copy, Instagram, MapPin, Target, Wifi } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { formatPrice } from "@/lib/format";
import { getOpenState } from "@/lib/hours";
import { VENUE } from "@/data/menu";

const DAY_INDEX: Record<string, number> = {
  Domingo: 0,
  Segunda: 1,
  Terça: 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  Sábado: 6,
};

function Card({
  icon,
  title,
  children,
  delay = 0,
  tilt = 0,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
  tilt?: number;
}) {
  return (
    <Reveal
      variant="tilt"
      from={tilt * 4}
      rest={tilt}
      delay={delay}
      className="group relative border border-outs-paper/12 bg-outs-coal/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-outs-kraft/50"
    >
      <div className="mb-4 flex items-center gap-2.5 text-outs-kraft">
        {icon}
        <h3 className="font-display text-xs font-black uppercase tracking-[0.2em]">{title}</h3>
      </div>
      {children}
    </Reveal>
  );
}

export function VenueInfo() {
  const [copied, setCopied] = useState(false);
  const today = new Date().getDay();
  const open = getOpenState().open;

  const copyWifi = async () => {
    try {
      await navigator.clipboard.writeText(VENUE.wifi.password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="a-casa" className="scroll-mt-28">
      <Reveal className="mb-8 text-center">
        <span className="tape-red inline-block px-6 py-2.5">
          <h2 className="font-display text-base font-black uppercase tracking-[0.14em] sm:text-xl">
            A casa
          </h2>
        </span>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={<Clock className="h-4 w-4" />} title="Horários" tilt={-0.8}>
          <ul className="space-y-1.5">
            {VENUE.hours.map((slot) => {
              const isToday = DAY_INDEX[slot.day] === today;
              return (
                <li
                  key={slot.day}
                  className={`flex items-baseline justify-between gap-3 text-sm ${
                    isToday ? "text-outs-paper" : "text-outs-bone/55"
                  }`}
                >
                  <span className={isToday ? "font-bold" : ""}>{slot.day}</span>
                  <span aria-hidden className="h-px flex-1 border-b border-dotted border-outs-paper/15" />
                  <span className="tabular-nums">{slot.time}</span>
                </li>
              );
            })}
            <li className="flex items-baseline justify-between gap-3 pt-1 text-sm text-outs-smoke/70">
              <span>{VENUE.closed.join(" e ")}</span>
              <span aria-hidden className="h-px flex-1 border-b border-dotted border-outs-paper/10" />
              <span>fechado</span>
            </li>
          </ul>
          <p className="mt-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.16em]">
            <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-emerald-400" : "bg-outs-red"}`} />
            <span className={open ? "text-emerald-400" : "text-outs-red"}>
              {open ? "Aberto agora" : "Fechado agora"}
            </span>
          </p>
        </Card>

        <Card icon={<MapPin className="h-4 w-4" />} title="Onde fica" delay={80} tilt={0.8}>
          <p className="font-display text-lg font-extrabold leading-tight text-outs-paper">
            Rua Augusta, 498
          </p>
          <p className="mt-1 text-sm text-outs-bone/60">Consolação · São Paulo</p>
          <a
            href={VENUE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 border-b border-outs-kraft/40 pb-0.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-outs-kraft transition-colors hover:border-outs-kraft"
          >
            Abrir no mapa
          </a>
        </Card>

        <Card icon={<Wifi className="h-4 w-4" />} title="Wi-Fi" delay={160} tilt={-0.8}>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-outs-smoke">Rede</p>
          <p className="font-display text-lg font-extrabold text-outs-paper">{VENUE.wifi.ssid}</p>
          <p className="mt-3 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-outs-smoke">Senha</p>
          <button
            type="button"
            onClick={copyWifi}
            className="mt-0.5 inline-flex items-center gap-2 font-display text-lg font-extrabold text-outs-kraft transition-colors hover:text-outs-red"
          >
            {VENUE.wifi.password}
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-3.5 w-3.5 opacity-60" />}
          </button>
          <p className="mt-2 h-4 text-[0.7rem] text-emerald-400">{copied ? "Copiado!" : ""}</p>
        </Card>

        <Card icon={<Target className="h-4 w-4" />} title="Rolês da casa" delay={240} tilt={0.8}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-display text-sm font-extrabold uppercase text-outs-paper">
              {VENUE.pool.label}
            </span>
            <span className="font-display text-lg font-black tabular-nums text-outs-kraft">
              {formatPrice(VENUE.pool.price)}
            </span>
          </div>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {VENUE.perks.map((perk) => (
              <li
                key={perk}
                className="border border-outs-paper/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-outs-bone/75"
              >
                {perk}
              </li>
            ))}
          </ul>
          <a
            href={VENUE.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 border-b border-outs-kraft/40 pb-0.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-outs-kraft transition-colors hover:border-outs-kraft"
          >
            <Instagram className="h-3.5 w-3.5" />
            {VENUE.instagram}
          </a>
        </Card>
      </div>
    </section>
  );
}
