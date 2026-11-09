import { create } from "zustand";

export type Toast = {
  id: number;
  title: string;
  description?: string;
  tone?: "success" | "info" | "error";
  action?: { label: string; href: string };
};

type ToastState = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
};

let seq = 0;

export const useToast = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = ++seq;
    set({ toasts: [...get().toasts.slice(-2), { ...t, id }] });
    setTimeout(() => get().dismiss(id), 4500);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const toast = (t: Omit<Toast, "id">) => useToast.getState().push(t);
