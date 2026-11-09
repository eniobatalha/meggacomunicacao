"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Download,
  Film,
  Heart,
  Images,
  Lock,
  MapPin,
  Play,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { galleriesFor } from "@/lib/access";
import type { Gallery, MediaItem } from "@/lib/data/galleries";
import { brl, formatDate, formatDateShort } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/store/auth";
import { useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/hydration";
import { purchasedFor, useOrders } from "@/lib/store/orders";
import { useAllGalleries, useFavorites, usePricing, useStudio } from "@/lib/store/studio";
import { toast } from "@/lib/store/toast";
import { MediaImage } from "./media-image";
import { MediaViewer } from "./media-viewer";
import { Watermark } from "./watermark";

type Filter = "todas" | "fotos" | "videos" | "favoritas" | "liberadas";

export function GalleryView() {
  const { id } = useParams<{ id: string }>();
  const ready = useHydrated(useStudio);
  const user = useAuth((s) => s.user);
  const linked = useAuth((s) => s.linked);
  const all = useAllGalleries();
  const gallery = galleriesFor(all, user, linked).find((g) => g.id === id);

  if (!ready) {
    return <div className="container-page min-h-[60svh] pt-32 text-mist">Carregando galeria…</div>;
  }
  if (!gallery) {
    return (
      <div className="container-page grid min-h-[70svh] place-items-center pt-24 text-center">
        <div>
          <Lock className="mx-auto size-10 text-gold-400" strokeWidth={1.3} />
          <h1 className="mt-5 font-display text-4xl">Galeria não encontrada</h1>
          <p className="mx-auto mt-2 max-w-sm text-mist">
            Esta galeria não existe ou não está vinculada à sua conta. Se você recebeu um código de acesso, adicione-o
            na sua área.
          </p>
          <ButtonLink href="/cliente" className="mt-8">
            Voltar para minha área
          </ButtonLink>
        </div>
      </div>
    );
  }
  return <GalleryContent key={gallery.id} gallery={gallery} />;
}

function GalleryContent({ gallery }: { gallery: Gallery }) {
  const user = useAuth((s) => s.user);
  const orders = useOrders((s) => s.orders);
  const lines = useCart((s) => s.lines);
  const add = useCart((s) => s.add);
  const favorites = useFavorites((s) => s.ids);
  const toggleFav = useFavorites((s) => s.toggle);
  const pricing = usePricing((s) => s.pricing);

  const [filter, setFilter] = useState<Filter>("todas");
  const [openId, setOpenId] = useState<string | null>(null);

  const { media: boughtMedia, packs } = purchasedFor(orders, user?.email);
  const packBought = packs.has(gallery.id);
  const isUnlocked = (m: MediaItem) =>
    boughtMedia.has(`${gallery.id}:${m.id}`) || (packBought && m.type === "photo");
  const favKey = (m: MediaItem) => `${gallery.id}:${m.id}`;

  const photos = gallery.items.filter((m) => m.type === "photo");
  const videos = gallery.items.filter((m) => m.type === "video");
  const unlockedCount = gallery.items.filter(isUnlocked).length;
  const visible = gallery.items.filter((m) => {
    if (filter === "fotos") return m.type === "photo";
    if (filter === "videos") return m.type === "video";
    if (filter === "favoritas") return favorites.includes(favKey(m));
    if (filter === "liberadas") return isUnlocked(m);
    return true;
  });

  const inCart = (m: MediaItem) =>
    lines.filter((l) => l.kind === "media" && l.galleryId === gallery.id && l.mediaId === m.id).reduce((s, l) => s + l.qty, 0);
  const galleryCartCount = lines.filter((l) => (l.kind === "media" || l.kind === "pack") && l.galleryId === gallery.id).length;
  const packInCart = lines.some((l) => l.kind === "pack" && l.galleryId === gallery.id);
  const fullPrice = photos.length * pricing.photoDigital;
  const savings = fullPrice > 0 ? Math.round((1 - gallery.digitalPackPrice / fullPrice) * 100) : 0;

  const openIndex = visible.findIndex((m) => m.id === openId);

  function addPack() {
    const res = add({
      kind: "pack",
      galleryId: gallery.id,
      galleryTitle: gallery.title,
      thumb: gallery.cover,
      photoCount: photos.length,
      unitPrice: gallery.digitalPackPrice,
      qty: 1,
    });
    toast({
      title: res === "exists" ? "O pacote já está no carrinho" : "Pacote digital adicionado",
      description: `${photos.length} fotos em alta resolução`,
      action: { label: "Ver carrinho", href: "/carrinho" },
    });
  }

  const FILTERS: { id: Filter; label: string; count: number }[] = [
    { id: "todas", label: "Todas", count: gallery.items.length },
    { id: "fotos", label: "Fotos", count: photos.length },
    ...(videos.length ? [{ id: "videos" as Filter, label: "Vídeos", count: videos.length }] : []),
    { id: "favoritas", label: "Favoritas", count: gallery.items.filter((m) => favorites.includes(favKey(m))).length },
    ...(unlockedCount ? [{ id: "liberadas" as Filter, label: "Liberadas", count: unlockedCount }] : []),
  ];

  return (
    <div className="pt-[4.5rem]" onContextMenu={(e) => e.preventDefault()}>
      {/* Cabeçalho */}
      <section className="relative overflow-hidden border-b border-white/6 bg-ink-950">
        {gallery.cover && (
          <div className="absolute inset-0 opacity-25 blur-2xl">
            <MediaImage src={gallery.cover} alt="" fill sizes="100vw" preload className="object-cover" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 to-ink-950" />
        <div className="container-page relative py-10 sm:py-14">
          <Link href="/cliente" className="-my-3 inline-flex items-center gap-2 py-3 text-sm text-mist transition-colors hover:text-gold-300">
            <ArrowLeft className="size-4" /> Minhas galerias
          </Link>
          <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <span className="rounded-full bg-gold-500/15 px-3 py-1 text-[0.65rem] font-bold tracking-wider text-gold-200 uppercase">
                {gallery.eventType}
              </span>
              <h1 className="mt-4 font-display text-4xl leading-tight font-medium sm:text-6xl">{gallery.title}</h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-gold-400" /> {formatDate(gallery.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-gold-400" /> {gallery.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Images className="size-4 text-gold-400" /> {photos.length} fotos
                  {videos.length > 0 && (
                    <>
                      <Film className="ml-2 size-4 text-gold-400" /> {videos.length} vídeos
                    </>
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4 text-gold-400" /> Disponível até {formatDateShort(gallery.expiresAt)}
                </span>
              </div>
            </div>

            {/* Pacote digital */}
            {photos.length > 0 && (
              <div className="w-full max-w-md rounded-3xl border border-gold-500/30 bg-ink-850/80 p-5 backdrop-blur lg:w-auto">
                {packBought ? (
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-2xl bg-success/15 text-success">
                      <Check className="size-6" />
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-bone">Todas as fotos liberadas</p>
                      <p className="text-xs text-mist">Pacote digital comprado</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        toast({ title: "Preparando download", description: "Na versão final, um arquivo .zip com todas as fotos é gerado.", tone: "info" })
                      }
                    >
                      <Download className="size-4" /> Baixar todas
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-gold-500/10 text-gold-300 sm:grid">
                      <Sparkles className="size-6" strokeWidth={1.5} />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-bone">Pacote digital completo</p>
                      <p className="text-xs text-mist">
                        Todas as {photos.length} fotos, sem marca d&apos;água
                        {savings > 0 && <span className="ml-1 text-success">· economize {savings}%</span>}
                      </p>
                      <p className="mt-1 text-xl font-semibold text-gold-200">{brl(gallery.digitalPackPrice)}</p>
                    </div>
                    <Button size="sm" variant={packInCart ? "outline" : "gold"} onClick={addPack}>
                      {packInCart ? (
                        <>
                          <Check className="size-4" /> No carrinho
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="size-4" /> Quero
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filtros */}
      <div className="sticky top-[4.5rem] z-30 border-b border-white/6 bg-ink-900/90 backdrop-blur-xl">
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Filtrar mídias">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                  filter === f.id ? "bg-gold text-ink-950" : "text-silver hover:bg-white/5 hover:text-bone",
                )}
              >
                {f.id === "favoritas" && <Heart className="size-3.5" />}
                {f.label}
                <span className={cn("tabular-nums", filter === f.id ? "text-ink-950/60" : "text-smoke")}>{f.count}</span>
              </button>
            ))}
          </div>
          {galleryCartCount > 0 && (
            <Link
              href="/carrinho"
              className="hidden shrink-0 items-center gap-2 rounded-full border border-gold-500/40 px-4 py-2 text-xs font-semibold text-gold-200 hover:bg-gold-500/10 sm:flex"
            >
              <ShoppingBag className="size-3.5" /> {galleryCartCount} {galleryCartCount === 1 ? "item" : "itens"} desta galeria no carrinho
            </Link>
          )}
        </div>
      </div>

      {/* Grade */}
      <section className="container-page py-8 pb-24">
        <p className="mb-6 flex items-center gap-2 text-xs text-smoke">
          <Lock className="size-3.5 text-gold-500" />
          Prévias protegidas. Clique em uma foto para escolher entre digital ou impressa.
        </p>
        {visible.length === 0 ? (
          <div className="rounded-3xl border border-white/7 bg-ink-850 px-6 py-16 text-center text-mist">
            {filter === "favoritas"
              ? "Toque no coração das fotos que você mais gostou para encontrá-las aqui."
              : "Nenhum item neste filtro."}
          </div>
        ) : (
          <div className="columns-2 gap-3 md:columns-3 xl:columns-4 [&>*]:mb-3">
            {visible.map((m, i) => {
              const unlocked = isUnlocked(m);
              const fav = favorites.includes(favKey(m));
              const count = inCart(m);
              return (
                <div key={m.id} className="group relative break-inside-avoid overflow-hidden rounded-xl bg-ink-800">
                  <button
                    type="button"
                    onClick={() => setOpenId(m.id)}
                    className="relative block w-full cursor-zoom-in"
                    aria-label={m.type === "video" ? `Abrir vídeo ${m.title ?? ""}` : "Abrir foto"}
                  >
                    <MediaImage
                      src={m.type === "video" ? (m.poster ?? m.src) : m.src}
                      alt=""
                      width={m.width}
                      height={m.height}
                      sizes="(min-width: 1280px) 20rem, (min-width: 768px) 33vw, 50vw"
                      eager={i < 8}
                      className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                    />
                    {!unlocked && <Watermark compact />}
                    {m.type === "video" && (
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid size-14 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/30 backdrop-blur transition-transform group-hover:scale-110">
                          <Play className="ml-0.5 size-6 fill-white" />
                        </span>
                      </span>
                    )}
                    <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                  </button>

                  <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      {m.type === "video" && (
                        <span className="rounded-full bg-black/60 px-2 py-0.5 text-[0.65rem] font-semibold text-white backdrop-blur">
                          {m.duration ?? "vídeo"}
                        </span>
                      )}
                      {unlocked && (
                        <span className="flex items-center gap-1 rounded-full bg-success/90 px-2 py-0.5 text-[0.65rem] font-bold text-ink-950">
                          <Check className="size-3" /> Liberada
                        </span>
                      )}
                      {count > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-bold text-ink-950">
                          <ShoppingBag className="size-3" /> {count}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFav(favKey(m))}
                      className={cn(
                        "pointer-events-auto grid size-9 place-items-center rounded-full bg-black/45 backdrop-blur transition-all",
                        fav ? "text-gold-300 opacity-100" : "text-white pointer-fine:opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                      )}
                      aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      aria-pressed={fav}
                    >
                      <Heart className={cn("size-4", fav && "fill-current")} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {openIndex >= 0 && (
        <MediaViewer
          gallery={gallery}
          item={visible[openIndex]}
          position={`${openIndex + 1} / ${visible.length}`}
          unlocked={isUnlocked(visible[openIndex])}
          favorite={favorites.includes(favKey(visible[openIndex]))}
          onToggleFavorite={() => toggleFav(favKey(visible[openIndex]))}
          onClose={() => setOpenId(null)}
          onPrev={() => setOpenId(visible[(openIndex - 1 + visible.length) % visible.length].id)}
          onNext={() => setOpenId(visible[(openIndex + 1) % visible.length].id)}
        />
      )}
    </div>
  );
}
