import { formatPrice } from "@/lib/format";
import { Reveal } from "@/components/Reveal";
import type { MenuItem } from "@/types/menu";

function ShotGlass({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 72" aria-hidden className="h-16 w-16 sm:h-[72px] sm:w-[72px]">
      {/* vapor */}
      <path
        d="M22 9c-3-4 1-6 0-9M32 7c-3-4 1-6 0-7M42 9c-3-4 1-6 0-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity=".55"
      />
      {/* líquido */}
      <path d="M15 26h34l-4 31a6 6 0 0 1-6 5H25a6 6 0 0 1-6-5z" fill={color} />
      {/* copo */}
      <path
        d="M13 20h38l-5 38a8 8 0 0 1-8 7H26a8 8 0 0 1-8-7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <ellipse cx="32" cy="26" rx="17" ry="4" fill={color} opacity=".55" />
    </svg>
  );
}

export function ShotsGrid({ items }: { items: MenuItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item, index) => (
        <Reveal
          as="li"
          key={item.id}
          variant="tilt"
          from={index % 2 ? 4 : -4}
          delay={index * 90}
          className="group relative flex flex-col items-center gap-2 border-2 border-black/15 px-3 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-black/40"
        >
          <div className="transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110">
            <ShotGlass color={item.swatch ?? "#E8332A"} />
          </div>
          <h4 className="font-display text-[0.72rem] font-black uppercase leading-tight tracking-[0.1em] sm:text-sm">
            {item.name}
          </h4>
          <span className="font-display text-sm font-black tabular-nums opacity-70">
            {formatPrice(item.price)}
          </span>
        </Reveal>
      ))}
    </ul>
  );
}
