# Outs Pub — cardápio digital

Site do **Outs Pub**, o pubinho da Rua Augusta, 498 (Consolação, São Paulo).
Cardápio completo em página única, com a identidade de colagem/zine do impresso
da casa: fita vermelha, papel rasgado, kraft amarelo e carimbo.

## Rodando o projeto

```sh
npm install
npm run dev      # servidor local
npm run build    # build de produção em dist/
npm run lint
```

## Onde mexer no cardápio

Tudo vive em **`src/data/menu.ts`**. Não precisa tocar em componente nenhum para
mudar preço, nome ou ingrediente.

```ts
{ id: "dr-mojito", name: "Mojito", price: 32, recipe: "rum, água com gás, hortelã, açúcar", volume: "350ml" }
```

| Campo     | Para que serve                                                        |
| --------- | --------------------------------------------------------------------- |
| `price`   | Número em reais. **`null`** faz o site mostrar “consultar”.            |
| `recipe`  | Ingredientes, igual aos parênteses do impresso.                        |
| `volume`  | `"350ml"`, `"500g"`, `"12 unidades"`…                                  |
| `hit`     | `true` carimba a etiqueta vermelha **PEDIDO** no item.                 |
| `image`   | Caminho da foto do item (opcional — veja abaixo).                      |
| `swatch`  | Cor do líquido; usado só nos shots de R$5.                             |

Dados da casa (endereço, horários, Wi-Fi, Instagram, ficha de sinuca) ficam no
objeto `VENUE`, no fim do mesmo arquivo. O horário de funcionamento que liga o
selo “Aberto agora” está em `src/lib/hours.ts` — se mudar o `VENUE.hours`,
atualize os dois.

### Preços que ainda faltam

Os itens marcados com `price: null` são os trechos que saíram ilegíveis na foto
do cardápio impresso (reflexo/fora de foco): **long necks** (Amstel, Brahma,
Budweiser, Beck's, Corona, Eisenbahn, Heineken), **litrão** (Amstel, Budweiser,
Original), **drinks prontos** e **porções**. Basta trocar o `null` pelo número.

## Subindo as fotos dos itens

1. Coloque os arquivos em `public/fotos/` (ex.: `public/fotos/mojito.jpg`).
2. Aponte no item: `image: "/fotos/mojito.jpg"`.

A miniatura aparece à esquerda do nome e cresce um pouco no hover. Item sem
`image` simplesmente não mostra foto — nada quebra.

## Identidade

Tokens de cor e textura em `tailwind.config.ts` (`colors.outs`) e
`src/index.css`:

- `outs-red` `#E8332A` — fita crepe do logo
- `outs-kraft` `#F0C040` — papel amarelo (doses, cervejas, porções)
- `outs-paper` `#F4F0E6` — papel branco (drinks, caipirinha, gin, prontos)
- `outs-bubble` `#F2C8DE` — papel rosa (shots)
- `outs-ink` `#0B0A0A` — fundo

Classes utilitárias prontas: `.paper`, `.paper-kraft`, `.paper-bubble`,
`.tape-red`, `.tape-black`, `.washi` (durex, use num wrapper — nunca no
elemento com `clip-path`), `.grain`, `.leader`, `.reveal`, `.reveal-tilt`,
`.marquee-track`.

## Stack

Vite · React · TypeScript · Tailwind CSS · shadcn/ui · lucide-react
