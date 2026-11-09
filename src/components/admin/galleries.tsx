"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, Film, FolderPlus, Images, KeyRound, Mail, X } from "lucide-react";
import { MediaImage } from "@/components/gallery/media-image";
import { Button } from "@/components/ui/button";
import { Field, Label, Select } from "@/components/ui/form";
import type { EventType, Gallery } from "@/lib/data/galleries";
import { brl, formatDateShort } from "@/lib/format";
import { useHydrated } from "@/lib/store/hydration";
import { useAllGalleries, useStudio } from "@/lib/store/studio";
import { toast } from "@/lib/store/toast";
import { AdminTitle } from "./admin-shell";

const EVENT_TYPES: EventType[] = ["Casamento", "Formatura", "Aniversário", "15 anos", "Corporativo", "Escolar", "Outro"];

export function AdminGalleries() {
  const params = useSearchParams();
  const [creating, setCreating] = useState(params.get("nova") === "1");
  const ready = useHydrated(useStudio);
  const galleries = useAllGalleries();

  return (
    <>
      <AdminTitle
        title="Galerias"
        subtitle="Cada evento tem sua galeria privada, com prévias protegidas por marca d'água."
        action={
          !creating && (
            <Button onClick={() => setCreating(true)}>
              <FolderPlus className="size-4" /> Nova galeria
            </Button>
          )
        }
      />

      {creating && <CreateGalleryForm onClose={() => setCreating(false)} />}

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {!ready && Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-ink-850" />)}
        {ready &&
          galleries.map((g, i) => {
            const photos = g.items.filter((m) => m.type === "photo").length;
            const videos = g.items.length - photos;
            return (
              <Link
                key={g.id}
                href={`/admin/galerias/${g.id}`}
                className="group overflow-hidden rounded-2xl border border-white/7 bg-ink-850 transition-colors hover:border-gold-500/40"
              >
                <div className="relative aspect-[16/8] overflow-hidden bg-ink-700">
                  {g.cover ? (
                    <MediaImage
                      src={g.cover}
                      alt=""
                      fill
                      sizes="(min-width: 1536px) 30rem, 50vw"
                      eager={i < 4}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-smoke">
                      <Images className="size-8" strokeWidth={1.2} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-850 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-gold-200 uppercase">
                    {g.eventType}
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-semibold text-bone">{g.title}</p>
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-mist">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-gold-500" /> {formatDateShort(g.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="size-3.5 text-gold-500" /> {g.accessCode}
                    </span>
                    <span className="col-span-2 flex items-center gap-1.5 truncate">
                      <Mail className="size-3.5 shrink-0 text-gold-500" /> {g.ownerEmail ?? "Acesso por código"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-3 text-sm">
                    <span className="flex gap-3 text-silver">
                      <span className="flex items-center gap-1">
                        <Images className="size-4 text-smoke" /> {photos}
                      </span>
                      <span className="flex items-center gap-1">
                        <Film className="size-4 text-smoke" /> {videos}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-gold-300">
                      Gerenciar <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </>
  );
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function CreateGalleryForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const createGallery = useStudio((s) => s.createGallery);
  const [form, setForm] = useState({
    title: "",
    eventType: "Casamento" as EventType,
    date: "",
    location: "",
    ownerEmail: "",
    accessCode: "",
    digitalPackPrice: "89.90",
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const suffix = Math.random().toString(36).slice(2, 6);
    const id = `${slugify(form.title) || "galeria"}-${suffix}`;
    const date = new Date(`${form.date}T12:00:00-03:00`);
    const expires = new Date(date);
    expires.setMonth(expires.getMonth() + 6);
    const code = (form.accessCode || slugify(form.title).replace(/-/g, "").slice(0, 6) + suffix.slice(0, 2)).toUpperCase();
    const gallery: Gallery = {
      id,
      title: form.title.trim(),
      eventType: form.eventType,
      date: date.toISOString(),
      location: form.location.trim(),
      ownerEmail: form.ownerEmail.trim().toLowerCase() || undefined,
      accessCode: code,
      cover: "",
      expiresAt: expires.toISOString(),
      digitalPackPrice: Number(form.digitalPackPrice.replace(",", ".")) || 0,
      items: [],
    };
    createGallery(gallery);
    toast({ title: "Galeria criada", description: "Agora envie as fotos e vídeos do evento." });
    router.push(`/admin/galerias/${id}`);
  }

  return (
    <form onSubmit={onSubmit} className="mb-8 animate-fade-up rounded-2xl border border-gold-500/30 bg-ink-850 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-3xl">Nova galeria</h2>
          <p className="text-sm text-mist">Depois de criar, você poderá enviar as fotos e vídeos.</p>
        </div>
        <button type="button" onClick={onClose} className="text-smoke hover:text-bone" aria-label="Fechar">
          <X className="size-5" />
        </button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-6">
        <div className="md:col-span-4">
          <Field id="g-title" label="Nome do evento" required placeholder="Ex.: Casamento Ana & Pedro" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="g-type">Tipo</Label>
          <Select id="g-type" value={form.eventType} onChange={(e) => set("eventType", e.target.value)}>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Field id="g-date" label="Data do evento" type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} className="[color-scheme:dark]" />
        </div>
        <div className="md:col-span-4">
          <Field id="g-location" label="Local" required value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div className="md:col-span-3">
          <Field
            id="g-email"
            label="E-mail do cliente"
            hint="opcional"
            type="email"
            placeholder="cliente@email.com"
            value={form.ownerEmail}
            onChange={(e) => set("ownerEmail", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Field
            id="g-code"
            label="Código de acesso"
            hint="automático se vazio"
            value={form.accessCode}
            onChange={(e) => set("accessCode", e.target.value.toUpperCase())}
            className="uppercase"
          />
        </div>
        <div className="md:col-span-1">
          <Field id="g-pack" label="Pacote digital" hint="R$" inputMode="decimal" value={form.digitalPackPrice} onChange={(e) => set("digitalPackPrice", e.target.value)} />
        </div>
      </div>
      <p className="mt-4 text-xs text-smoke">
        A galeria fica disponível por 6 meses após o evento. Pacote digital sugerido: {brl(Number(form.digitalPackPrice.replace(",", ".")) || 0)}.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Criar galeria</Button>
      </div>
    </form>
  );
}
