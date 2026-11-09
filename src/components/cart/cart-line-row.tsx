"use client";

import Image from "next/image";
import { CalendarDays, Trash } from "lucide-react";
import { MediaImage } from "@/components/gallery/media-image";
import { Watermark } from "@/components/gallery/watermark";
import { QtyStepper } from "@/components/ui/form";
import { brl, formatDate } from "@/lib/format";
import { lineSubtitle, lineTitle, useCart, type CartLine } from "@/lib/store/cart";

export function CartLineRow({ line, readOnly = false }: { line: CartLine; readOnly?: boolean }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const fixedQty = line.kind === "pack" || (line.kind === "media" && line.format === "digital");
  const img = line.kind === "service" ? line.image : line.thumb;

  return (
    <div className="flex gap-4 py-5">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-ink-700 sm:size-24">
        {line.kind === "service" ? (
          <Image src={img} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <>
            <MediaImage src={img} alt="" fill sizes="96px" className="object-cover" />
            <Watermark compact className="[&>div:last-child]:hidden" />
          </>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-bone">{lineTitle(line)}</p>
            <p className="mt-0.5 text-sm text-mist">{lineSubtitle(line)}</p>
            {line.kind === "service" && line.eventDate && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gold-300">
                <CalendarDays className="size-3.5" /> Evento em {formatDate(`${line.eventDate}T12:00:00-03:00`)}
              </p>
            )}
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={() => remove(line.key)}
              className="grid size-8 shrink-0 place-items-center rounded-full text-smoke transition-colors hover:bg-danger/10 hover:text-danger"
              aria-label="Remover item"
            >
              <Trash className="size-4" />
            </button>
          )}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          {readOnly || fixedQty ? (
            <span className="text-xs text-smoke">
              {line.qty}x {brl(line.unitPrice)}
            </span>
          ) : (
            <QtyStepper size="sm" value={line.qty} onChange={(v) => setQty(line.key, v)} />
          )}
          <span className="font-semibold text-gold-200 tabular-nums">{brl(line.unitPrice * line.qty)}</span>
        </div>
      </div>
    </div>
  );
}
