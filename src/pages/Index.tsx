import { useEffect, useMemo, useState } from "react";
import { ArrowUp, SearchX } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MenuNav } from "@/components/MenuNav";
import { MenuSectionBlock } from "@/components/MenuSectionBlock";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { VenueInfo } from "@/components/VenueInfo";
import { menu } from "@/data/menu";
import { useScrollSpy } from "@/hooks/use-scrollspy";
import type { MenuSection } from "@/types/menu";

const TICKER = [
  "Drink dobrado",
  "Shot de R$5",
  "Cerveja trincando",
  "Sinuca",
  "Rock na veia",
  "Rua Augusta 498",
  "Entrada franca",
  "Sem couvert",
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function filterMenu(sections: MenuSection[], query: string): MenuSection[] {
  const term = normalize(query.trim());
  if (!term) return sections;

  return sections
    .map((section) => {
      const groups = section.groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            normalize(`${item.name} ${item.recipe ?? ""} ${group.title ?? ""}`).includes(term),
          ),
        }))
        .filter((group) => group.items.length > 0);

      return { ...section, groups };
    })
    .filter((section) => section.groups.length > 0);
}

const Index = () => {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const sectionIds = useMemo(() => [...menu.map((section) => section.id), "a-casa"], []);
  const active = useScrollSpy(sectionIds);

  const visible = useMemo(() => filterMenu(menu, query), [query]);
  const isFiltering = query.trim().length > 0;

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="grain min-h-screen">
      <Hero />

      <div className="border-y border-outs-paper/10 bg-outs-red py-3 text-outs-ink">
        <Marquee items={TICKER} duration={38} />
      </div>

      <MenuNav
        sections={menu}
        active={active}
        query={query}
        onQueryChange={setQuery}
        searching={searching}
        onToggleSearch={setSearching}
      />

      <main id="cardapio" className="px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-10 text-center sm:mb-14">
            <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.35em] text-outs-smoke">
              Cardápio
            </p>
            <h2 className="mt-3 text-balance font-display text-[clamp(2rem,7vw,3.75rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-outs-paper">
              Tudo que sai <span className="text-outs-red">do balcão</span>
            </h2>
            {isFiltering && (
              <p className="mt-4 text-sm text-outs-bone/60">
                {visible.reduce(
                  (total, section) =>
                    total + section.groups.reduce((sum, group) => sum + group.items.length, 0),
                  0,
                )}{" "}
                resultado(s) para “{query.trim()}”
              </p>
            )}
          </Reveal>

          {visible.length === 0 ? (
            <Reveal className="flex flex-col items-center gap-4 py-24 text-center">
              <SearchX className="h-10 w-10 text-outs-smoke" />
              <p className="font-display text-lg font-bold uppercase tracking-[0.1em] text-outs-paper">
                Nada com esse nome
              </p>
              <p className="max-w-xs text-sm text-outs-bone/60">
                Tenta outro termo — ou pergunta no balcão, sempre tem algo fora do cardápio.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSearching(false);
                }}
                className="mt-2 bg-outs-red px-6 py-3 font-display text-xs font-black uppercase tracking-[0.14em] text-white transition-transform hover:-translate-y-0.5"
              >
                Limpar busca
              </button>
            </Reveal>
          ) : (
            <div className="space-y-16 sm:space-y-20">
              {visible.map((section, index) => (
                <MenuSectionBlock key={section.id} section={section} index={index} />
              ))}
            </div>
          )}

          <div className="mt-20 sm:mt-28">
            <VenueInfo />
          </div>
        </div>
      </main>

      <div className="border-y border-outs-paper/10 bg-outs-kraft py-3 text-outs-ink">
        <Marquee items={["Outs Pub", "Augusta 498", "Pop & Rock", "Jogos no telão", "Shots especiais"]} duration={44} reverse />
      </div>

      <SiteFooter />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Voltar ao topo"
        style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
        className={`fixed right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-outs-red text-white shadow-glow transition-all duration-300 ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Index;
