const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Formata o preço no padrão do cardápio impresso (R$22, R$79,90). */
export function formatPrice(value: number | null): string {
  if (value === null) return "—";
  return BRL.format(value).replace(/\s/g, "").replace("R$", "R$");
}
