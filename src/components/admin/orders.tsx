"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { brl, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { lineSubtitle, lineTitle } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/hydration";
import { ORDER_STATUS, useOrders, type Order, type OrderStatus } from "@/lib/store/orders";
import { toast } from "@/lib/store/toast";
import { AdminTitle } from "./admin-shell";

const FILTERS: { id: "todos" | OrderStatus; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pago", label: "Pagos" },
  { id: "em_producao", label: "Em produção" },
  { id: "pronto", label: "Prontos" },
  { id: "enviado", label: "Enviados" },
  { id: "concluido", label: "Concluídos" },
];

const PAYMENT = { pix: "Pix", cartao: "Cartão", boleto: "Boleto" };

const paymentLabel = (o: Order) =>
  PAYMENT[o.payment.method] + (o.payment.installments && o.payment.installments > 1 ? ` ${o.payment.installments}x` : "");
const shippingLabel = (o: Order) =>
  o.shippingMethod === "entrega" ? "Entrega" : o.shippingMethod === "retirada" ? "Retirada" : "Sem envio";

export function AdminOrders() {
  const ready = useHydrated(useOrders);
  const orders = useOrders((s) => s.orders);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("todos");
  const [open, setOpen] = useState<string | null>(null);

  const visible = orders.filter((o) => filter === "todos" || o.status === filter);
  const toggle = (id: string) => setOpen(open === id ? null : id);

  return (
    <>
      <AdminTitle title="Pedidos" subtitle="Atualize o status — o cliente acompanha em tempo real na área dele." />

      <div className="-mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {FILTERS.map((f) => {
          const count = f.id === "todos" ? orders.length : orders.filter((o) => o.status === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors",
                filter === f.id ? "bg-gold text-ink-950" : "text-silver hover:bg-white/5",
              )}
            >
              {f.label} <span className={filter === f.id ? "text-ink-950/60" : "text-smoke"}>{ready ? count : ""}</span>
            </button>
          );
        })}
      </div>

      {ready && visible.length === 0 && (
        <p className="rounded-2xl border border-white/7 bg-ink-850 px-5 py-12 text-center text-mist">
          Nenhum pedido com este status.
        </p>
      )}

      {/* Celular e tablet: cartões (a tabela precisa de ~900px livres) */}
      <div className="grid gap-3 md:grid-cols-2 xl:hidden">
        {ready &&
          visible.map((o) => (
            <article key={o.id} className="rounded-2xl border border-white/7 bg-ink-850 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-bone">{o.id}</p>
                  <p className="text-xs text-smoke">{formatDateTime(o.createdAt)}</p>
                </div>
                <p className="font-semibold text-gold-200 tabular-nums">{brl(o.total)}</p>
              </div>
              <div className="mt-3">
                <p className="text-sm text-bone">{o.customer.name}</p>
                <p className="truncate text-xs text-smoke">{o.customer.email}</p>
              </div>
              <p className="mt-2 text-xs text-silver">
                {paymentLabel(o)} · {shippingLabel(o)}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <StatusSelect order={o} className="min-w-0 flex-1" />
                <button
                  type="button"
                  onClick={() => toggle(o.id)}
                  className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 text-silver hover:text-bone"
                  aria-label="Ver itens"
                  aria-expanded={open === o.id}
                >
                  <ChevronDown className={cn("size-4 transition-transform", open === o.id && "rotate-180")} />
                </button>
              </div>
              {open === o.id && (
                <div className="mt-4 border-t border-white/6 pt-4">
                  <OrderDetails order={o} />
                </div>
              )}
            </article>
          ))}
      </div>

      {/* Desktop: tabela */}
      <div className="hidden overflow-x-auto rounded-2xl border border-white/7 bg-ink-850 xl:block">
        <table className="w-full text-sm">
          <thead className="border-b border-white/6 text-left text-xs text-smoke">
            <tr>
              <th className="px-5 py-3 font-medium">Pedido</th>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Pagamento</th>
              <th className="px-5 py-3 font-medium">Entrega</th>
              <th className="px-5 py-3 text-right font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {ready &&
              visible.map((o) => (
                <Fragment key={o.id}>
                  <tr className="align-middle">
                    <td className="px-5 py-4">
                      <p className="font-semibold whitespace-nowrap text-bone">{o.id}</p>
                      <p className="text-xs whitespace-nowrap text-smoke">{formatDateTime(o.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-bone">{o.customer.name}</p>
                      <p className="text-xs text-smoke">{o.customer.email}</p>
                    </td>
                    <td className="px-5 py-4 text-silver">{paymentLabel(o)}</td>
                    <td className="px-5 py-4 text-silver">{o.shippingMethod ? shippingLabel(o) : "—"}</td>
                    <td className="px-5 py-4 text-right font-semibold whitespace-nowrap tabular-nums">{brl(o.total)}</td>
                    <td className="px-5 py-4">
                      <StatusSelect order={o} className="w-48" />
                    </td>
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        onClick={() => toggle(o.id)}
                        className="grid size-9 place-items-center rounded-full text-smoke hover:bg-white/5 hover:text-bone"
                        aria-label="Ver itens"
                        aria-expanded={open === o.id}
                      >
                        <ChevronDown className={cn("size-4 transition-transform", open === o.id && "rotate-180")} />
                      </button>
                    </td>
                  </tr>
                  {open === o.id && (
                    <tr className="bg-ink-900/60">
                      <td colSpan={7} className="px-5 py-5">
                        <OrderDetails order={o} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatusSelect({ order, className }: { order: Order; className?: string }) {
  const setStatus = useOrders((s) => s.setStatus);
  return (
    <select
      aria-label={`Status do pedido ${order.id}`}
      value={order.status}
      onChange={(e) => {
        const status = e.target.value as OrderStatus;
        setStatus(order.id, status);
        toast({ title: `Pedido ${order.id}`, description: `Status alterado para "${ORDER_STATUS[status].label}".` });
      }}
      // 16px em telas de toque: evita o zoom automático do iPhone ao tocar no campo
      className={cn(
        "h-11 rounded-xl border border-white/10 bg-ink-800 px-3 text-base text-bone outline-none focus:border-gold-500/70 focus:ring-4 focus:ring-gold-500/10 pointer-fine:h-10 pointer-fine:text-sm",
        className,
      )}
    >
      {(Object.keys(ORDER_STATUS) as OrderStatus[]).map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS[s].label}
        </option>
      ))}
    </select>
  );
}

function OrderDetails({ order: o }: { order: Order }) {
  return (
    <div className="flex flex-col justify-between gap-6 lg:flex-row">
      <ul className="flex-1 space-y-2">
        {o.lines.map((l) => (
          <li key={l.key} className="flex justify-between gap-4 text-sm">
            <span className="min-w-0">
              <span className="text-gold-300">{l.qty}x</span> <span className="text-bone">{lineTitle(l)}</span>
              <span className="block text-xs text-smoke">{lineSubtitle(l)}</span>
            </span>
            <span className="shrink-0 text-silver tabular-nums">{brl(l.unitPrice * l.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="flex shrink-0 flex-col gap-1 lg:w-56">
        <StatusBadge status={o.status} className="mb-1 self-start" />
        <p className="text-xs text-mist">WhatsApp: {o.customer.phone}</p>
        <Link
          href={`/pedido/${o.id}`}
          className="flex min-h-9 items-center gap-1.5 text-xs font-semibold text-gold-300 hover:underline"
        >
          <ExternalLink className="size-3.5" /> Ver página do pedido
        </Link>
        <a
          href={`https://wa.me/55${o.customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá, ${o.customer.name.split(" ")[0]}! Aqui é da Megga Comunicação, sobre o seu pedido ${o.id}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-9 items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
        >
          <WhatsAppIcon className="size-3.5" /> Falar com o cliente
        </a>
      </div>
    </div>
  );
}
