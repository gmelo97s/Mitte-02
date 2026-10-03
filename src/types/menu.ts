export type SectionId =
  | "autorais"
  | "caipirinhas"
  | "gin"
  | "shots"
  | "doses"
  | "cervejas"
  | "prontos"
  | "porcoes"
  | "diversos";

export type PaperStyle = "paper" | "kraft" | "bubble";

export interface MenuItem {
  id: string;
  name: string;
  /** `null` = preço ainda não confirmado (trecho ilegível na foto do cardápio). */
  price: number | null;
  /** Ingredientes, como aparecem entre parênteses no cardápio impresso. */
  recipe?: string;
  /** Volume/porção servida. */
  volume?: string;
  /** Destaque de casa. */
  hit?: boolean;
  /** Cor do líquido — usada nos shots de R$5. */
  swatch?: string;
  /** Slot para a foto que o bar sobe depois (ex.: "/fotos/mojito.jpg"). */
  image?: string;
}

export interface MenuGroup {
  /** Subtítulo dentro da seção (ex.: "Vodka", "Long neck"). */
  title?: string;
  note?: string;
  items: MenuItem[];
}

export interface MenuSection {
  id: SectionId;
  /** Rótulo curto da navegação. */
  label: string;
  title: string;
  kicker: string;
  note?: string;
  /** Carimbo vermelho torto no canto do papel (ex.: "50 ML"). */
  stamp?: string;
  paper: PaperStyle;
  groups: MenuGroup[];
}
