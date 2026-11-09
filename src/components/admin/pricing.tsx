"use client";

import { useState } from "react";
import { HardDrive, MonitorDown, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRINT_SIZES } from "@/lib/data/pricing";
import { brl } from "@/lib/format";
import { useHydrated } from "@/lib/store/hydration";
import { usePricing } from "@/lib/store/studio";
import { toast } from "@/lib/store/toast";
import { AdminTitle } from "./admin-shell";

/** Campo de preço em reais: aceita vírgula e salva ao sair do campo. */
function PriceInput({ value, onCommit, label }: { value: number; onCommit: (v: number) => void; label: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? value.toFixed(2).replace(".", ",");
  return (
    <label className="flex h-11 w-32 shrink-0 cursor-text items-center rounded-lg border border-white/10 bg-ink-800 focus-within:border-gold-500/70 pointer-fine:h-10">
      <span className="pl-3 text-xs text-smoke">R$</span>
      <input
        aria-label={label}
        inputMode="decimal"
        value={shown}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d,.]/g, ""))}
        onBlur={() => {
          if (draft === null) return;
          const n = Number(draft.replace(/\./g, "").replace(",", "."));
          if (!Number.isNaN(n) && n >= 0 && n !== value) {
            onCommit(Math.round(n * 100) / 100);
            toast({ title: "Preço atualizado", description: `${label}: ${brl(n)}` });
          }
          setDraft(null);
        }}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        className="h-full w-full min-w-0 bg-transparent px-2 text-right text-base font-semibold tabular-nums outline-none pointer-fine:text-sm"
      />
    </label>
  );
}

export function AdminPricing() {
  const ready = useHydrated(usePricing);
  const pricing = usePricing((s) => s.pricing);
  const update = usePricing((s) => s.update);
  const setPrint = usePricing((s) => s.setPrint);
  const reset = usePricing((s) => s.reset);

  return (
    <>
      <AdminTitle
        title="Preços"
        subtitle="Os valores são aplicados na hora nas galerias dos clientes."
        action={
          <Button
            variant="dark"
            size="sm"
            onClick={() => {
              reset();
              toast({ title: "Preços restaurados", description: "Valores padrão da demonstração.", tone: "info" });
            }}
          >
            <RotateCcw className="size-4" /> Restaurar padrão
          </Button>
        }
      />

      {!ready ? (
        <div className="h-96 animate-pulse rounded-2xl bg-ink-850" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-white/7 bg-ink-850 p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <MonitorDown className="size-4 text-gold-400" /> Arquivos digitais
            </h2>
            <div className="mt-5 divide-y divide-white/6">
              <Row title="Foto digital" text="Alta resolução, sem marca d'água">
                <PriceInput label="Foto digital" value={pricing.photoDigital} onCommit={(v) => update({ photoDigital: v })} />
              </Row>
              <Row title="Vídeo digital" text="Download em Full HD">
                <PriceInput label="Vídeo digital" value={pricing.videoDigital} onCommit={(v) => update({ videoDigital: v })} />
              </Row>
            </div>

            <h2 className="mt-8 flex items-center gap-2 font-semibold">
              <HardDrive className="size-4 text-gold-400" /> Produtos físicos de vídeo
            </h2>
            <div className="mt-5 divide-y divide-white/6">
              <Row title="Pen drive personalizado" text="Inclui o arquivo digital">
                <PriceInput label="Pen drive" value={pricing.videoPendrive} onCommit={(v) => update({ videoPendrive: v })} />
              </Row>
            </div>
            <p className="mt-6 rounded-xl bg-ink-800 p-4 text-xs leading-relaxed text-mist">
              O pacote digital completo é definido em cada galeria, no momento da criação.
            </p>
          </section>

          <section className="rounded-2xl border border-white/7 bg-ink-850 p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <Printer className="size-4 text-gold-400" /> Fotos impressas
            </h2>
            <div className="mt-5 divide-y divide-white/6">
              {PRINT_SIZES.map((s) => (
                <Row key={s.id} title={s.label} text={s.hint}>
                  <PriceInput label={`Impressão ${s.label}`} value={pricing.prints[s.id] ?? s.price} onCommit={(v) => setPrint(s.id, v)} />
                </Row>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function Row({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-sm font-semibold text-bone">{title}</p>
        <p className="text-xs text-smoke">{text}</p>
      </div>
      {children}
    </div>
  );
}
