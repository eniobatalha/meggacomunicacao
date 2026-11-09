"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Barcode, CreditCard, FlaskConical, Lock, MapPin, QrCode, Store, Truck } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Label, Select } from "@/components/ui/form";
import { MercadoPagoMark } from "@/components/ui/icons";
import { MAX_INSTALLMENTS, PIX_DISCOUNT, SHIPPING_OPTIONS } from "@/lib/data/pricing";
import { brl } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/store/auth";
import { cartSubtotal, hasPhysical, lineSubtitle, lineTitle, useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/hydration";
import { newOrderId, useOrders, type Order, type PaymentMethod } from "@/lib/store/orders";
import { PaymentModal } from "./payment-modal";

export function CheckoutView() {
  const hydrated = useHydrated(useCart, useAuth);
  const lines = useCart((s) => s.lines);

  return (
    <div className="pt-[4.5rem]">
      <div className="border-b border-gold-500/20 bg-gold-500/6">
        <p className="container-page flex items-center justify-center gap-2 py-2.5 text-center text-xs text-gold-200">
          <FlaskConical className="size-3.5 shrink-0" />
          Ambiente de demonstração: nenhum pagamento real é processado.
        </p>
      </div>
      <div className="container-page py-12 pb-24">
        <Link href="/carrinho" className="-my-3 inline-block py-3 text-sm text-mist hover:text-gold-300">
          ← Voltar ao carrinho
        </Link>
        <h1 className="mt-4 font-display text-5xl font-medium">Finalizar compra</h1>
        {!hydrated ? (
          <div className="mt-10 h-96 animate-pulse rounded-3xl bg-ink-850" />
        ) : lines.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/7 bg-ink-850 px-6 py-16 text-center">
            <p className="font-display text-3xl">Não há itens para finalizar</p>
            <ButtonLink href="/servicos" className="mt-6">
              Ver serviços
            </ButtonLink>
          </div>
        ) : (
          <CheckoutForm />
        )}
      </div>
    </div>
  );
}

function Step({ n, title, children, aside }: { n: number; title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/7 bg-ink-850 p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 font-semibold">
          <span className="grid size-7 place-items-center rounded-full bg-gold text-xs font-bold text-ink-950">{n}</span>
          {title}
        </h2>
        {aside}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const createOrder = useOrders((s) => s.create);

  const physical = hasPhysical(lines);
  const [customer, setCustomer] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", cpf: "" });
  const [shippingId, setShippingId] = useState<"retirada" | "entrega">("retirada");
  const [address, setAddress] = useState({ cep: "", street: "", number: "", city: "" });
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "", installments: "1" });
  const [pending, setPending] = useState<Order | null>(null);

  const subtotal = cartSubtotal(lines);
  const shipping = physical ? (SHIPPING_OPTIONS.find((s) => s.id === shippingId)?.price ?? 0) : 0;
  const discount = method === "pix" ? Math.round(subtotal * PIX_DISCOUNT * 100) / 100 : 0;
  const total = subtotal - discount + shipping;
  const installments = Number(card.installments);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending({
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      customer: { name: customer.name, email: customer.email.trim().toLowerCase(), phone: customer.phone },
      lines,
      subtotal,
      discount,
      shipping,
      total,
      shippingMethod: physical ? shippingId : null,
      address: physical && shippingId === "entrega" ? address : undefined,
      payment: {
        method,
        installments: method === "cartao" ? installments : undefined,
        cardLast4: method === "cartao" ? card.number.replace(/\D/g, "").slice(-4) || "0000" : undefined,
      },
      status: "aguardando_pagamento",
    });
  }

  function onApproved(order: Order) {
    createOrder({ ...order, status: "pago", paidAt: new Date().toISOString() });
    clear();
    router.push(`/pedido/${order.id}?novo=1`);
  }

  const methods = [
    { id: "pix" as const, icon: QrCode, label: "Pix", hint: `${PIX_DISCOUNT * 100}% off` },
    { id: "cartao" as const, icon: CreditCard, label: "Cartão", hint: `até ${MAX_INSTALLMENTS}x` },
    { id: "boleto" as const, icon: Barcode, label: "Boleto", hint: "à vista" },
  ];

  const digits = card.number.replace(/\D/g, "");
  const brand = digits.startsWith("4") ? "Visa" : /^5[1-5]/.test(digits) ? "Mastercard" : digits.startsWith("3") ? "Amex" : null;

  return (
    <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 items-start gap-8 *:min-w-0 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-6">
        <Step n={1} title="Seus dados" aside={!user && <Link href="/login?next=/checkout" className="text-xs font-semibold text-gold-300 hover:underline">Já tenho conta</Link>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field id="name" label="Nome completo" required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} autoComplete="name" />
            </div>
            <Field
              id="email"
              label="E-mail"
              type="email"
              required
              readOnly={!!user}
              hint={user ? "da sua conta" : undefined}
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              autoComplete="email"
              className={user ? "text-mist" : undefined}
            />
            <Field id="phone" label="WhatsApp" required value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="(81) 90000-0000" autoComplete="tel" />
            <Field id="cpf" label="CPF" required value={customer.cpf} onChange={(e) => setCustomer({ ...customer, cpf: maskCpf(e.target.value) })} placeholder="000.000.000-00" inputMode="numeric" />
          </div>
        </Step>

        {physical && (
          <Step n={2} title="Entrega dos produtos físicos">
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
              {SHIPPING_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={shippingId === o.id}
                  onClick={() => setShippingId(o.id)}
                  className={cn(
                    "flex gap-3 rounded-2xl border p-4 text-left transition-all",
                    shippingId === o.id ? "border-gold-400 bg-gold-500/10" : "border-white/10 hover:border-white/25",
                  )}
                >
                  {o.id === "retirada" ? <Store className="size-5 shrink-0 text-gold-300" /> : <Truck className="size-5 shrink-0 text-gold-300" />}
                  <span className="flex-1">
                    <span className="flex justify-between font-semibold">
                      {o.label}
                      <span className="text-gold-200">{o.price ? brl(o.price) : "Grátis"}</span>
                    </span>
                    <span className="mt-1 block text-xs text-mist">{o.description}</span>
                  </span>
                </button>
              ))}
            </div>
            {shippingId === "entrega" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <Field id="cep" label="CEP" required value={address.cep} onChange={(e) => setAddress({ ...address, cep: e.target.value })} placeholder="00000-000" inputMode="numeric" />
                </div>
                <div className="sm:col-span-4">
                  <Field id="street" label="Endereço" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} autoComplete="street-address" />
                </div>
                <div className="sm:col-span-2">
                  <Field id="number" label="Número" required value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} />
                </div>
                <div className="sm:col-span-4">
                  <Field id="city" label="Cidade / UF" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
              </div>
            )}
            {shippingId === "retirada" && (
              <p className="mt-4 flex items-center gap-2 text-xs text-mist">
                <MapPin className="size-3.5 text-gold-400" /> O endereço do estúdio é enviado junto com o aviso de pedido pronto.
              </p>
            )}
          </Step>
        )}

        <Step
          n={physical ? 3 : 2}
          title="Pagamento"
          aside={
            <span className="flex items-center gap-1.5 text-xs text-smoke">
              <Lock className="size-3.5" /> <MercadoPagoMark className="text-sm" />
            </span>
          }
        >
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Forma de pagamento">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={method === m.id}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-4 transition-all",
                  method === m.id ? "border-gold-400 bg-gold-500/10 text-gold-100" : "border-white/10 text-silver hover:border-white/25",
                )}
              >
                <m.icon className="size-5" strokeWidth={1.6} />
                <span className="text-sm font-semibold">{m.label}</span>
                <span className="text-[0.65rem] text-mist">{m.hint}</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            {method === "pix" && (
              <div className="rounded-2xl bg-ink-800 p-5 text-sm text-mist">
                <p className="font-semibold text-bone">Pague com Pix e ganhe {PIX_DISCOUNT * 100}% de desconto</p>
                <p className="mt-1">
                  Ao confirmar, geramos um QR Code válido por 30 minutos. A aprovação é instantânea e os arquivos digitais
                  são liberados na hora.
                </p>
              </div>
            )}
            {method === "cartao" && (
              <div className="grid gap-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <Field
                    id="cc-number"
                    label="Número do cartão"
                    hint={brand ?? undefined}
                    required
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: maskCard(e.target.value) })}
                  />
                </div>
                <div className="sm:col-span-6">
                  <Field id="cc-name" label="Nome impresso no cartão" required autoComplete="cc-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })} />
                </div>
                <div className="sm:col-span-2">
                  <Field id="cc-exp" label="Validade" required placeholder="MM/AA" inputMode="numeric" autoComplete="cc-exp" value={card.exp} onChange={(e) => setCard({ ...card, exp: maskExp(e.target.value) })} />
                </div>
                <div className="sm:col-span-1">
                  <Field id="cc-cvv" label="CVV" required inputMode="numeric" autoComplete="cc-csc" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })} />
                </div>
                <div className="sm:col-span-3">
                  <Label htmlFor="installments">Parcelas</Label>
                  <Select id="installments" value={card.installments} onChange={(e) => setCard({ ...card, installments: e.target.value })}>
                    {Array.from({ length: MAX_INSTALLMENTS }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}x de {brl(total / n)} sem juros
                      </option>
                    ))}
                  </Select>
                </div>
                <p className="text-xs text-smoke sm:col-span-6">Demonstração: use qualquer número de cartão (ex.: 4111 1111 1111 1111).</p>
              </div>
            )}
            {method === "boleto" && (
              <div className="rounded-2xl bg-ink-800 p-5 text-sm text-mist">
                <p className="font-semibold text-bone">Boleto bancário</p>
                <p className="mt-1">
                  Vencimento em 3 dias úteis. A confirmação pode levar até 2 dias úteis após o pagamento — depois disso,
                  seu pedido entra em produção.
                </p>
              </div>
            )}
          </div>
        </Step>
      </div>

      {/* Resumo */}
      <aside className="sticky top-24 rounded-3xl border border-white/7 bg-ink-850 p-6 sm:p-7">
        <h2 className="font-display text-2xl">Seu pedido</h2>
        <ul className="mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
          {lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-3 text-sm">
              <span className="min-w-0">
                <span className="block truncate text-bone">
                  {l.qty > 1 && <span className="text-gold-300">{l.qty}x </span>}
                  {lineTitle(l)}
                </span>
                <span className="block truncate text-xs text-smoke">{lineSubtitle(l)}</span>
              </span>
              <span className="shrink-0 tabular-nums text-silver">{brl(l.unitPrice * l.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2.5 border-t border-white/6 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-mist">Subtotal</dt>
            <dd className="tabular-nums">{brl(subtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-success">
              <dt>Desconto Pix</dt>
              <dd className="tabular-nums">− {brl(discount)}</dd>
            </div>
          )}
          {physical && (
            <div className="flex justify-between">
              <dt className="text-mist">Entrega</dt>
              <dd className="tabular-nums">{shipping ? brl(shipping) : "Grátis"}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-white/6 pt-4 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="text-2xl font-semibold text-gold-200 tabular-nums">{brl(total)}</dd>
          </div>
          {method === "cartao" && installments > 1 && (
            <p className="text-right text-xs text-mist">
              {installments}x de {brl(total / installments)} sem juros
            </p>
          )}
        </dl>
        <Button type="submit" size="lg" className="mt-6 w-full">
          <Lock className="size-4" />
          {method === "pix" ? "Gerar Pix" : method === "boleto" ? "Gerar boleto" : `Pagar ${brl(total)}`}
        </Button>
        <p className="mt-4 text-center text-[0.7rem] leading-relaxed text-smoke">
          Ao continuar, você concorda com os termos de serviço. Seus dados de pagamento são processados pelo Mercado
          Pago e não ficam armazenados no site.
        </p>
      </aside>

      {pending && <PaymentModal order={pending} onCancel={() => setPending(null)} onApproved={onApproved} />}
    </form>
  );
}

function maskCpf(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskCard(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function maskExp(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 4)
    .replace(/(\d{2})(\d)/, "$1/$2");
}
