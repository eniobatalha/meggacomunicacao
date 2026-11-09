"use client";

import { useState } from "react";
import { CalendarDays, Check, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, QtyStepper } from "@/components/ui/form";
import type { Service } from "@/lib/data/services";
import { brl } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/store/cart";
import { toast } from "@/lib/store/toast";

export function ServicePackages({ service }: { service: Service }) {
  const add = useCart((s) => s.add);
  const [eventDate, setEventDate] = useState("");
  const [qty, setQty] = useState<Record<string, number>>({});

  function handleAdd(packageId: string) {
    const pkg = service.packages.find((p) => p.id === packageId)!;
    const quantity = pkg.unit ? (qty[pkg.id] ?? 1) : 1;
    const result = add({
      kind: "service",
      serviceSlug: service.slug,
      packageId: pkg.id,
      title: service.title,
      packageName: pkg.name,
      unit: pkg.unit,
      image: service.image,
      unitPrice: pkg.price,
      qty: quantity,
      eventDate: eventDate || undefined,
    });
    toast({
      title: result === "added" ? "Adicionado ao carrinho" : "Quantidade atualizada",
      description: `${service.title} · ${pkg.name}`,
      action: { label: "Ver carrinho", href: "/carrinho" },
    });
  }

  return (
    <div>
      {service.needsEventDate && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/7 bg-ink-850/70 p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor={`date-${service.slug}`} hint="opcional">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-3.5 text-gold-400" /> Data do evento
              </span>
            </Label>
            <Input
              id={`date-${service.slug}`}
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="[color-scheme:dark]"
            />
          </div>
          <p className="text-xs leading-relaxed text-smoke sm:max-w-56">
            Confirmamos a disponibilidade da data pelo WhatsApp logo após o pedido.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {service.packages.map((p) => (
          <div
            key={p.id}
            className={cn(
              "relative flex flex-col rounded-3xl border p-6 transition-colors",
              p.highlight
                ? "border-gold-500/50 bg-gradient-to-b from-gold-500/9 to-ink-850"
                : "border-white/7 bg-ink-850 hover:border-white/15",
            )}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[0.65rem] font-bold tracking-wider text-ink-950 uppercase">
                <Sparkles className="size-3" /> Mais escolhido
              </span>
            )}
            <p className="font-display text-2xl text-bone">{p.name}</p>
            <p className="mt-3">
              <span className="text-3xl font-semibold tracking-tight text-gold-200">{brl(p.price)}</span>
              {p.unit && <span className="ml-1.5 text-sm text-mist">{p.unit}</span>}
            </p>
            <ul className="mt-5 flex-1 space-y-2.5 border-t border-white/6 pt-5">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-silver">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold-400" />
                  {f}
                </li>
              ))}
            </ul>
            {p.unit && (
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-mist">Quantidade</span>
                <QtyStepper size="sm" value={qty[p.id] ?? 1} onChange={(v) => setQty({ ...qty, [p.id]: v })} />
              </div>
            )}
            <Button
              variant={p.highlight ? "gold" : "dark"}
              className="mt-6 w-full"
              onClick={() => handleAdd(p.id)}
            >
              <ShoppingBag className="size-4" /> Adicionar ao carrinho
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
