"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { CalendarCheck, Check, Clock, Download, HardDrive, Images, Printer, Receipt, Sparkles, Store, Truck } from "lucide-react";
import { CartLineRow } from "@/components/cart/cart-line-row";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { LEAD_TIMES } from "@/lib/data/pricing";
import { addBusinessDays, brl, formatDate, formatDateTime, formatWeekday, pluralize } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/store/hydration";
import { useOrders, type Order, type OrderStatus } from "@/lib/store/orders";
import { whatsappLink } from "@/lib/site";

export function OrderView() {
  const { id } = useParams<{ id: string }>();
  const isNew = useSearchParams().get("novo") === "1";
  const hydrated = useHydrated(useOrders);
  const order = useOrders((s) => s.orders.find((o) => o.id === id));

  if (!hydrated) return <div className="container-page min-h-[60svh] pt-32 text-mist">Carregando pedido…</div>;
  if (!order) {
    return (
      <div className="container-page grid min-h-[70svh] place-items-center pt-24 text-center">
        <div>
          <Receipt className="mx-auto size-10 text-gold-400" strokeWidth={1.3} />
          <h1 className="mt-5 font-display text-4xl">Pedido não encontrado</h1>
          <p className="mt-2 text-mist">Confira o número do pedido ou acesse sua área do cliente.</p>
          <ButtonLink href="/cliente" className="mt-8">
            Minha área
          </ButtonLink>
        </div>
      </div>
    );
  }
  return <OrderDetails order={order} isNew={isNew} />;
}

function OrderDetails({ order, isNew }: { order: Order; isNew: boolean }) {
  const base = new Date(order.paidAt ?? order.createdAt);
  const digital = order.lines.filter((l) => l.kind === "pack" || (l.kind === "media" && l.format === "digital"));
  const prints = order.lines.filter((l) => l.kind === "media" && l.format === "print");
  const pendrives = order.lines.filter((l) => l.kind === "media" && l.format === "pendrive");
  const services = order.lines.filter((l) => l.kind === "service");
  const physical = prints.length + pendrives.length > 0;
  const galleryIds = [...new Set(order.lines.flatMap((l) => (l.kind === "service" ? [] : [l.galleryId])))];

  const productionDays = pendrives.length ? LEAD_TIMES.pendrive : LEAD_TIMES.print;
  const readyAt = addBusinessDays(base, productionDays).toISOString();
  const deliveredAt = addBusinessDays(base, productionDays + LEAD_TIMES.shipping).toISOString();
  const waMessage = `Olá! Gostaria de falar sobre o meu pedido ${order.id}.`;

  return (
    <div className="pt-[4.5rem]">
      <section className="relative overflow-hidden border-b border-white/6 bg-ink-950">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-gold-500/8 blur-3xl" />
        <div className="container-page relative py-12 sm:py-16">
          {isNew ? (
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <span className="grid size-16 shrink-0 animate-fade-up place-items-center rounded-full bg-success text-ink-950">
                <Check className="size-8" strokeWidth={3} />
              </span>
              <div>
                <p className="eyebrow text-success">Pagamento aprovado</p>
                <h1 className="mt-2 font-display text-4xl font-medium sm:text-5xl">
                  Obrigado, {order.customer.name.split(" ")[0]}! Seu pedido está confirmado.
                </h1>
              </div>
            </div>
          ) : (
            <>
              <p className="eyebrow">Detalhes do pedido</p>
              <h1 className="mt-2 font-display text-5xl font-medium">Pedido {order.id}</h1>
            </>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mist">
            {isNew && <span className="font-semibold text-bone">Pedido {order.id}</span>}
            <StatusBadge status={order.status} />
            <span>Realizado em {formatDateTime(order.createdAt)}</span>
            <span>
              {order.payment.method === "pix"
                ? "Pago com Pix"
                : order.payment.method === "boleto"
                  ? "Pago com boleto"
                  : `Cartão final ${order.payment.cardLast4} · ${order.payment.installments}x`}
            </span>
          </div>
          {isNew && (
            <p className="mt-4 max-w-2xl text-mist">
              Enviamos a confirmação para <strong className="text-bone">{order.customer.email}</strong>. Veja abaixo o que
              acontece a partir de agora.
            </p>
          )}
        </div>
      </section>

      <div className="container-page grid grid-cols-1 items-start gap-8 py-12 pb-24 *:min-w-0 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <h2 className="font-display text-3xl">Próximos passos</h2>

          {digital.length > 0 && (
            <NextStep
              icon={<Download className="size-5" />}
              tone="green"
              title="Arquivos digitais liberados"
              badge="Disponível agora"
            >
              <p>
                {digital.some((l) => l.kind === "pack")
                  ? "Todas as fotos do pacote já estão sem marca d'água na sua galeria."
                  : `${digital.length} ${digital.length === 1 ? "arquivo já está" : "arquivos já estão"} sem marca d'água na sua galeria.`}{" "}
                Baixe em alta resolução quando quiser — o acesso fica disponível até a data de expiração da galeria.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {galleryIds.map((gid) => (
                  <ButtonLink key={gid} href={`/cliente/galeria/${gid}`} size="sm">
                    <Images className="size-4" /> Abrir galeria
                  </ButtonLink>
                ))}
              </div>
            </NextStep>
          )}

          {physical && (
            <NextStep
              icon={pendrives.length ? <HardDrive className="size-5" /> : <Printer className="size-5" />}
              tone="gold"
              title={
                prints.length && pendrives.length
                  ? "Fotos impressas e pen drive em produção"
                  : prints.length
                    ? "Fotos impressas em produção"
                    : "Pen drive personalizado em produção"
              }
              badge={`Até ${productionDays} dias úteis`}
            >
              <p>
                {prints.length > 0 &&
                  `${pluralize(prints.reduce((s, l) => s + l.qty, 0), "cópia", "cópias")} em papel fotográfico profissional, com conferência de cor uma a uma. `}
                {pendrives.length > 0 && "O pen drive é gravado e embalado para presente. "}
                Previsão de conclusão: <strong className="text-bone">{formatWeekday(readyAt)}</strong>.
              </p>
              <div className="mt-4 flex gap-3 rounded-2xl bg-ink-800 p-4">
                {order.shippingMethod === "entrega" ? (
                  <>
                    <Truck className="size-5 shrink-0 text-gold-300" />
                    <div className="text-sm">
                      <p className="font-semibold text-bone">Entrega no endereço</p>
                      <p className="text-mist">
                        {order.address ? `${order.address.street}, ${order.address.number} — ${order.address.city}. ` : ""}O
                        código de rastreio chega por e-mail e WhatsApp. Previsão de entrega:{" "}
                        <strong className="text-bone">{formatDate(deliveredAt)}</strong>.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Store className="size-5 shrink-0 text-gold-300" />
                    <div className="text-sm">
                      <p className="font-semibold text-bone">Retirada no estúdio</p>
                      <p className="text-mist">
                        Avisaremos pelo WhatsApp {order.customer.phone} assim que estiver pronto, com endereço e horários
                        de retirada. Leve um documento com foto ou o número do pedido.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </NextStep>
          )}

          {services.length > 0 && (
            <NextStep icon={<CalendarCheck className="size-5" />} tone="blue" title="Agendamento dos serviços" badge="Contato em até 24h">
              <p>Nossa equipe vai falar com você pelo WhatsApp para confirmar a data, o horário, o local e os detalhes do evento.</p>
              <ul className="mt-4 space-y-2">
                {services.map((l) =>
                  l.kind === "service" ? (
                    <li key={l.key} className="flex items-center gap-3 rounded-xl bg-ink-800 px-4 py-3 text-sm">
                      <Sparkles className="size-4 shrink-0 text-gold-400" />
                      <span className="flex-1">
                        <span className="font-semibold text-bone">{l.title}</span>
                        <span className="text-mist"> · {l.packageName}</span>
                      </span>
                      <span className="text-xs text-gold-300">
                        {l.eventDate ? formatDate(`${l.eventDate}T12:00:00-03:00`) : "data a definir"}
                      </span>
                    </li>
                  ) : null,
                )}
              </ul>
            </NextStep>
          )}

          <Timeline order={order} physical={physical} hasServices={services.length > 0} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-white/7 bg-ink-850 px-6 pb-2 sm:px-7">
            <h2 className="border-b border-white/6 py-5 font-display text-2xl">Itens</h2>
            <div className="divide-y divide-white/6">
              {order.lines.map((l) => (
                <CartLineRow key={l.key} line={l} readOnly />
              ))}
            </div>
            <dl className="space-y-2 border-t border-white/6 py-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-mist">Subtotal</dt>
                <dd>{brl(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Desconto</dt>
                  <dd>− {brl(order.discount)}</dd>
                </div>
              )}
              {order.shippingMethod && (
                <div className="flex justify-between">
                  <dt className="text-mist">Entrega</dt>
                  <dd>{order.shipping ? brl(order.shipping) : "Grátis"}</dd>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base">
                <dt className="font-semibold">Total pago</dt>
                <dd className="text-xl font-semibold text-gold-200">{brl(order.total)}</dd>
              </div>
            </dl>
          </div>
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-3xl border border-white/7 bg-ink-850 p-5 transition-colors hover:border-[#25D366]/50"
          >
            <span className="grid size-11 place-items-center rounded-full bg-[#25D366] text-[#06210f]">
              <WhatsAppIcon className="size-5" />
            </span>
            <span className="text-sm">
              <span className="block font-semibold text-bone">Dúvidas sobre o pedido?</span>
              <span className="text-mist">Fale com a equipe no WhatsApp</span>
            </span>
          </a>
          <Link href="/cliente" className="block py-3 text-center text-sm text-mist hover:text-gold-300">
            Ver todos os meus pedidos →
          </Link>
        </aside>
      </div>
    </div>
  );
}

const TONES = {
  green: "bg-success/12 text-success",
  gold: "bg-gold-500/12 text-gold-300",
  blue: "bg-info/12 text-info",
};

function NextStep({ icon, title, badge, tone, children }: { icon: ReactNode; title: string; badge: string; tone: keyof typeof TONES; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/7 bg-ink-850 p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-4">
        <span className={cn("grid size-11 place-items-center rounded-2xl", TONES[tone])}>{icon}</span>
        <h3 className="flex-1 text-lg font-semibold text-bone">{title}</h3>
        <span className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", TONES[tone])}>
          <Clock className="size-3.5" /> {badge}
        </span>
      </div>
      <div className="mt-4 text-sm leading-relaxed text-mist">{children}</div>
    </section>
  );
}

const FLOW: OrderStatus[] = ["pago", "em_producao", "pronto", "concluido"];

function Timeline({ order, physical, hasServices }: { order: Order; physical: boolean; hasServices: boolean }) {
  const steps = [
    { id: "pago", label: "Pagamento aprovado" },
    { id: "em_producao", label: physical ? "Em produção" : hasServices ? "Agendamento" : "Arquivos liberados" },
    { id: "pronto", label: order.shippingMethod === "entrega" ? "Enviado" : physical ? "Pronto para retirada" : hasServices ? "Evento realizado" : "Disponível" },
    { id: "concluido", label: "Concluído" },
  ];
  const statusIndex = Math.max(0, FLOW.indexOf(order.status === "enviado" ? "pronto" : order.status));

  return (
    <section className="rounded-3xl border border-white/7 bg-ink-850 p-6 sm:p-7">
      <h3 className="font-semibold text-bone">Acompanhamento</h3>
      <ol className="mt-6 grid gap-4 sm:grid-cols-4 sm:gap-2">
        {steps.map((s, i) => {
          const done = i <= statusIndex;
          return (
            <li key={s.id} className="flex items-center gap-3 sm:flex-col sm:items-start">
              <div className="flex w-full items-center gap-2">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold",
                    done ? "bg-gold text-ink-950" : "border border-white/15 text-smoke",
                  )}
                >
                  {done ? <Check className="size-4" /> : i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span className={cn("hidden h-px flex-1 sm:block", i < statusIndex ? "bg-gold-500" : "bg-white/10")} />
                )}
              </div>
              <span className={cn("text-sm", done ? "font-semibold text-bone" : "text-smoke")}>{s.label}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
