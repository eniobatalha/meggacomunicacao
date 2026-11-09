/**
 * Tabela de preços de mídias — VALORES FICTÍCIOS para apresentação.
 * O painel administrativo (/admin/precos) permite alterar estes valores
 * (salvos localmente nesta versão de demonstração).
 */

export type PrintSize = {
  id: string;
  label: string;
  /** Uso comum, exibido como dica */
  hint: string;
  price: number;
  /** Proporção largura/altura (paisagem) para o desenho da miniatura */
  w: number;
  h: number;
};

export const PRINT_SIZES: PrintSize[] = [
  { id: "10x15", label: "10 x 15 cm", hint: "Clássico de álbum", price: 9.9, w: 15, h: 10 },
  { id: "13x18", label: "13 x 18 cm", hint: "Porta-retrato", price: 14.9, w: 18, h: 13 },
  { id: "15x21", label: "15 x 21 cm", hint: "Tamanho A5", price: 19.9, w: 21, h: 15 },
  { id: "20x25", label: "20 x 25 cm", hint: "Mesa e estante", price: 29.9, w: 25, h: 20 },
  { id: "20x30", label: "20 x 30 cm", hint: "Tamanho A4", price: 39.9, w: 30, h: 20 },
  { id: "30x40", label: "30 x 40 cm", hint: "Quadro de parede", price: 69.9, w: 40, h: 30 },
  { id: "40x60", label: "40 x 60 cm", hint: "Pôster / destaque", price: 119.9, w: 60, h: 40 },
];

export type PrintFinish = { id: "brilho" | "fosco"; label: string; hint: string };

export const PRINT_FINISHES: PrintFinish[] = [
  { id: "brilho", label: "Brilho", hint: "Cores vivas e contraste" },
  { id: "fosco", label: "Fosco", hint: "Sem reflexos, toque aveludado" },
];

export type MediaPricing = {
  photoDigital: number;
  videoDigital: number;
  videoPendrive: number;
  prints: Record<string, number>;
};

export const DEFAULT_PRICING: MediaPricing = {
  photoDigital: 12.9,
  videoDigital: 49.9,
  videoPendrive: 89.9,
  prints: Object.fromEntries(PRINT_SIZES.map((s) => [s.id, s.price])),
};

export type ShippingOption = {
  id: "retirada" | "entrega";
  label: string;
  description: string;
  price: number;
};

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "retirada",
    label: "Retirar no estúdio",
    description: "Avisamos pelo WhatsApp quando o pedido estiver pronto.",
    price: 0,
  },
  {
    id: "entrega",
    label: "Entrega no endereço",
    description: "Envio com rastreio. Valor fixo nesta demonstração.",
    price: 24.9,
  },
];

/** Prazos (dias úteis) usados nas instruções pós-pagamento */
export const LEAD_TIMES = {
  digital: 0,
  print: 5,
  pendrive: 7,
  shipping: 4,
} as const;

export const PIX_DISCOUNT = 0.05;
export const MAX_INSTALLMENTS = 10;
