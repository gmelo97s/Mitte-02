import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/types/menu";

export function ItemRow({ item }: { item: MenuItem }) {
  return (
    <li className="group relative">
      <div className="flex items-start gap-3 py-2.5 transition-transform duration-300 ease-out group-hover:translate-x-1">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="mt-0.5 h-12 w-12 shrink-0 rounded-sm object-cover shadow-tape transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline">
            <h4 className="font-display text-[0.95rem] font-extrabold uppercase leading-tight tracking-[0.01em] sm:text-base">
              {item.name}
              {item.hit && (
                <span className="ml-2 inline-block translate-y-[-1px] bg-outs-red px-1.5 py-0.5 align-middle font-display text-[0.55rem] font-black uppercase tracking-[0.14em] text-white">
                  pedido
                </span>
              )}
            </h4>

            <span aria-hidden className="leader group-hover:!border-current" />

            {item.price === null ? (
              <span className="shrink-0 font-display text-[0.6rem] font-bold uppercase tracking-[0.12em] opacity-50">
                consultar
              </span>
            ) : (
              <span className="shrink-0 font-display text-base font-black tabular-nums transition-transform duration-300 ease-out group-hover:scale-[1.08] sm:text-lg">
                {formatPrice(item.price)}
              </span>
            )}
          </div>

          {(item.recipe || item.volume) && (
            <p className="mt-0.5 text-[0.78rem] leading-snug opacity-65 sm:text-[0.82rem]">
              {item.recipe}
              {item.recipe && item.volume && " · "}
              {item.volume}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
