import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SEED_GALLERIES, type Gallery, type MediaItem } from "@/lib/data/galleries";
import { DEFAULT_PRICING, type MediaPricing } from "@/lib/data/pricing";
import { idbStorage } from "./idb";

/**
 * "Estúdio": o que a equipe Megga gerencia no painel.
 * Galerias novas e uploads ficam no IndexedDB deste navegador (demonstração).
 */
type StudioState = {
  customGalleries: Gallery[];
  /** Mídias enviadas para galerias existentes (inclusive as de exemplo) */
  uploads: Record<string, MediaItem[]>;
  /** Mídias de exemplo ocultadas pelo admin */
  hidden: string[];
  createGallery: (g: Gallery) => void;
  addMedia: (galleryId: string, items: MediaItem[]) => void;
  removeMedia: (galleryId: string, mediaId: string) => void;
  deleteGallery: (galleryId: string) => void;
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      customGalleries: [],
      uploads: {},
      hidden: [],
      createGallery: (g) => set({ customGalleries: [g, ...get().customGalleries] }),
      addMedia: (galleryId, items) =>
        set({
          uploads: {
            ...get().uploads,
            [galleryId]: [...(get().uploads[galleryId] ?? []), ...items],
          },
        }),
      removeMedia: (galleryId, mediaId) => {
        const uploads = get().uploads[galleryId] ?? [];
        if (uploads.some((m) => m.id === mediaId)) {
          set({
            uploads: { ...get().uploads, [galleryId]: uploads.filter((m) => m.id !== mediaId) },
          });
        } else {
          set({ hidden: [...get().hidden, mediaId] });
        }
      },
      deleteGallery: (galleryId) =>
        set({
          customGalleries: get().customGalleries.filter((g) => g.id !== galleryId),
          uploads: Object.fromEntries(
            Object.entries(get().uploads).filter(([id]) => id !== galleryId),
          ),
        }),
    }),
    {
      name: "megga-studio",
      storage: createJSONStorage(() => idbStorage),
      skipHydration: true,
    },
  ),
);

/** Todas as galerias (exemplo + criadas no painel), já com uploads aplicados */
export function useAllGalleries(): Gallery[] {
  const customGalleries = useStudio((s) => s.customGalleries);
  const uploads = useStudio((s) => s.uploads);
  const hidden = useStudio((s) => s.hidden);
  return [...customGalleries, ...SEED_GALLERIES].map((g) => {
    const items = [...g.items.filter((m) => !hidden.includes(m.id)), ...(uploads[g.id] ?? [])];
    // Galerias novas não têm capa: usa a primeira foto (ou o pôster do primeiro vídeo)
    const first = items.find((m) => m.type === "photo") ?? items[0];
    const cover = g.cover || (first ? (first.type === "video" ? (first.poster ?? "") : first.src) : "");
    return { ...g, items, cover };
  });
}

type PricingState = {
  pricing: MediaPricing;
  update: (patch: Partial<MediaPricing>) => void;
  setPrint: (sizeId: string, price: number) => void;
  reset: () => void;
};

export const usePricing = create<PricingState>()(
  persist(
    (set, get) => ({
      pricing: DEFAULT_PRICING,
      update: (patch) => set({ pricing: { ...get().pricing, ...patch } }),
      setPrint: (sizeId, price) =>
        set({ pricing: { ...get().pricing, prints: { ...get().pricing.prints, [sizeId]: price } } }),
      reset: () => set({ pricing: DEFAULT_PRICING }),
    }),
    {
      name: "megga-pricing",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

type FavoritesState = {
  ids: string[];
  toggle: (key: string) => void;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (key) =>
        set({
          ids: get().ids.includes(key) ? get().ids.filter((k) => k !== key) : [...get().ids, key],
        }),
    }),
    {
      name: "megga-favorites",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
