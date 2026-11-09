"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState, type DragEvent } from "react";
import { ArrowLeft, CalendarDays, Check, CloudUpload, Copy, Eye, Film, Images, KeyRound, Mail, MapPin, Play, Trash, TriangleExclamationPoint } from "lucide-react";
import { MediaImage } from "@/components/gallery/media-image";
import { Button, ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import type { MediaItem } from "@/lib/data/galleries";
import { brl, formatDate, formatDateShort } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/store/hydration";
import { useAllGalleries, useStudio } from "@/lib/store/studio";
import { toast } from "@/lib/store/toast";
import { MAX_VIDEO_MB, processImage, processVideo } from "@/lib/upload";

type QueueItem = { id: string; name: string; size: number; progress: number; status: "enviando" | "pronto" | "erro"; error?: string };

export function GalleryManager() {
  const { id } = useParams<{ id: string }>();
  const ready = useHydrated(useStudio);
  const gallery = useAllGalleries().find((g) => g.id === id);

  if (!ready) return <div className="h-96 animate-pulse rounded-2xl bg-ink-850" />;
  if (!gallery) {
    return (
      <div className="rounded-2xl border border-white/7 bg-ink-850 p-10 text-center">
        <p className="font-display text-3xl">Galeria não encontrada</p>
        <ButtonLink href="/admin/galerias" className="mt-6">
          Voltar
        </ButtonLink>
      </div>
    );
  }
  return <Manager key={gallery.id} galleryId={gallery.id} />;
}

function Manager({ galleryId }: { galleryId: string }) {
  const router = useRouter();
  const gallery = useAllGalleries().find((g) => g.id === galleryId)!;
  const isCustom = useStudio((s) => s.customGalleries.some((g) => g.id === galleryId));
  const addMedia = useStudio((s) => s.addMedia);
  const removeMedia = useStudio((s) => s.removeMedia);
  const deleteGallery = useStudio((s) => s.deleteGallery);

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const photos = gallery.items.filter((m) => m.type === "photo");
  const videos = gallery.items.filter((m) => m.type === "video");
  const update = (qid: string, patch: Partial<QueueItem>) => setQueue((q) => q.map((x) => (x.id === qid ? { ...x, ...patch } : x)));

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (!list.length) {
      toast({ title: "Formato não suportado", description: "Envie arquivos de imagem ou vídeo.", tone: "error" });
      return;
    }
    const entries = list.map((f) => ({ file: f, q: { id: Math.random().toString(36).slice(2), name: f.name, size: f.size, progress: 4, status: "enviando" as const } }));
    setQueue((q) => [...entries.map((e) => e.q), ...q]);

    let ok = 0;
    for (const { file, q } of entries) {
      // progresso visual enquanto o arquivo é processado
      const timer = setInterval(() => setQueue((all) => all.map((x) => (x.id === q.id && x.progress < 90 ? { ...x, progress: x.progress + 7 } : x))), 90);
      try {
        const [item] = await Promise.all([
          file.type.startsWith("video/") ? processVideo(file) : processImage(file),
          new Promise((r) => setTimeout(r, 700)),
        ]);
        addMedia(gallery.id, [item as MediaItem]);
        update(q.id, { progress: 100, status: "pronto" });
        ok++;
      } catch (err) {
        update(q.id, { status: "erro", error: err instanceof Error ? err.message : "Falha ao processar o arquivo." });
      } finally {
        clearInterval(timer);
      }
    }
    if (ok) toast({ title: `${ok} ${ok === 1 ? "arquivo enviado" : "arquivos enviados"}`, description: "Já aparecem na galeria do cliente com marca d'água." });
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    void handleFiles(e.dataTransfer.files);
  }

  function shareMessage() {
    return `Olá! As fotos do evento "${gallery.title}" já estão disponíveis na área do cliente da Megga Comunicação. Acesse ${window.location.origin}/login e use o código de acesso ${gallery.accessCode} para ver a sua galeria. 📸`;
  }

  return (
    <>
      <Link href="/admin/galerias" className="-my-3 inline-flex items-center gap-2 py-3 text-sm text-mist hover:text-gold-300">
        <ArrowLeft className="size-4" /> Galerias
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <span className="rounded-full bg-gold-500/15 px-3 py-1 text-[0.65rem] font-bold tracking-wider text-gold-200 uppercase">{gallery.eventType}</span>
          <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">{gallery.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-mist">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold-500" /> {formatDate(gallery.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-gold-500" /> {gallery.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-4 text-gold-500" /> {gallery.ownerEmail ?? "sem cliente vinculado"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/cliente/galeria/${gallery.id}`} variant="dark" size="sm">
            <Eye className="size-4" /> Ver como cliente
          </ButtonLink>
          <Button size="sm" variant="whatsapp" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage())}`, "_blank", "noopener")}>
            <WhatsAppIcon className="size-4" /> Enviar acesso
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <InfoTile label="Fotos" value={String(photos.length)} icon={<Images className="size-4" />} />
        <InfoTile label="Vídeos" value={String(videos.length)} icon={<Film className="size-4" />} />
        <div className="rounded-2xl border border-white/7 bg-ink-850 p-4 sm:p-5">
          <p className="flex items-center gap-2 text-xs text-mist sm:text-sm">
            <KeyRound className="size-4 text-gold-500" /> Código de acesso
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(gallery.accessCode);
              } catch {}
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            className="mt-2 flex items-center gap-2 font-mono text-xl font-semibold tracking-wider text-gold-200 sm:text-2xl"
          >
            {gallery.accessCode}
            {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4 text-smoke" />}
          </button>
        </div>
        <InfoTile label="Pacote digital · expira em" value={`${brl(gallery.digitalPackPrice)}`} note={formatDateShort(gallery.expiresAt)} />
      </div>

      {/* Upload */}
      <section className="mt-8">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors",
            dragging ? "border-gold-400 bg-gold-500/10" : "border-white/15 bg-ink-850 hover:border-gold-500/40",
          )}
        >
          <span className="grid size-16 place-items-center rounded-full bg-gold-500/10 text-gold-300">
            <CloudUpload className="size-8" strokeWidth={1.4} />
          </span>
          <p className="mt-5 font-display text-2xl">Arraste fotos e vídeos para cá</p>
          <p className="mt-1 text-sm text-mist">
            JPG, PNG, WEBP ou MP4 · as prévias recebem marca d&apos;água automaticamente
          </p>
          <Button className="mt-6" onClick={() => inputRef.current?.click()}>
            Selecionar arquivos
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <p className="mt-4 text-[0.7rem] text-smoke">
            Demonstração: os arquivos ficam salvos apenas neste navegador · vídeos até {MAX_VIDEO_MB} MB
          </p>
        </div>

        {queue.length > 0 && (
          <ul className="mt-4 space-y-2">
            {queue.slice(0, 8).map((q) => (
              <li key={q.id} className="flex items-center gap-4 rounded-xl border border-white/7 bg-ink-850 px-4 py-3">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full",
                    q.status === "pronto" ? "bg-success/15 text-success" : q.status === "erro" ? "bg-danger/15 text-danger" : "bg-gold-500/10 text-gold-300",
                  )}
                >
                  {q.status === "pronto" ? <Check className="size-4" /> : q.status === "erro" ? <TriangleExclamationPoint className="size-4" /> : <CloudUpload className="size-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate text-bone">{q.name}</span>
                    <span className="shrink-0 text-xs text-smoke">{(q.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  {q.status === "erro" ? (
                    <p className="text-xs text-danger">{q.error}</p>
                  ) : (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/6">
                      <div
                        className={cn("h-full rounded-full transition-all duration-200", q.status === "pronto" ? "bg-success" : "bg-gold")}
                        style={{ width: `${q.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Mídias */}
      <section className="mt-10">
        <h2 className="font-semibold">Arquivos da galeria</h2>
        {gallery.items.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-white/7 bg-ink-850 p-8 text-center text-sm text-mist">Nenhum arquivo enviado ainda.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            {gallery.items.map((m) => (
              <div key={m.id} className="group relative aspect-square overflow-hidden rounded-xl bg-ink-700">
                <MediaImage src={m.type === "video" ? (m.poster ?? "") || "/amostras/claquete.jpg" : m.src} alt="" fill sizes="(min-width: 1536px) 14rem, 25vw" className="object-cover" />
                {m.type === "video" && (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-10 place-items-center rounded-full bg-black/60 text-white">
                      <Play className="ml-0.5 size-4 fill-white" />
                    </span>
                  </span>
                )}
                {m.id.startsWith("up-") && (
                  <span className="absolute top-2 left-2 rounded-full bg-gold px-2 py-0.5 text-[0.6rem] font-bold text-ink-950">NOVO</span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    removeMedia(gallery.id, m.id);
                    toast({ title: "Arquivo removido da galeria", tone: "info" });
                  }}
                  className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-black/60 text-white transition-opacity hover:bg-danger pointer-fine:opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label="Remover arquivo"
                >
                  <Trash className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {isCustom && (
        <section className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-danger/20 bg-danger/4 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold">Excluir galeria</p>
            <p className="text-sm text-mist">Remove a galeria e todos os arquivos enviados.</p>
          </div>
          {confirmDelete ? (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-danger bg-none text-white shadow-none"
                onClick={() => {
                  deleteGallery(gallery.id);
                  toast({ title: "Galeria excluída", tone: "info" });
                  router.push("/admin/galerias");
                }}
              >
                Confirmar exclusão
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="dark" onClick={() => setConfirmDelete(true)}>
              <Trash className="size-4" /> Excluir
            </Button>
          )}
        </section>
      )}
    </>
  );
}

function InfoTile({ label, value, note, icon }: { label: string; value: string; note?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/7 bg-ink-850 p-4 sm:p-5">
      <p className="flex items-center gap-2 text-xs text-mist sm:text-sm">
        {icon && <span className="text-gold-500">{icon}</span>}
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-bone sm:text-2xl">{value}</p>
      {note && <p className="text-xs text-smoke">{note}</p>}
    </div>
  );
}
