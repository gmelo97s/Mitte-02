import { MenuSection } from "@/types/menu";

/**
 * Cardápio do Outs Pub — transcrito do impresso da casa.
 * Itens com `price: null` são os que ficaram ilegíveis na foto (foco/reflexo);
 * basta preencher o número aqui que o site passa a mostrar o valor.
 */
export const menu: MenuSection[] = [
  {
    id: "autorais",
    label: "Drinks",
    title: "Drinks",
    kicker: "Autorais & clássicos",
    note: "Tudo feito na hora, no balcão, do jeito que a Augusta pede.",
    paper: "paper",
    groups: [
      {
        items: [
          { id: "dr-absinto-citrico", name: "Absinto Cítrico", price: 26, recipe: "absinto, suco de laranja", volume: "350ml" },
          { id: "dr-amarula-fashion", name: "Amarula Fashion", price: 32, recipe: "amarula, maracujá", volume: "200ml" },
          { id: "dr-amnesia", name: "Amnésia", price: 12, recipe: "vodka, suco de morango, soda", volume: "350ml", hit: true },
          { id: "dr-aperol-spritz", name: "Aperol Spritz", price: 34, recipe: "aperol, espumante, água com gás", volume: "400ml" },
          { id: "dr-augusta-43", name: "Augusta 43", price: 40, recipe: "licor 43, limão siciliano, schweppes", volume: "350ml", hit: true },
          { id: "dr-blue-margarita", name: "Blue Margarita", price: 32, recipe: "tequila, curaçau blue, limão, sal", volume: "150ml" },
          { id: "dr-bombeirinho", name: "Bombeirinho", price: 18, recipe: "cachaça, limão, groselha", volume: "200ml" },
          { id: "dr-boulevardier", name: "Boulevardier", price: 38, recipe: "whiskey bourbon, vermute tinto, campari", volume: "200ml" },
          { id: "dr-cosmopolitan", name: "Cosmopolitan", price: 35, recipe: "vodka, suco cranberry, licor triple sec, limão", volume: "200ml" },
          { id: "dr-cuba-libre", name: "Cuba Libre", price: 18, recipe: "rum, coca-cola, limão", volume: "350ml" },
          { id: "dr-daiquiri", name: "Daiquiri", price: 22, recipe: "rum, limão, açúcar", volume: "100ml" },
          { id: "dr-dry-martini", name: "Dry Martini", price: 35, recipe: "martini dry, gin, azeitona", volume: "100ml" },
          { id: "dr-fitzgerald", name: "Fitzgerald", price: 40, recipe: "gin, limão siciliano, angostura, açúcar", volume: "200ml" },
          { id: "dr-garibaldi", name: "Garibaldi", price: 22, recipe: "campari, suco laranja", volume: "350ml" },
          { id: "dr-jagerbomb", name: "Jägerbomb", price: 36, recipe: "jägermeister, energético", volume: "350ml", hit: true },
          { id: "dr-jameson-lemonade", name: "Jameson Lemonade", price: 32, recipe: "whiskey jameson, limão siciliano, soda", volume: "350ml" },
          { id: "dr-kariri-mel", name: "Kariri c/ Mel", price: 16, recipe: "cachaça kariri, mel, limão", volume: "250ml" },
          { id: "dr-lagoa-azul", name: "Lagoa Azul", price: 22, recipe: "vodka, curaçau blue, soda", volume: "350ml" },
          { id: "dr-maracujack", name: "Maracujack", price: 34, recipe: "whiskey jack daniel's, maracujá, água com gás", volume: "350ml", hit: true },
          { id: "dr-margarita", name: "Margarita", price: 32, recipe: "tequila, licor laranja, limão", volume: "150ml" },
          { id: "dr-michelada", name: "Michelada", price: 24, recipe: "cerveja, limão, pimenta, sal", volume: "400ml" },
          { id: "dr-mojito", name: "Mojito", price: 32, recipe: "rum, água com gás, hortelã, açúcar", volume: "350ml" },
          { id: "dr-moscow-mule", name: "Moscow Mule", price: 32, recipe: "vodka, água com gás, limão, gengibre", volume: "300ml" },
          { id: "dr-negroni", name: "Negroni", price: 34, recipe: "campari, vermute tinto", volume: "200ml" },
          { id: "dr-penicillin", name: "Penicillin", price: 40, recipe: "whiskey, limão siciliano, gengibre, mel", volume: "200ml" },
          { id: "dr-sex-on-the-beach", name: "Sex on the Beach", price: 28, recipe: "vodka, licor pêssego, suco de laranja, groselha", volume: "400ml" },
          { id: "dr-submarino", name: "Submarino", price: 32, recipe: "cerveja, tequila, sal, limão", volume: "400ml" },
          { id: "dr-tequila-sunrise", name: "Tequila Sunrise", price: 32, recipe: "tequila, suco de laranja, groselha", volume: "400ml" },
          { id: "dr-whiskey-sour", name: "Whiskey Sour", price: 40, recipe: "whiskey, limão siciliano, angostura, açúcar", volume: "200ml" },
        ],
      },
    ],
  },
  {
    id: "caipirinhas",
    label: "Caipirinha",
    title: "Caipirinha",
    kicker: "Você escolhe a base",
    note: "Limão, morango, maracujá, kiwi — pergunta pra gente o que tem fresco hoje.",
    paper: "paper",
    groups: [
      {
        items: [
          { id: "cp-cachaca", name: "Cachaça", price: 24 },
          { id: "cp-cachaca-premium", name: "Cachaça Premium", price: 28 },
          { id: "cp-askov", name: "Askov", price: 20 },
          { id: "cp-smirnoff", name: "Smirnoff", price: 26 },
          { id: "cp-absolut", name: "Absolut", price: 30 },
          { id: "cp-vodka-premium", name: "Vodka Premium", price: 40 },
          { id: "cp-saque", name: "Saquê", price: 25 },
        ],
      },
    ],
  },
  {
    id: "gin",
    label: "Gin tônica",
    title: "Gin Tônica",
    kicker: "Com tônica gelada e limão",
    paper: "paper",
    groups: [
      {
        items: [
          { id: "gt-seagers", name: "Seagers", price: 24 },
          { id: "gt-beefeater", name: "Beefeater", price: 35 },
          { id: "gt-bombay", name: "Bombay", price: 38 },
          { id: "gt-tanqueray", name: "Tanqueray", price: 40 },
        ],
      },
    ],
  },
  {
    id: "shots",
    label: "Shots",
    title: "Shots",
    kicker: "Especiais & os de R$5",
    note: "Pede no balcão. Se vier com fósforo, respeita.",
    paper: "bubble",
    groups: [
      {
        title: "Shots Especiais",
        items: [
          { id: "sh-african-mint", name: "African Mint", price: 22, recipe: "amarula, licor de menta", volume: "50ml" },
          { id: "sh-belzebu", name: "Belzebu", price: 16, recipe: "vodka, licor curaçau, pimenta", volume: "50ml" },
          { id: "sh-bruxa-ma", name: "Bruxa Má", price: 22, recipe: "absinto, curaçau blue, gin", volume: "50ml" },
          { id: "sh-charles-bronson", name: "Charles Bronson", price: 36, recipe: "licor café, baileys, tequila, licor curaçau", volume: "dois shots de 50ml", hit: true },
          { id: "sh-el-diablo", name: "El Diablo", price: 22, recipe: "absinto, tequila, canelinha", volume: "50ml" },
          { id: "sh-fada-erotica", name: "Fada Erótica", price: 24, recipe: "absinto, tequila, curaçau blue", volume: "50ml" },
          { id: "sh-hemorragia-cerebral", name: "Hemorragia Cerebral", price: 22, recipe: "licor pêssego, baileys, groselha", volume: "50ml", hit: true },
        ],
      },
      {
        title: "Shots de R$5",
        note: "Quatro cores, uma decisão ruim cada.",
        items: [
          { id: "s5-coragem", name: "Coragem", price: 5, swatch: "#E8893A" },
          { id: "s5-alegria", name: "Alegria", price: 5, swatch: "#2FBF5B" },
          { id: "s5-bom-senso", name: "Bom Senso", price: 5, swatch: "#1F43D8" },
          { id: "s5-vergonha-na-cara", name: "Vergonha na Cara", price: 5, swatch: "#E23B32" },
        ],
      },
    ],
  },
  {
    id: "doses",
    label: "Doses",
    title: "Doses",
    kicker: "Puro, no gelo ou com energético",
    note: "Todas as doses saem em 50 ml.",
    stamp: "50 ml",
    paper: "kraft",
    groups: [
      {
        title: "Vodka",
        items: [
          { id: "do-askov", name: "Askov", price: 10 },
          { id: "do-smirnoff", name: "Smirnoff", price: 18 },
          { id: "do-wyborowa", name: "Wyborowa", price: 20 },
          { id: "do-absolut", name: "Absolut", price: 22 },
          { id: "do-grey-goose", name: "Grey Goose", price: 30 },
          { id: "do-ciroc", name: "Cîroc", price: 35 },
        ],
      },
      {
        title: "Whiskey",
        items: [
          { id: "do-red-label", name: "Red Label", price: 22 },
          { id: "do-fireball", name: "Fireball", price: 22 },
          { id: "do-jack-daniels", name: "Jack Daniel's", price: 28 },
          { id: "do-jameson", name: "Jameson", price: 28 },
          { id: "do-jim-beam", name: "Jim Beam", price: 28 },
          { id: "do-jack-fire", name: "Jack Fire", price: 30 },
          { id: "do-jack-honey", name: "Jack Honey", price: 30 },
          { id: "do-black-label", name: "Black Label", price: 32 },
        ],
      },
      {
        title: "Tequila",
        items: [
          { id: "do-jose-cuervo", name: "José Cuervo", price: 25 },
          { id: "do-el-jimador", name: "El Jimador", price: 30 },
          { id: "do-espolon", name: "Espolón", price: 35 },
        ],
      },
      {
        title: "Destilados & licores",
        items: [
          { id: "do-cachacas", name: "Cachaças", price: 15 },
          { id: "do-campari", name: "Campari", price: 16 },
          { id: "do-curacau-blue", name: "Curaçau Blue", price: 16 },
          { id: "do-canelinha", name: "Canelinha", price: 18 },
          { id: "do-absinto", name: "Absinto", price: 22 },
          { id: "do-amarula", name: "Amarula", price: 24 },
          { id: "do-baileys", name: "Baileys", price: 24 },
          { id: "do-jagermeister", name: "Jägermeister", price: 25 },
          { id: "do-licor-43", name: "Licor 43", price: 35 },
        ],
      },
    ],
  },
  {
    id: "cervejas",
    label: "Cervejas",
    title: "Cervejas",
    kicker: "Long neck & litrão",
    note: "Sempre trincando.",
    paper: "kraft",
    groups: [
      {
        title: "Long neck",
        items: [
          { id: "cv-praya", name: "Praya", price: 15 },
          { id: "cv-stella-artois", name: "Stella Artois", price: 15 },
          { id: "cv-stella-pure-gold", name: "Stella Artois Pure Gold", price: 16 },
          // TODO: preços ilegíveis na foto — confirmar com a casa.
          { id: "cv-amstel", name: "Amstel", price: null },
          { id: "cv-brahma", name: "Brahma", price: null },
          { id: "cv-budweiser", name: "Budweiser", price: null },
          { id: "cv-becks", name: "Beck's", price: null },
          { id: "cv-corona", name: "Corona", price: null },
          { id: "cv-eisenbahn", name: "Eisenbahn", price: null },
          { id: "cv-heineken", name: "Heineken", price: null },
        ],
      },
      {
        title: "Litrão",
        items: [
          // TODO: preços ilegíveis na foto — confirmar com a casa.
          { id: "lt-amstel", name: "Amstel", price: null },
          { id: "lt-budweiser", name: "Budweiser", price: null },
          { id: "lt-original", name: "Original", price: null },
        ],
      },
    ],
  },
  {
    id: "prontos",
    label: "Prontos",
    title: "Drinks Prontos",
    kicker: "Abre e bebe",
    paper: "paper",
    groups: [
      {
        items: [
          // TODO: preços ilegíveis na foto — confirmar com a casa.
          { id: "pr-51-ice", name: "51 Ice", price: null },
          { id: "pr-chopp-de-vinho", name: "Chopp de Vinho", price: null },
          { id: "pr-skol-beats", name: "Skol Beats", price: null },
          { id: "pr-smirnoff-ice", name: "Smirnoff Ice", price: null },
          { id: "pr-xeque-mate", name: "Xeque Mate", price: null },
        ],
      },
    ],
  },
  {
    id: "porcoes",
    label: "Porções",
    title: "Porções",
    kicker: "Pra forrar",
    note: "Esta parte do impresso saiu fora de foco — os preços entram assim que a casa confirmar.",
    paper: "kraft",
    groups: [
      {
        items: [
          // TODO: preços ilegíveis na foto — confirmar com a casa.
          { id: "po-batata-frita", name: "Batata Frita", price: null, volume: "500g" },
          { id: "po-batata-bacon", name: "Batata c/ Bacon", price: null, volume: "500g" },
          { id: "po-batata-cheddar-bacon", name: "Batata c/ Cheddar e Bacon", price: null, volume: "500g" },
          { id: "po-calabresa", name: "Calabresa", price: null, volume: "500g" },
          { id: "po-pao-de-queijo", name: "Pão de Queijo Mini", price: null, volume: "12 unidades" },
        ],
      },
    ],
  },
  {
    id: "diversos",
    label: "Sem álcool",
    title: "Diversos",
    kicker: "Água, refri & energético",
    paper: "paper",
    groups: [
      {
        items: [
          { id: "dv-agua", name: "Água", price: 5 },
          { id: "dv-agua-gas", name: "Água com Gás", price: 7 },
          { id: "dv-refrigerante", name: "Refrigerante Lata", price: 10 },
          { id: "dv-suco-laranja", name: "Suco de Laranja", price: 12 },
          { id: "dv-monster-269", name: "Monster", price: 15, volume: "269ml" },
          { id: "dv-red-bull", name: "Red Bull", price: 20, volume: "250ml" },
          { id: "dv-monster-473", name: "Monster", price: 20, volume: "473ml" },
        ],
      },
    ],
  },
];

export const VENUE = {
  name: "Outs Pub",
  tagline: "O pubinho mais querido da Augusta",
  address: "Rua Augusta, 498 — Consolação, São Paulo",
  mapsUrl: "https://maps.google.com/?q=Rua+Augusta+498+Consolação+São+Paulo",
  instagram: "@outspub",
  instagramUrl: "https://instagram.com/outspub",
  wifi: { ssid: "Outs Pub", password: "outspub498" },
  pool: { label: "Ficha de sinuca", price: 4 },
  perks: ["Entrada franca", "Sem couvert", "Sinuca", "Jogos e UFC no telão"],
  hours: [
    { day: "Quarta", time: "17h — 00h" },
    { day: "Quinta", time: "19h — 03h" },
    { day: "Sexta", time: "20h — 05h" },
    { day: "Sábado", time: "20h — 05h" },
    { day: "Domingo", time: "17h — 00h" },
  ],
  /** Dias fechados ficam de fora da lista acima (segunda e terça). */
  closed: ["Segunda", "Terça"],
};
