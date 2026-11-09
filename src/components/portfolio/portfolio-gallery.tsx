"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import {
  CATEGORY_LABEL,
  PORTFOLIO,
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
  type PortfolioPhoto,
} from "@/lib/data/portfolio";

type Filter = "Todos" | PortfolioCategory;

export function PortfolioGallery() {
  const [filter, setFilter] = useState<Filter>("Todos");
  const [open, setOpen] = useState<number | null>(null);

  const visible = filter === "Todos" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === filter);
  const chips: { id: Filter; count: number }[] = [
    { id: "Todos", count: PORTFOLIO.length },
    ...PORTFOLIO_CATEGORIES.map((c) => ({ id: c, count: PORTFOLIO.filter((p) => p.category === c).length })),
  ];

  return (
    <>
      <nav
        aria-label="Filtrar portfólio"
        className="sticky top-18 z-30 border-y border-white/6 bg-ink-900/90 backdrop-blur-xl"
      >
        <div className="container-page flex gap-2 overflow-x-auto py-3 scrollbar-none">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
              className={cn(
                "flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors",
                filter === c.id
                  ? "border-transparent bg-gold text-ink-950"
                  : "border-white/10 text-silver hover:border-gold-500/50 hover:text-gold-200",
              )}
            >
              {c.id}
              <span className={cn("tabular-nums", filter === c.id ? "text-ink-950/60" : "text-smoke")}>{c.count}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* key: refaz o mosaico (e a animação de entrada) ao trocar de categoria */}
      <section key={filter} className="container-page pt-8 pb-20 sm:pt-12 sm:pb-28">
        <div className="columns-2 gap-2 sm:gap-4 md:columns-3 xl:columns-4 *:mb-2 sm:*:mb-4">
          {visible.map((p, i) => (
            <Reveal key={p.src} delay={(i % 4) * 60} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Ampliar foto de ${CATEGORY_LABEL[p.category].toLowerCase()}`}
                className="group relative block w-full overflow-hidden rounded-xl bg-ink-800 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:outline-none sm:rounded-2xl"
              >
                <Image
                  src={p.src}
                  alt=""
                  width={p.w}
                  height={p.h}
                  sizes="(min-width: 1280px) 19rem, (min-width: 768px) 33vw, 50vw"
                  className="h-auto w-full transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
                />
                {filter === "Todos" && (
                  <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-3 pt-10 text-left text-[0.6rem] font-semibold tracking-[0.25em] text-gold-200 uppercase transition-all duration-500 sm:p-4 sm:pt-12 sm:text-[0.68rem] pointer-fine:translate-y-2 pointer-fine:opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    {CATEGORY_LABEL[p.category]}
                  </span>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Fora de qualquer elemento com transform/blur, para o "fixed" cobrir a tela inteira */}
      {open !== null && (
        <Lightbox photos={visible} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: PortfolioPhoto[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const prev = useCallback(() => onIndex((index - 1 + photos.length) % photos.length), [index, photos.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % photos.length), [index, photos.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Trava a rolagem da página e devolve o foco para a miniatura ao fechar
  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      returnTo?.focus();
    };
  }, []);

  const nav =
    "grid size-11 place-items-center rounded-full bg-black/50 text-white ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-black/70 hover:text-gold-200";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada do portfólio"
      className="fixed inset-0 z-70 flex flex-col bg-ink-950/97 backdrop-blur-xl"
    >
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 px-3 sm:px-5">
        <div className="flex items-center gap-2">
          <button ref={closeRef} type="button" onClick={onClose} className={nav} aria-label="Fechar">
            <X className="size-5" />
          </button>
          <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-silver tabular-nums ring-1 ring-white/10">
            {index + 1} / {photos.length}
          </span>
        </div>
        <span className="text-[0.68rem] font-semibold tracking-[0.28em] text-gold-300 uppercase">
          {CATEGORY_LABEL[photo.category]}
        </span>
      </div>

      {/* Deslize para os lados para trocar de foto */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-6 sm:px-20"
        onTouchStart={(e) => {
          const t = e.touches[0];
          touch.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (!start) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx > 0 ? prev : next)();
        }}
      >
        <Image
          key={photo.src}
          src={photo.src}
          alt={`Foto de ${CATEGORY_LABEL[photo.category].toLowerCase()} — portfólio Megga`}
          width={photo.w}
          height={photo.h}
          sizes="(min-width: 640px) calc(100vw - 10rem), 100vw"
          preload
          className="block h-auto max-h-[calc(100svh-5.5rem)] w-auto max-w-full rounded-lg"
        />
        <button
          type="button"
          onClick={prev}
          className={cn(nav, "absolute top-1/2 left-3 -translate-y-1/2 sm:left-5")}
          aria-label="Foto anterior"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className={cn(nav, "absolute top-1/2 right-3 -translate-y-1/2 sm:right-5")}
          aria-label="Próxima foto"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
