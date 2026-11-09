"use client";

import { useState } from "react";
import { Check, Download, HardDrive, Info, MonitorDown, Printer, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QtyStepper } from "@/components/ui/form";
import type { Gallery, MediaItem } from "@/lib/data/galleries";
import { LEAD_TIMES, PRINT_FINISHES, PRINT_SIZES } from "@/lib/data/pricing";
import { brl } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useCart, type MediaFormat } from "@/lib/store/cart";
import { usePricing } from "@/lib/store/studio";
import { toast } from "@/lib/store/toast";

export function PurchasePanel({ gallery, item, unlocked }: { gallery: Gallery; item: MediaItem; unlocked: boolean }) {
  const pricing = usePricing((s) => s.pricing);
  const add = useCart((s) => s.add);
  const isPhoto = item.type === "photo";

  const [format, setFormat] = useState<MediaFormat>(unlocked && isPhoto ? "print" : "digital");
  const [sizeId, setSizeId] = useState("15x21");
  const [finish, setFinish] = useState<"brilho" | "fosco">("brilho");
  const [qty, setQty] = useState(1);

  const size = PRINT_SIZES.find((s) => s.id === sizeId)!;
  const unitPrice =
    format === "print"
      ? pricing.prints[sizeId] ?? size.price
      : format === "pendrive"
        ? pricing.videoPendrive
        : isPhoto
          ? pricing.photoDigital
          : pricing.videoDigital;
  const quantity = format === "digital" ? 1 : qty;
  const total = unitPrice * quantity;
  const minPrint = Math.min(...PRINT_SIZES.map((s) => pricing.prints[s.id] ?? s.price));

  const options = isPhoto
    ? [
        { id: "digital" as const, icon: MonitorDown, title: "Digital", text: "Alta resolução, sem marca d'água", price: brl(pricing.photoDigital), disabled: unlocked },
        { id: "print" as const, icon: Printer, title: "Impressa", text: "Papel fotográfico profissional", price: `a partir de ${brl(minPrint)}`, disabled: false },
      ]
    : [
        { id: "digital" as const, icon: MonitorDown, title: "Digital", text: "Download em Full HD", price: brl(pricing.videoDigital), disabled: unlocked },
        { id: "pendrive" as const, icon: HardDrive, title: "Pen drive", text: "Personalizado + arquivo digital", price: brl(pricing.videoPendrive), disabled: false },
      ];

  function handleAdd() {
    const res = add({
      kind: "media",
      galleryId: gallery.id,
      galleryTitle: gallery.title,
      mediaId: item.id,
      mediaType: item.type,
      thumb: item.type === "video" ? (item.poster ?? item.src) : item.src,
      format,
      sizeId: format === "print" ? sizeId : undefined,
      sizeLabel: format === "print" ? size.label : undefined,
      finish: format === "print" ? finish : undefined,
      unitPrice,
      qty: quantity,
    });
    toast(
      res === "exists"
        ? { title: "Este arquivo digital já está no carrinho", tone: "info", action: { label: "Ver carrinho", href: "/carrinho" } }
        : {
            title: res === "added" ? "Adicionado ao carrinho" : "Quantidade atualizada",
            description:
              format === "print"
                ? `${quantity}x foto ${size.label} · ${finish === "fosco" ? "Fosco" : "Brilho"}`
                : format === "pendrive"
                  ? "Vídeo em pen drive personalizado"
                  : `${isPhoto ? "Foto" : "Vídeo"} digital em alta resolução`,
            action: { label: "Ver carrinho", href: "/carrinho" },
          },
    );
  }

  return (
    <div className="p-5 sm:p-7">
      <p className="eyebrow">{isPhoto ? "Foto" : "Vídeo"} · {gallery.title}</p>
      <h2 className="mt-2 font-display text-3xl">{isPhoto ? "Como você quer esta foto?" : (item.title ?? "Vídeo do evento")}</h2>

      {unlocked && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4">
          <Check className="size-5 shrink-0 text-success" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-bone">Arquivo liberado</p>
            <p className="text-xs text-mist">Você já comprou em digital. Baixe quando quiser.</p>
          </div>
          <a
            href={item.src}
            download
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-success px-4 text-xs font-bold text-ink-950 hover:brightness-110"
          >
            <Download className="size-3.5" /> Baixar
          </a>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Formato">
        {options.map((o) => {
          const active = format === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={o.disabled}
              onClick={() => setFormat(o.id)}
              className={cn(
                "relative rounded-2xl border p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-40",
                active ? "border-gold-400 bg-gold-500/10 shadow-[0_0_0_3px_rgba(212,164,65,0.12)]" : "border-white/10 hover:border-white/25",
              )}
            >
              {active && (
                <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-gold text-ink-950">
                  <Check className="size-3" />
                </span>
              )}
              <o.icon className={cn("size-5", active ? "text-gold-300" : "text-silver")} strokeWidth={1.5} />
              <p className={cn("mt-3 font-semibold", active ? "text-gold-100" : "text-bone")}>{o.title}</p>
              <p className="mt-0.5 text-[0.7rem] leading-snug text-mist">{o.text}</p>
              <p className="mt-2 text-xs font-semibold text-gold-200">{o.price}</p>
            </button>
          );
        })}
      </div>

      {format === "print" && (
        <>
          <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-smoke uppercase">Tamanho</p>
          <div className="mt-3 grid gap-2" role="radiogroup" aria-label="Tamanho da impressão">
            {PRINT_SIZES.map((s) => {
              const active = s.id === sizeId;
              const price = pricing.prints[s.id] ?? s.price;
              const scale = 26 / 60;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSizeId(s.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                    active ? "border-gold-400 bg-gold-500/10" : "border-white/8 hover:border-white/20",
                  )}
                >
                  <span className="grid w-8 shrink-0 place-items-center">
                    <span
                      className={cn("rounded-[2px] border", active ? "border-gold-300 bg-gold-500/30" : "border-silver/50 bg-white/5")}
                      style={{ width: Math.max(9, s.w * scale), height: Math.max(6, s.h * scale) }}
                    />
                  </span>
                  <span className="flex-1">
                    <span className={cn("block text-sm font-semibold", active ? "text-gold-100" : "text-bone")}>{s.label}</span>
                    <span className="block text-[0.7rem] text-smoke">{s.hint}</span>
                  </span>
                  <span className={cn("text-sm font-semibold tabular-nums", active ? "text-gold-200" : "text-silver")}>{brl(price)}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-smoke uppercase">Acabamento</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {PRINT_FINISHES.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={finish === f.id}
                onClick={() => setFinish(f.id)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-left transition-all",
                  finish === f.id ? "border-gold-400 bg-gold-500/10" : "border-white/8 hover:border-white/20",
                )}
              >
                <span className="block text-sm font-semibold">{f.label}</span>
                <span className="block text-[0.7rem] text-smoke">{f.hint}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {format !== "digital" && (
        <div className="mt-7 flex items-center justify-between">
          <span className="text-sm text-silver">Quantidade de cópias</span>
          <QtyStepper value={qty} onChange={setQty} />
        </div>
      )}

      <p className="mt-7 flex gap-2 text-[0.72rem] leading-relaxed text-smoke">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        {format === "digital"
          ? "Liberado sem marca d'água logo após a confirmação do pagamento."
          : format === "print"
            ? `Produção em até ${LEAD_TIMES.print} dias úteis. Retire no estúdio ou receba em casa.`
            : `Produção em até ${LEAD_TIMES.pendrive} dias úteis. O arquivo digital é liberado na hora.`}
      </p>

      {/* Total e ação fixos no rodapé do painel */}
      <div className="sticky bottom-0 -mx-5 mt-5 border-t border-white/7 bg-ink-900/95 px-5 pt-4 pb-5 backdrop-blur sm:-mx-7 sm:px-7 short:flex short:items-center short:gap-4 short:py-3">
        <div className="flex items-baseline justify-between short:flex-col short:items-start">
          <span className="text-sm text-mist short:text-xs">
            Total{format !== "digital" && quantity > 1 ? ` · ${quantity} cópias` : ""}
          </span>
          <span className="text-2xl font-semibold text-gold-200 tabular-nums short:text-xl">{brl(total)}</span>
        </div>
        <Button
          size="lg"
          className="mt-3 w-full short:mt-0 short:flex-1"
          onClick={handleAdd}
          disabled={format === "digital" && unlocked}
        >
          <ShoppingBag className="size-4" /> Adicionar ao carrinho
        </Button>
      </div>
    </div>
  );
}
