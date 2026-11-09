import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type MediaFormat = "digital" | "print" | "pendrive";

export type ServiceLine = {
  key: string;
  kind: "service";
  serviceSlug: string;
  packageId: string;
  title: string;
  packageName: string;
  unit?: string;
  image: string;
  unitPrice: number;
  qty: number;
  eventDate?: string;
};

export type MediaLine = {
  key: string;
  kind: "media";
  galleryId: string;
  galleryTitle: string;
  mediaId: string;
  mediaType: "photo" | "video";
  thumb: string;
  format: MediaFormat;
  sizeId?: string;
  sizeLabel?: string;
  finish?: "brilho" | "fosco";
  unitPrice: number;
  qty: number;
};

export type PackLine = {
  key: string;
  kind: "pack";
  galleryId: string;
  galleryTitle: string;
  thumb: string;
  photoCount: number;
  unitPrice: number;
  qty: number;
};

export type CartLine = ServiceLine | MediaLine | PackLine;

type NewLine =
  | Omit<ServiceLine, "key">
  | Omit<MediaLine, "key">
  | Omit<PackLine, "key">;

export function lineKey(line: NewLine): string {
  switch (line.kind) {
    case "service":
      return `service:${line.serviceSlug}:${line.packageId}:${line.eventDate ?? ""}`;
    case "media":
      return `media:${line.galleryId}:${line.mediaId}:${line.format}:${line.sizeId ?? ""}:${line.finish ?? ""}`;
    case "pack":
      return `pack:${line.galleryId}`;
  }
}

/** Itens que só podem existir uma vez no carrinho (arquivo digital, pacote) */
const isSingleton = (line: NewLine) =>
  line.kind === "pack" || (line.kind === "media" && line.format === "digital");

type CartState = {
  lines: CartLine[];
  add: (line: NewLine) => "added" | "updated" | "exists";
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (line) => {
        const key = lineKey(line);
        const existing = get().lines.find((l) => l.key === key);
        if (existing) {
          if (isSingleton(line)) return "exists";
          set({
            lines: get().lines.map((l) =>
              l.key === key ? { ...l, qty: l.qty + line.qty } : l,
            ),
          });
          return "updated";
        }
        set({ lines: [...get().lines, { ...line, key } as CartLine] });
        return "added";
      },
      setQty: (key, qty) =>
        set({
          lines: get().lines.map((l) =>
            l.key === key ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l,
          ),
        }),
      remove: (key) => set({ lines: get().lines.filter((l) => l.key !== key) }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "megga-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export const cartCount = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + l.qty, 0);

export const cartSubtotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

export const hasPhysical = (lines: CartLine[]) =>
  lines.some(
    (l) => l.kind === "media" && (l.format === "print" || l.format === "pendrive"),
  );

export function lineTitle(line: CartLine) {
  switch (line.kind) {
    case "service":
      return line.title;
    case "pack":
      return "Pacote digital completo";
    case "media":
      if (line.mediaType === "video") {
        return line.format === "pendrive" ? "Vídeo em pen drive" : "Vídeo digital (HD)";
      }
      return line.format === "print" ? "Foto impressa" : "Foto digital (alta resolução)";
  }
}

export function lineSubtitle(line: CartLine) {
  switch (line.kind) {
    case "service":
      return `Pacote ${line.packageName}${line.unit ? ` · ${line.unit}` : ""}`;
    case "pack":
      return `${line.galleryTitle} · ${line.photoCount} fotos sem marca d'água`;
    case "media": {
      const parts = [line.galleryTitle];
      if (line.format === "print") {
        parts.push(line.sizeLabel ?? "");
        parts.push(line.finish === "fosco" ? "Fosco" : "Brilho");
      }
      return parts.filter(Boolean).join(" · ");
    }
  }
}
