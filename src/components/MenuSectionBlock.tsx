import { Reveal } from "@/components/Reveal";
import { ItemRow } from "@/components/ItemRow";
import { ShotsGrid } from "@/components/ShotsGrid";
import { TornEdge } from "@/components/TornEdge";
import type { MenuSection, PaperStyle } from "@/types/menu";

const PAPER_CLASS: Record<PaperStyle, string> = {
  paper: "paper",
  kraft: "paper-kraft",
  bubble: "paper-bubble",
};

const PAPER_HEX: Record<PaperStyle, string> = {
  paper: "#f4f0e6",
  kraft: "#f0c040",
  bubble: "#f2c8de",
};

export function MenuSectionBlock({ section, index }: { section: MenuSection; index: number }) {
  const tilt = index % 2 === 0 ? -0.6 : 0.6;

  return (
    <section id={section.id} className="scroll-mt-28">
      <Reveal variant="tilt" from={tilt * 5} rest={tilt}>
        <div className={`relative shadow-sticker ${PAPER_CLASS[section.paper]}`}>
          <TornEdge position="top" color={PAPER_HEX[section.paper]} />
          <TornEdge position="bottom" color={PAPER_HEX[section.paper]} />

          {section.stamp && (
            <span className="pointer-events-none absolute right-4 top-6 z-10 rotate-[8deg] bg-outs-red px-3 py-1.5 font-display text-[0.65rem] font-black uppercase tracking-[0.18em] text-white shadow-tape sm:right-8 sm:top-9 sm:text-xs">
              {section.stamp}
            </span>
          )}

          <div className="px-5 py-9 sm:px-10 sm:py-12">
            <header className="mb-7 pr-20 sm:pr-24">
              <span className="tape-black px-5 py-2.5">
                <h2 className="font-display text-lg font-black uppercase tracking-[0.1em] sm:text-2xl">
                  {section.title}
                </h2>
              </span>
              <p className="mt-3 font-marker text-sm opacity-70 sm:text-base">{section.kicker}</p>
              {section.note && (
                <p className="mt-1.5 max-w-xl text-[0.8rem] leading-relaxed opacity-55">{section.note}</p>
              )}
            </header>

            <div className="space-y-9">
              {section.groups.map((group, groupIndex) => {
                const isSwatchGroup = group.items.every((item) => item.swatch);

                return (
                  <div key={group.title ?? `group-${groupIndex}`}>
                    {group.title && (
                      <div className="mb-3 flex items-baseline gap-3">
                        <h3 className="font-display text-sm font-black uppercase tracking-[0.2em] text-outs-red">
                          {group.title}
                        </h3>
                        <span aria-hidden className="h-px flex-1 bg-current opacity-20" />
                      </div>
                    )}
                    {group.note && (
                      <p className="mb-3 font-marker text-sm opacity-60">{group.note}</p>
                    )}

                    {isSwatchGroup ? (
                      <ShotsGrid items={group.items} />
                    ) : (
                      <ul className="divide-y divide-black/10 sm:columns-2 sm:gap-x-12 [&>li]:break-inside-avoid">
                        {group.items.map((item) => (
                          <ItemRow key={item.id} item={item} />
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
