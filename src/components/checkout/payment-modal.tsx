"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, FlaskConical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MercadoPagoMark } from "@/components/ui/icons";
import { brl } from "@/lib/format";
import type { Order } from "@/lib/store/orders";

type Stage = "processing" | "pix" | "boleto" | "approved";

/** Simula o fluxo do Checkout do Mercado Pago (Pix, cartão e boleto). */
export function PaymentModal({ order, onCancel, onApproved }: { order: Order; onCancel: () => void; onApproved: (o: Order) => void }) {
  const [stage, setStage] = useState<Stage>("processing");
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(30 * 60);
  const method = order.payment.method;

  // Etapa 1: "conectando ao Mercado Pago"
  useEffect(() => {
    const t = setTimeout(() => setStage(method === "pix" ? "pix" : method === "boleto" ? "boleto" : "approved"), 1600);
    return () => clearTimeout(t);
  }, [method]);

  // Contagem regressiva do Pix
  useEffect(() => {
    if (stage !== "pix") return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [stage]);

  // Aprovado → cria o pedido e redireciona
  useEffect(() => {
    if (stage !== "approved") return;
    const t = setTimeout(() => onApproved(order), 1400);
    return () => clearTimeout(t);
  }, [stage, order, onApproved]);

  const amount = order.total.toFixed(2);
  const pixCode = `00020126580014br.gov.bcb.pix0136megga-demo-${order.id.toLowerCase()}52040000530398654${String(amount.length).padStart(2, "0")}${amount}5802BR5917MEGGA COMUNICACAO6006RECIFE62110507${order.id.replace("-", "")}6304DEMO`;
  const boletoLine = `23793.38128 60000.${order.id.slice(3)}0 00000.000000 1 ${String(Math.round(order.total * 100)).padStart(10, "0")}`;

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* navegador sem permissão — ignora na demonstração */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Pagamento">
      <div className="relative w-full max-w-md animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-ink-850 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/7 px-6 py-4">
          <MercadoPagoMark className="text-lg" />
          {stage !== "approved" && stage !== "processing" && (
            <button type="button" onClick={onCancel} className="text-smoke hover:text-bone" aria-label="Cancelar pagamento">
              <X className="size-5" />
            </button>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {stage === "processing" && (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="size-14 animate-spin rounded-full border-[3px] border-[#00b1ea]/20 border-t-[#00b1ea]" />
              <p className="mt-6 font-semibold">{method === "cartao" ? "Processando pagamento…" : "Conectando ao Mercado Pago…"}</p>
              <p className="mt-1 text-sm text-mist">Não feche esta janela.</p>
            </div>
          )}

          {stage === "pix" && (
            <div className="text-center">
              <p className="text-sm text-mist">Pedido {order.id}</p>
              <p className="mt-1 text-3xl font-semibold text-gold-200">{brl(order.total)}</p>
              <div className="mx-auto mt-6 w-fit rounded-2xl bg-white p-4">
                <QRCodeSVG value={pixCode} size={196} level="M" />
              </div>
              <p className="mt-4 text-xs text-mist">
                Escaneie com o app do seu banco · expira em{" "}
                <span className="font-semibold text-bone tabular-nums">
                  {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
                </span>
              </p>
              <button
                type="button"
                onClick={() => copy(pixCode)}
                className="mt-4 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-left text-xs text-silver hover:border-gold-500/40"
              >
                <span className="flex-1 truncate font-mono">{pixCode}</span>
                <span className="flex shrink-0 items-center gap-1 font-semibold text-gold-300">
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? "Copiado" : "Copiar"}
                </span>
              </button>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-mist">
                <span className="size-2 animate-pulse rounded-full bg-[#00b1ea]" /> Aguardando pagamento…
              </div>
              <DemoApprove onClick={() => setStage("approved")} label="Simular Pix pago" />
            </div>
          )}

          {stage === "boleto" && (
            <div className="text-center">
              <p className="text-sm text-mist">Boleto do pedido {order.id}</p>
              <p className="mt-1 text-3xl font-semibold text-gold-200">{brl(order.total)}</p>
              <div className="mt-6 flex h-16 items-end justify-center gap-[2px] rounded-xl bg-white px-4 py-3" aria-hidden>
                {Array.from({ length: 64 }).map((_, i) => (
                  <span key={i} className="h-full bg-black" style={{ width: (i * 7) % 3 === 0 ? 3 : 1 }} />
                ))}
              </div>
              <button
                type="button"
                onClick={() => copy(boletoLine)}
                className="mt-4 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-left text-xs text-silver hover:border-gold-500/40"
              >
                <span className="flex-1 truncate font-mono">{boletoLine}</span>
                <span className="flex shrink-0 items-center gap-1 font-semibold text-gold-300">
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? "Copiado" : "Copiar"}
                </span>
              </button>
              <p className="mt-4 text-xs text-mist">Vencimento em 3 dias úteis. Compensação em até 2 dias úteis.</p>
              <DemoApprove onClick={() => setStage("approved")} label="Simular boleto compensado" />
            </div>
          )}

          {stage === "approved" && (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="grid size-16 animate-fade-up place-items-center rounded-full bg-success text-ink-950">
                <Check className="size-8" strokeWidth={3} />
              </span>
              <p className="mt-6 font-display text-3xl">Pagamento aprovado!</p>
              <p className="mt-1 text-sm text-mist">Redirecionando para o seu pedido…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DemoApprove({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-gold-500/30 bg-gold-500/5 p-4">
      <p className="flex items-center justify-center gap-1.5 text-[0.7rem] font-semibold tracking-wider text-gold-300 uppercase">
        <FlaskConical className="size-3.5" /> Demonstração
      </p>
      <Button type="button" size="sm" className="mt-3 w-full" onClick={onClick}>
        {label}
      </Button>
    </div>
  );
}
