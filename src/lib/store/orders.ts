import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine } from "./cart";

export type OrderStatus =
  | "aguardando_pagamento"
  | "pago"
  | "em_producao"
  | "pronto"
  | "enviado"
  | "concluido"
  | "cancelado";

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: "gold" | "green" | "blue" | "muted" | "red" }> = {
  aguardando_pagamento: { label: "Aguardando pagamento", tone: "muted" },
  pago: { label: "Pagamento aprovado", tone: "green" },
  em_producao: { label: "Em produção", tone: "gold" },
  pronto: { label: "Pronto para retirada", tone: "blue" },
  enviado: { label: "Enviado", tone: "blue" },
  concluido: { label: "Concluído", tone: "green" },
  cancelado: { label: "Cancelado", tone: "red" },
};

export type PaymentMethod = "pix" | "cartao" | "boleto";

export type Order = {
  id: string;
  createdAt: string;
  paidAt?: string;
  customer: { name: string; email: string; phone: string };
  lines: CartLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingMethod: "retirada" | "entrega" | null;
  address?: { cep: string; street: string; number: string; city: string };
  payment: { method: PaymentMethod; installments?: number; cardLast4?: string };
  status: OrderStatus;
};

/** Pedidos fictícios para o painel administrativo não começar vazio */
const SEED_ORDERS: Order[] = [
  {
    id: "MG-240117",
    createdAt: "2026-10-28T14:12:00-03:00",
    paidAt: "2026-10-28T14:13:00-03:00",
    customer: { name: "Carla Menezes", email: "carla@exemplo.com", phone: "(81) 98888-1111" },
    lines: [
      {
        key: "service:cobertura-fotografica-digital:completa:2026-12-12",
        kind: "service",
        serviceSlug: "cobertura-fotografica-digital",
        packageId: "completa",
        title: "Cobertura Fotográfica Digital",
        packageName: "Completa",
        image: "/amostras/servico-cobertura.jpg",
        unitPrice: 1490,
        qty: 1,
        eventDate: "2026-12-12",
      },
    ],
    subtotal: 1490,
    discount: 74.5,
    shipping: 0,
    total: 1415.5,
    shippingMethod: null,
    payment: { method: "pix" },
    status: "pago",
  },
  {
    id: "MG-240121",
    createdAt: "2026-10-30T10:40:00-03:00",
    paidAt: "2026-10-30T10:41:00-03:00",
    customer: { name: "Pedro Albuquerque", email: "pedro@exemplo.com", phone: "(81) 97777-2222" },
    lines: [
      {
        key: "media:formatura-colegio-horizonte-2026:formatura-02:print:20x30:brilho",
        kind: "media",
        galleryId: "formatura-colegio-horizonte-2026",
        galleryTitle: "Baile de Formatura — 3º Ano 2026",
        mediaId: "formatura-02",
        mediaType: "photo",
        thumb: "/amostras/formatura-02.jpg",
        format: "print",
        sizeId: "20x30",
        sizeLabel: "20 x 30 cm",
        finish: "brilho",
        unitPrice: 39.9,
        qty: 2,
      },
      {
        key: "pack:formatura-colegio-horizonte-2026",
        kind: "pack",
        galleryId: "formatura-colegio-horizonte-2026",
        galleryTitle: "Baile de Formatura — 3º Ano 2026",
        thumb: "/amostras/formatura-03.jpg",
        photoCount: 9,
        unitPrice: 79.9,
        qty: 1,
      },
    ],
    subtotal: 159.7,
    discount: 0,
    shipping: 0,
    total: 159.7,
    shippingMethod: "retirada",
    payment: { method: "cartao", installments: 2, cardLast4: "4242" },
    status: "em_producao",
  },
  {
    id: "MG-240126",
    createdAt: "2026-11-02T19:05:00-03:00",
    paidAt: "2026-11-02T19:06:00-03:00",
    customer: { name: "Escola Raio de Sol", email: "contato@exemplo.com", phone: "(81) 96666-3333" },
    lines: [
      {
        key: "service:replica-escolar:turma-30:",
        kind: "service",
        serviceSlug: "replica-escolar",
        packageId: "turma-30",
        title: "Réplica Escolar",
        packageName: "Turma até 30",
        image: "/amostras/servico-escolar.jpg",
        unitPrice: 3900,
        qty: 1,
      },
      {
        key: "service:transmissao-ao-vivo:multicamera:2026-12-05",
        kind: "service",
        serviceSlug: "transmissao-ao-vivo",
        packageId: "multicamera",
        title: "Transmissão ao Vivo",
        packageName: "Multicâmera",
        image: "/amostras/servico-transmissao.jpg",
        unitPrice: 2290,
        qty: 1,
        eventDate: "2026-12-05",
      },
    ],
    subtotal: 6190,
    discount: 0,
    shipping: 0,
    total: 6190,
    shippingMethod: null,
    payment: { method: "boleto" },
    status: "pago",
  },
];

type OrdersState = {
  orders: Order[];
  create: (order: Order) => void;
  setStatus: (id: string, status: OrderStatus) => void;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,
      create: (order) => set({ orders: [order, ...get().orders] }),
      setStatus: (id, status) =>
        set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) }),
    }),
    {
      name: "megga-orders",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export function newOrderId() {
  return `MG-${Math.floor(240200 + Math.random() * 9000)}`;
}

/** Mídias liberadas (sem marca d'água) para um cliente, a partir dos pedidos pagos */
export function purchasedFor(orders: Order[], email: string | undefined) {
  const media = new Set<string>();
  const packs = new Set<string>();
  if (!email) return { media, packs };
  for (const o of orders) {
    if (o.customer.email.toLowerCase() !== email.toLowerCase()) continue;
    if (o.status === "aguardando_pagamento" || o.status === "cancelado") continue;
    for (const l of o.lines) {
      if (l.kind === "pack") packs.add(l.galleryId);
      if (l.kind === "media" && (l.format === "digital" || l.format === "pendrive")) {
        media.add(`${l.galleryId}:${l.mediaId}`);
      }
    }
  }
  return { media, packs };
}
