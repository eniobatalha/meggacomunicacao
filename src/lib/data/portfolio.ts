/**
 * Portfólio de DEMONSTRAÇÃO.
 * Fotos de exemplo: Unsplash (licença Unsplash). Substituir pelas fotos reais da Megga.
 */

export const PORTFOLIO_CATEGORIES = [
  "Casamentos",
  "Ensaios",
  "Formaturas",
  "Aniversários",
  "Corporativo",
  "Shows",
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export type PortfolioPhoto = {
  src: string;
  w: number;
  h: number;
  category: PortfolioCategory;
  /** Aparece na seção de portfólio da página inicial */
  featured?: boolean;
};

const L = { w: 1400, h: 933 };
const P = { w: 933, h: 1400 };

/** Ordem intercalada para a aba "Todos" ficar variada */
export const PORTFOLIO: PortfolioPhoto[] = [
  { src: "/amostras/casamento-20.jpg", ...L, category: "Casamentos", featured: true },
  { src: "/portfolio/ensaio-01.jpg", w: 994, h: 1400, category: "Ensaios", featured: true },
  { src: "/amostras/formatura-10.jpg", ...L, category: "Formaturas", featured: true },
  { src: "/portfolio/corporativo-01.jpg", ...L, category: "Corporativo", featured: true },
  { src: "/amostras/aniversario-07.jpg", ...L, category: "Aniversários", featured: true },
  { src: "/portfolio/show-07.jpg", w: 1050, h: 1400, category: "Shows", featured: true },
  { src: "/portfolio/casamento-01.jpg", ...P, category: "Casamentos", featured: true },
  { src: "/portfolio/ensaio-02.jpg", ...L, category: "Ensaios", featured: true },
  { src: "/amostras/formatura-02.jpg", w: 1083, h: 1400, category: "Formaturas", featured: true },

  { src: "/amostras/casamento-06.jpg", ...P, category: "Casamentos" },
  { src: "/portfolio/corporativo-02.jpg", ...L, category: "Corporativo" },
  { src: "/amostras/aniversario-03.jpg", w: 1400, h: 1120, category: "Aniversários" },
  { src: "/portfolio/show-01.jpg", ...L, category: "Shows" },
  { src: "/portfolio/ensaio-03.jpg", ...P, category: "Ensaios" },
  { src: "/amostras/formatura-11.jpg", w: 1400, h: 1224, category: "Formaturas" },
  { src: "/amostras/casamento-16.jpg", w: 1400, h: 934, category: "Casamentos" },
  { src: "/portfolio/corporativo-03.jpg", ...L, category: "Corporativo" },
  { src: "/amostras/aniversario-09.jpg", w: 1400, h: 842, category: "Aniversários" },

  { src: "/portfolio/show-02.jpg", ...L, category: "Shows" },
  { src: "/portfolio/ensaio-04.jpg", ...L, category: "Ensaios" },
  { src: "/amostras/casamento-03.jpg", ...L, category: "Casamentos" },
  { src: "/amostras/formatura-03.jpg", w: 1400, h: 934, category: "Formaturas" },
  { src: "/portfolio/corporativo-04.jpg", w: 1400, h: 1000, category: "Corporativo" },
  { src: "/amostras/aniversario-08.jpg", w: 1400, h: 935, category: "Aniversários" },
  { src: "/portfolio/show-06.jpg", w: 1400, h: 1050, category: "Shows" },
  { src: "/portfolio/ensaio-05.jpg", ...P, category: "Ensaios" },
  { src: "/amostras/casamento-27.jpg", ...P, category: "Casamentos" },

  { src: "/amostras/formatura-12.jpg", ...L, category: "Formaturas" },
  { src: "/portfolio/corporativo-05.jpg", w: 1400, h: 935, category: "Corporativo" },
  { src: "/amostras/aniversario-01.jpg", w: 1400, h: 934, category: "Aniversários" },
  { src: "/portfolio/show-03.jpg", ...L, category: "Shows" },
  { src: "/amostras/casamento-07.jpg", ...P, category: "Ensaios" },
  { src: "/portfolio/casamento-02.jpg", ...P, category: "Casamentos" },
  { src: "/amostras/formatura-06.jpg", w: 1400, h: 934, category: "Formaturas" },
  { src: "/portfolio/corporativo-06.jpg", ...L, category: "Corporativo" },
  { src: "/amostras/aniversario-11.jpg", ...L, category: "Aniversários" },

  { src: "/portfolio/show-04.jpg", ...L, category: "Shows" },
  { src: "/portfolio/ensaio-06.jpg", ...P, category: "Ensaios" },
  { src: "/amostras/casamento-09.jpg", ...L, category: "Casamentos" },
  { src: "/amostras/formatura-14.jpg", ...L, category: "Formaturas" },
  { src: "/portfolio/corporativo-07.jpg", ...L, category: "Corporativo" },
  { src: "/amostras/aniversario-10.jpg", ...L, category: "Aniversários" },
  { src: "/portfolio/show-05.jpg", ...L, category: "Shows" },
  { src: "/portfolio/corporativo-08.jpg", ...L, category: "Corporativo" },
  { src: "/portfolio/show-08.jpg", ...L, category: "Shows" },
  { src: "/portfolio/corporativo-09.jpg", w: 1400, h: 758, category: "Corporativo" },
];

/** Rótulo no singular para legendas */
export const CATEGORY_LABEL: Record<PortfolioCategory, string> = {
  Casamentos: "Casamento",
  Ensaios: "Ensaio",
  Formaturas: "Formatura",
  Aniversários: "Aniversário",
  Corporativo: "Corporativo",
  Shows: "Show",
};
