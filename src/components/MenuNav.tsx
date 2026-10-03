import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuSection } from "@/types/menu";

interface MenuNavProps {
  sections: MenuSection[];
  active: string;
  query: string;
  onQueryChange: (value: string) => void;
  searching: boolean;
  onToggleSearch: (open: boolean) => void;
}

export function MenuNav({
  sections,
  active,
  query,
  onQueryChange,
  searching,
  onToggleSearch,
}: MenuNavProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mantém a pílula ativa sempre à vista na faixa rolável.
  useEffect(() => {
    const list = listRef.current;
    if (!list || searching) return;
    const pill = list.querySelector<HTMLElement>(`[data-pill="${active}"]`);
    if (!pill) return;

    const target = pill.offsetLeft - list.clientWidth / 2 + pill.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active, searching]);

  useEffect(() => {
    if (searching) inputRef.current?.focus();
  }, [searching]);

  return (
    <div
      className="sticky z-40 border-b border-outs-paper/10 bg-outs-ink/85 backdrop-blur-xl"
      style={{ top: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2.5 sm:px-5">
        {searching ? (
          <div className="flex w-full animate-slide-down items-center gap-2">
            <Search className="h-4 w-4 shrink-0 text-outs-smoke" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  onQueryChange("");
                  onToggleSearch(false);
                }
              }}
              placeholder="Buscar drink, dose, cerveja…"
              className="w-full bg-transparent py-1.5 font-display text-sm font-medium text-outs-paper placeholder:text-outs-smoke focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                onQueryChange("");
                onToggleSearch(false);
              }}
              aria-label="Fechar busca"
              className="shrink-0 rounded-full p-1.5 text-outs-smoke transition-colors hover:bg-outs-soot hover:text-outs-paper"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div
              ref={listRef}
              className="no-scrollbar flex flex-1 items-center gap-1.5 overflow-x-auto scroll-smooth"
            >
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  data-pill={section.id}
                  className={cn(
                    "relative shrink-0 whitespace-nowrap px-3.5 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-300",
                    active === section.id
                      ? "text-outs-ink"
                      : "text-outs-bone/60 hover:text-outs-paper",
                  )}
                >
                  {active === section.id && (
                    <span
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full bg-outs-kraft transition-transform duration-300"
                    />
                  )}
                  {section.label}
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onToggleSearch(true)}
              aria-label="Buscar no cardápio"
              className="shrink-0 rounded-full border border-outs-paper/15 p-2 text-outs-bone transition-all duration-300 hover:border-outs-kraft hover:text-outs-kraft"
            >
              <Search className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
