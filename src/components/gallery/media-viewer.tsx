"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import type { Gallery, MediaItem } from "@/lib/data/galleries";
import { cn } from "@/lib/cn";
import { MediaImage } from "./media-image";
import { PurchasePanel } from "./purchase-panel";
import { Watermark } from "./watermark";

/**
 * Layout:
 * - Celular/tablet em pé: uma rolagem só — barra fixa no topo, mídia, opções de compra
 *   e o rodapé (total + adicionar) preso no fim da tela.
 * - Telas largas (`wide`: desktop, tablet ou celular deitado): mídia à esquerda e painel
 *   de compra à direita com rolagem própria.
 * A altura máxima da mídia vem de --media-max (a área se ajusta à foto, então fotos
 * deitadas não deixam faixa vazia) e a marca d'água abraça exatamente a imagem.
 */
export function MediaViewer({
  gallery,
  item,
  position,
  unlocked,
  favorite,
  onToggleFavorite,
  onClose,
  onPrev,
  onNext,
}: {
  gallery: Gallery;
  item: MediaItem;
  position: string;
  unlocked: boolean;
  favorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onPrev, onNext]);

  // Ao trocar de foto, volta ao topo (no celular a rolagem é do visualizador inteiro)
  useEffect(() => {
    rootRef.current?.scrollTo({ top: 0 });
  }, [item.id]);

  const nav =
    "pointer-events-auto grid size-11 place-items-center rounded-full bg-black/50 text-white ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-black/70 hover:text-gold-200";

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Visualizar mídia"
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-ink-950/97 backdrop-blur-xl wide:grid wide:grid-cols-[minmax(0,1fr)_auto] wide:grid-rows-1 wide:overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Barra superior: presa no topo no celular; sobreposta à mídia nas telas largas */}
      <div className="pointer-events-none sticky top-0 z-20 flex h-16 items-center justify-between bg-ink-950/85 px-3 backdrop-blur-xl sm:px-5 wide:col-start-1 wide:row-start-1 wide:h-auto wide:self-start wide:bg-transparent wide:pt-5 wide:backdrop-blur-none">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onClose} className={nav} aria-label="Fechar">
            <X className="size-5" />
          </button>
          <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-silver tabular-nums ring-1 ring-white/10">{position}</span>
        </div>
        <button
          type="button"
          onClick={onToggleFavorite}
          className={cn(nav, favorite && "text-gold-300")}
          aria-label={favorite ? "Remover dos favoritos" : "Favoritar"}
          aria-pressed={favorite}
        >
          <Heart className={cn("size-5", favorite && "fill-current")} />
        </button>
      </div>

      {/* Mídia — deslize para os lados para trocar de foto */}
      <div
        className="relative flex min-h-48 items-center justify-center px-3 pb-3 [--media-max:52svh] sm:px-6 sm:pb-6 sm:[--media-max:58svh] wide:col-start-1 wide:row-start-1 wide:min-h-0 wide:p-6 wide:[--media-max:calc(100svh-3rem)]"
        onTouchStart={(e) => {
          const t = e.touches[0];
          touch.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (!start || item.type !== "photo") return;
          const t = e.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx > 0 ? onPrev : onNext)();
        }}
      >
        {item.type === "photo" ? (
          <div className="relative max-w-full overflow-hidden rounded-lg">
            <MediaImage
              key={item.id}
              src={item.src}
              alt="Foto do evento"
              width={item.width}
              height={item.height}
              sizes="(min-width: 1024px) 65vw, 100vw"
              className="block h-auto max-h-(--media-max) w-auto max-w-full"
              preload
            />
            {!unlocked && <Watermark />}
          </div>
        ) : (
          <div
            className="relative w-full overflow-hidden rounded-xl bg-black"
            style={{
              aspectRatio: `${item.width} / ${item.height}`,
              maxWidth: `min(64rem, calc(var(--media-max) * ${(item.width / item.height).toFixed(4)}))`,
            }}
          >
            <video
              key={item.id}
              src={item.src}
              poster={item.poster}
              controls
              playsInline
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              className="h-full w-full object-cover"
            />
            {!unlocked && <Watermark compact className="bottom-12" />}
          </div>
        )}

        <button type="button" onClick={onPrev} className={cn(nav, "absolute top-1/2 left-3 -translate-y-1/2 sm:left-5")} aria-label="Anterior">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={onNext} className={cn(nav, "absolute top-1/2 right-3 -translate-y-1/2 sm:right-5")} aria-label="Próxima">
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Compra */}
      <aside className="border-t border-white/7 bg-ink-900 wide:col-start-2 wide:row-start-1 wide:w-[min(26rem,50vw)] wide:overflow-y-auto wide:overscroll-contain wide:border-t-0 wide:border-l">
        <PurchasePanel key={item.id} gallery={gallery} item={item} unlocked={unlocked} />
      </aside>
    </div>
  );
}
