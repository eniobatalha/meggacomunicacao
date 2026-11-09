import type { MediaItem } from "@/lib/data/galleries";

/**
 * Processamento de upload no navegador (modo demonstração).
 * Na versão com backend: upload direto para o storage (ex.: S3/R2) e geração
 * das prévias com marca d'água no servidor.
 */

const MAX_SIDE = 1600;
export const MAX_VIDEO_MB = 40;

const uid = () => Math.random().toString(36).slice(2, 10);

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    img.src = src;
  });
}

function readAsDataURL(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function once(el: HTMLMediaElement, event: string) {
  return new Promise<void>((resolve, reject) => {
    el.addEventListener(event, () => resolve(), { once: true });
    el.addEventListener("error", () => reject(new Error("Formato de vídeo não suportado.")), { once: true });
  });
}

export async function processImage(file: File): Promise<MediaItem> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
    return { id: `up-${uid()}`, type: "photo", src: canvas.toDataURL("image/jpeg", 0.82), width, height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function processVideo(file: File): Promise<MediaItem> {
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
    throw new Error(`Na demonstração, vídeos de até ${MAX_VIDEO_MB} MB.`);
  }
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    await once(video, "loadeddata");
    video.currentTime = Math.min(1, (video.duration || 1) / 3);
    await once(video, "seeked");
    const scale = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight));
    const width = Math.round(video.videoWidth * scale) || 1280;
    const height = Math.round(video.videoHeight * scale) || 720;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(video, 0, 0, width, height);
    const poster = canvas.toDataURL("image/jpeg", 0.8);
    const secs = Math.round(video.duration || 0);
    const src = await readAsDataURL(file);
    return {
      id: `up-${uid()}`,
      type: "video",
      src,
      poster,
      width,
      height,
      duration: `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`,
      title: file.name.replace(/\.[^.]+$/, ""),
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
