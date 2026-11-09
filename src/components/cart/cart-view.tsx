"use client";

import Link from "next/link";
import { ArrowRight, Images, Lock, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { MercadoPagoMark } from "@/components/ui/icons";
import { PIX_DISCOUNT } from "@/lib/data/pricing";
import { brl } from "@/lib/format";
import { cartCount, cartSubtotal, hasPhysical, useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/hydration";
import { CartLineRow } from "./cart-line-row";

export function CartView() {
  const hydrated = useHydrated(useCart);
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);

  const services = lines.filter((l) => l.kind === "service");
  const media = lines.filter((l) => l.kind !== "service");
  const subtotal = cartSubtotal(lines);

  return (
    <div className="pt-[4.5rem]">
      <div className="container-page py-12 pb-24">
        <p className="eyebrow">Carrinho</p>
        <h1 className="mt-3 font-display text-5xl font-medium">Seu carrinho</h1>

        {!hydrated ? (
          <div className="mt-10 h-64 animate-pulse rounded-3xl bg-ink-850" />
        ) : lines.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-white/7 bg-ink-850 px-6 py-20 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-gold-500/10 text-gold-300">
              <ShoppingBag className="size-7" strokeWidth={1.3} />
            </span>
            <p className="mt-6 font-display text-3xl">Seu carrinho está vazio</p>
            <p className="mt-2 max-w-md text-mist">
              Contrate um serviço para o seu próximo evento ou escolha fotos e vídeos na sua galeria.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/servicos">
                <Sparkles className="size-4" /> Ver serviços
              </ButtonLink>
              <ButtonLink href="/cliente" variant="outline">
                <Images className="size-4" /> Minhas galerias
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 items-start gap-8 *:min-w-0 lg:grid-cols-[1fr_24rem]">
            <div className="space-y-6">
              {services.length > 0 && (
                <section className="rounded-3xl border border-white/7 bg-ink-850 px-5 sm:px-7">
                  <h2 className="flex items-center gap-2 border-b border-white/6 py-5 font-semibold">
                    <Sparkles className="size-4 text-gold-400" /> Serviços
                  </h2>
                  <div className="divide-y divide-white/6">
                    {services.map((l) => (
                      <CartLineRow key={l.key} line={l} />
                    ))}
                  </div>
                </section>
              )}
              {media.length > 0 && (
                <section className="rounded-3xl border border-white/7 bg-ink-850 px-5 sm:px-7">
                  <h2 className="flex items-center gap-2 border-b border-white/6 py-5 font-semibold">
                    <Images className="size-4 text-gold-400" /> Fotos e vídeos
                  </h2>
                  <div className="divide-y divide-white/6">
                    {media.map((l) => (
                      <CartLineRow key={l.key} line={l} />
                    ))}
                  </div>
                </section>
              )}
              <div className="-my-2 flex justify-between text-sm">
                <Link href="/servicos" className="inline-block py-2 text-mist hover:text-gold-300">
                  ← Continuar comprando
                </Link>
                <button type="button" onClick={clear} className="py-2 text-smoke hover:text-danger">
                  Esvaziar carrinho
                </button>
              </div>
            </div>

            <aside className="sticky top-24 rounded-3xl border border-white/7 bg-ink-850 p-6 sm:p-7">
              <h2 className="font-display text-2xl">Resumo</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-mist">Itens ({cartCount(lines)})</dt>
                  <dd className="tabular-nums">{brl(subtotal)}</dd>
                </div>
                {hasPhysical(lines) && (
                  <div className="flex justify-between">
                    <dt className="text-mist">Entrega</dt>
                    <dd className="text-smoke">calculada no checkout</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/6 pt-4 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="text-xl font-semibold text-gold-200 tabular-nums">{brl(subtotal)}</dd>
                </div>
                <p className="rounded-xl bg-success/10 px-3 py-2 text-xs text-success">
                  No Pix: {brl(subtotal * (1 - PIX_DISCOUNT))} ({PIX_DISCOUNT * 100}% de desconto)
                </p>
              </dl>
              <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
                Finalizar compra <ArrowRight className="size-4" />
              </ButtonLink>
              <div className="mt-6 space-y-2 border-t border-white/6 pt-5 text-xs text-smoke">
                <p className="flex items-center gap-2">
                  <Lock className="size-3.5 text-gold-500" /> Pagamento processado com segurança por{" "}
                  <MercadoPagoMark className="text-[0.8rem]" />
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-gold-500" /> Pix, cartão em até 10x ou boleto
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
