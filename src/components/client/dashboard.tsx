"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, Clock, Film, Images, KeyRound, LogOut, MapPin, Package, Receipt } from "lucide-react";
import { MediaImage } from "@/components/gallery/media-image";
import { Watermark } from "@/components/gallery/watermark";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { StatusBadge } from "@/components/ui/status-badge";
import { galleriesFor } from "@/lib/access";
import { brl, formatDate, formatDateShort, pluralize } from "@/lib/format";
import { useAuth } from "@/lib/store/auth";
import { useHydrated } from "@/lib/store/hydration";
import { useOrders } from "@/lib/store/orders";
import { useAllGalleries, useStudio } from "@/lib/store/studio";
import { toast } from "@/lib/store/toast";

export function ClientDashboard() {
  const router = useRouter();
  const user = useAuth((s) => s.user)!;
  const linked = useAuth((s) => s.linked);
  const linkGallery = useAuth((s) => s.linkGallery);
  const logout = useAuth((s) => s.logout);
  const studioReady = useHydrated(useStudio);
  const all = useAllGalleries();
  const orders = useOrders((s) => s.orders).filter((o) => o.customer.email.toLowerCase() === user.email.toLowerCase());
  const galleries = galleriesFor(all, user, linked);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  function onLink(e: FormEvent) {
    e.preventDefault();
    const g = all.find((x) => x.accessCode.toUpperCase() === code.trim().toUpperCase());
    if (!g) return setCodeError("Código não encontrado. Confira com a equipe Megga.");
    if (galleries.some((x) => x.id === g.id)) return setCodeError("Esta galeria já está na sua conta.");
    linkGallery(g.id);
    setCode("");
    setCodeError(null);
    toast({ title: "Galeria adicionada!", description: g.title, action: { label: "Abrir galeria", href: `/cliente/galeria/${g.id}` } });
  }

  return (
    <div className="pt-[4.5rem]">
      <section className="border-b border-white/6 bg-ink-950">
        <div className="container-page flex flex-col justify-between gap-6 py-12 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Minha área</p>
            <h1 className="mt-3 font-display text-5xl font-medium">
              Olá, <em className="text-gold italic">{user.name.split(" ")[0]}</em>
            </h1>
            <p className="mt-2 text-mist">Suas galerias, compras e entregas em um só lugar.</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl border border-white/7 bg-ink-850 px-5 py-3">
              <p className="text-2xl font-semibold text-gold-200">{galleries.length}</p>
              <p className="text-xs text-mist">galerias</p>
            </div>
            <div className="rounded-2xl border border-white/7 bg-ink-850 px-5 py-3">
              <p className="text-2xl font-semibold text-gold-200">{orders.length}</p>
              <p className="text-xs text-mist">pedidos</p>
            </div>
            <Button
              variant="ghost"
              className="h-auto self-stretch rounded-2xl border border-white/7"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogOut className="size-4" /> Sair
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl">Minhas galerias</h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {!studioReady &&
            Array.from({ length: 2 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-ink-850" />)}
          {studioReady &&
            galleries.map((g, i) => {
              const photos = g.items.filter((m) => m.type === "photo").length;
              const videos = g.items.filter((m) => m.type === "video").length;
              return (
                <Link
                  key={g.id}
                  href={`/cliente/galeria/${g.id}`}
                  className="group overflow-hidden rounded-3xl border border-white/7 bg-ink-850 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40"
                >
                  <div className="relative aspect-[16/11] overflow-hidden">
                    {g.cover ? (
                      <MediaImage
                        src={g.cover}
                        alt={g.title}
                        fill
                        sizes="(min-width: 1280px) 26rem, (min-width: 768px) 50vw, 100vw"
                        eager={i < 3}
                        className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-ink-700 text-sm text-smoke">Fotos em breve</div>
                    )}
                    <Watermark compact />
                    <span className="absolute top-4 left-4 rounded-full bg-black/55 px-3 py-1 text-[0.65rem] font-bold tracking-wider text-gold-200 uppercase backdrop-blur">
                      {g.eventType}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl leading-tight text-bone">{g.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-mist">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-gold-400" /> {formatDate(g.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-gold-400" /> {g.location}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-white/6 pt-4">
                      <div className="flex gap-4 text-sm text-silver">
                        <span className="flex items-center gap-1.5">
                          <Images className="size-4 text-smoke" /> {photos}
                        </span>
                        {videos > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Film className="size-4 text-smoke" /> {videos}
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-sm font-semibold text-gold-300">
                        Abrir <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 text-[0.7rem] text-smoke">
                      <Clock className="size-3" /> Disponível até {formatDateShort(g.expiresAt)}
                    </p>
                  </div>
                </Link>
              );
            })}

          {/* Código de acesso */}
          <form
            onSubmit={onLink}
            className="flex flex-col justify-center rounded-3xl border border-dashed border-gold-500/30 bg-gold-500/3 p-7"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-gold-500/10 text-gold-300">
              <KeyRound className="size-6" strokeWidth={1.5} />
            </span>
            <h3 className="mt-5 font-display text-2xl text-bone">Tem um código de acesso?</h3>
            <p className="mt-2 text-sm text-mist">
              Em formaturas e eventos coletivos, a equipe envia um código para cada convidado acessar as fotos.
            </p>
            <div className="mt-5 flex gap-2">
              <Input
                aria-label="Código de acesso"
                placeholder="Ex.: FORMA26"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setCodeError(null);
                }}
                className="uppercase placeholder:normal-case"
              />
              <Button type="submit" className="h-12 rounded-xl">
                Adicionar
              </Button>
            </div>
            {codeError && <p className="mt-2 text-xs text-danger">{codeError}</p>}
            <p className="mt-3 text-[0.7rem] text-smoke">
              Demonstração: experimente o código <strong className="text-gold-300">FORMA26</strong>.
            </p>
          </form>
        </div>
      </section>

      <section className="container-page pb-24">
        <h2 className="font-display text-3xl">Meus pedidos</h2>
        {orders.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-3xl border border-white/7 bg-ink-850 px-6 py-14 text-center">
            <Receipt className="size-10 text-smoke" strokeWidth={1.2} />
            <p className="mt-4 font-semibold text-bone">Você ainda não fez pedidos</p>
            <p className="mt-1 max-w-sm text-sm text-mist">
              Abra uma galeria, escolha suas fotos favoritas em digital ou impressas e finalize on-line.
            </p>
            <ButtonLink href="/servicos" variant="outline" className="mt-6">
              Conhecer serviços
            </ButtonLink>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-white/6 overflow-hidden rounded-3xl border border-white/7 bg-ink-850">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/pedido/${o.id}`}
                  className="flex flex-col gap-3 px-6 py-5 transition-colors hover:bg-white/2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid size-11 place-items-center rounded-2xl bg-ink-700 text-gold-300">
                      <Package className="size-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="font-semibold text-bone">Pedido {o.id}</p>
                      <p className="text-xs text-mist">
                        {formatDateShort(o.createdAt)} · {pluralize(o.lines.reduce((s, l) => s + l.qty, 0), "item", "itens")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <StatusBadge status={o.status} />
                    <span className="font-semibold text-gold-200">{brl(o.total)}</span>
                    <ArrowRight className="hidden size-4 text-smoke sm:block" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
