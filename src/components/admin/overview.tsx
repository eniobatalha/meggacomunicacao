"use client";

import Link from "next/link";
import { ArrowRight, FolderPlus, Tag, Upload } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { brl, formatDateShort } from "@/lib/format";
import { useHydrated } from "@/lib/store/hydration";
import { useOrders } from "@/lib/store/orders";
import { useAllGalleries, useStudio } from "@/lib/store/studio";
import { AdminTitle } from "./admin-shell";

/* Paleta validada (dataviz/validate_palette.js, modo escuro, superfície #101013, ordem adjacente) */
const CATEGORIES = [
  { id: "services", label: "Serviços", color: "#b5852b" },
  { id: "digital", label: "Fotos e vídeos digitais", color: "#3987e5" },
  { id: "physical", label: "Impressões e pen drives", color: "#199e70" },
] as const;

const compact = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 });

export function AdminOverview() {
  const ready = useHydrated(useOrders, useStudio);
  const orders = useOrders((s) => s.orders);
  const galleries = useAllGalleries();

  const paid = orders.filter((o) => o.status !== "aguardando_pagamento" && o.status !== "cancelado");
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const inProduction = orders.filter((o) => o.status === "em_producao").length;
  const media = galleries.reduce((s, g) => s + g.items.length, 0);

  const byCategory = { services: 0, digital: 0, physical: 0 };
  for (const o of paid) {
    for (const l of o.lines) {
      const amount = l.unitPrice * l.qty;
      if (l.kind === "service") byCategory.services += amount;
      else if (l.kind === "pack" || l.format === "digital") byCategory.digital += amount;
      else byCategory.physical += amount;
    }
  }
  const catTotal = byCategory.services + byCategory.digital + byCategory.physical;

  const tiles = [
    { label: "Receita (pedidos pagos)", value: compact.format(revenue), note: `${paid.length} pedidos pagos` },
    { label: "Pedidos", value: String(orders.length), note: "todos os status" },
    { label: "Em produção", value: String(inProduction), note: "impressões e pen drives" },
    { label: "Galerias ativas", value: String(galleries.length), note: `${media} fotos e vídeos` },
  ];

  return (
    <>
      <AdminTitle
        title="Visão geral"
        subtitle="Resumo da operação · dados de demonstração"
        action={
          <ButtonLink href="/admin/galerias?nova=1">
            <FolderPlus className="size-4" /> Nova galeria
          </ButtonLink>
        }
      />

      {/* KPI row */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4" aria-label="Indicadores">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl border border-white/7 bg-ink-850 p-4 sm:p-5">
            <p className="text-xs text-mist sm:text-sm">{t.label}</p>
            <p className="mt-2 font-sans text-2xl font-semibold tracking-tight whitespace-nowrap text-bone sm:text-3xl">{ready ? t.value : "—"}</p>
            <p className="mt-1 text-xs text-smoke">{t.note}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_22rem]">
        {/* Receita por categoria — barra segmentada fina + tabela */}
        <section className="rounded-2xl border border-white/7 bg-ink-850 p-6">
          <h2 className="font-semibold">Receita por categoria</h2>
          <p className="text-sm text-mist">Valor bruto dos itens em pedidos pagos</p>
          {ready && catTotal > 0 && (
            <>
              <div
                className="mt-6 flex h-2 gap-[2px] overflow-hidden rounded-full"
                role="img"
                aria-label={CATEGORIES.map((c) => `${c.label}: ${brl(byCategory[c.id])} (${Math.round((byCategory[c.id] / catTotal) * 100)}%)`).join("; ")}
              >
                {CATEGORIES.filter((c) => byCategory[c.id] > 0).map((c) => (
                  <span
                    key={c.id}
                    title={`${c.label}: ${brl(byCategory[c.id])}`}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                    style={{ width: `${(byCategory[c.id] / catTotal) * 100}%`, background: c.color }}
                  />
                ))}
              </div>
              <table className="mt-6 w-full text-sm">
                <thead className="sr-only">
                  <tr>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Participação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {CATEGORIES.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3">
                        <span className="flex items-center gap-2.5 text-silver">
                          <span className="size-2.5 rounded-full" style={{ background: c.color }} aria-hidden />
                          {c.label}
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold tabular-nums">{brl(byCategory[c.id])}</td>
                      <td className="w-16 py-3 text-right text-mist tabular-nums">{Math.round((byCategory[c.id] / catTotal) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>

        {/* Atalhos */}
        <section className="rounded-2xl border border-white/7 bg-ink-850 p-6">
          <h2 className="font-semibold">Atalhos</h2>
          <div className="mt-4 space-y-2">
            {[
              { href: "/admin/galerias?nova=1", icon: FolderPlus, title: "Criar galeria de evento", text: "Cadastre o evento e o cliente" },
              { href: "/admin/galerias", icon: Upload, title: "Enviar fotos e vídeos", text: "Faça upload para uma galeria" },
              { href: "/admin/precos", icon: Tag, title: "Ajustar preços", text: "Digitais, impressões e pen drive" },
            ].map((a) => (
              <Link key={a.title} href={a.href} className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/3">
                <span className="grid size-10 place-items-center rounded-xl bg-gold-500/10 text-gold-300">
                  <a.icon className="size-5" strokeWidth={1.5} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-bone">{a.title}</span>
                  <span className="block text-xs text-mist">{a.text}</span>
                </span>
                <ArrowRight className="size-4 text-smoke transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Últimos pedidos */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-white/7 bg-ink-850">
        <div className="flex items-center justify-between px-4 py-5 sm:px-6">
          <h2 className="font-semibold">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="-my-3 py-3 text-sm font-semibold text-gold-300 hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-white/6 text-left text-xs text-smoke">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-6">Pedido</th>
                <th className="hidden px-6 py-3 font-medium sm:table-cell">Cliente</th>
                <th className="hidden px-6 py-3 font-medium md:table-cell">Data</th>
                <th className="px-2 py-3 font-medium sm:px-6">Status</th>
                <th className="px-4 py-3 text-right font-medium sm:px-6">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {ready &&
                orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-white/2">
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <Link
                        href={`/pedido/${o.id}`}
                        className="-my-2 inline-block py-2 font-semibold whitespace-nowrap text-bone hover:text-gold-300"
                      >
                        {o.id}
                      </Link>
                      <p className="max-w-32 truncate text-xs text-smoke sm:hidden">{o.customer.name}</p>
                    </td>
                    <td className="hidden px-6 py-4 text-silver sm:table-cell">{o.customer.name}</td>
                    <td className="hidden px-6 py-4 text-mist tabular-nums md:table-cell">{formatDateShort(o.createdAt)}</td>
                    <td className="px-2 py-3 sm:px-6 sm:py-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap tabular-nums sm:px-6 sm:py-4">
                      {brl(o.total)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
