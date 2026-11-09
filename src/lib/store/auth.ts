import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEMO_USERS, type DemoUser } from "@/lib/data/galleries";

export type SessionUser = Omit<DemoUser, "password">;

type AuthState = {
  user: SessionUser | null;
  /** Contas criadas pelo formulário de cadastro (somente demonstração) */
  accounts: DemoUser[];
  /** Galerias vinculadas por código de acesso, por e-mail */
  linked: Record<string, string[]>;
  login: (email: string, password: string) => { ok: true; user: SessionUser } | { ok: false; error: string };
  register: (data: { name: string; email: string; phone: string; password: string }) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  linkGallery: (galleryId: string) => void;
};

const strip = (u: DemoUser): SessionUser => ({ name: u.name, email: u.email, phone: u.phone, role: u.role });

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],
      linked: {},
      login: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const found = [...DEMO_USERS, ...get().accounts].find(
          (u) => u.email.toLowerCase() === normalized,
        );
        if (!found) return { ok: false, error: "Não encontramos uma conta com este e-mail." };
        if (found.password !== password) return { ok: false, error: "Senha incorreta. Tente novamente." };
        const user = strip(found);
        set({ user });
        return { ok: true, user };
      },
      register: ({ name, email, phone, password }) => {
        const normalized = email.trim().toLowerCase();
        const exists = [...DEMO_USERS, ...get().accounts].some(
          (u) => u.email.toLowerCase() === normalized,
        );
        if (exists) return { ok: false, error: "Já existe uma conta com este e-mail." };
        const account: DemoUser = { name: name.trim(), email: normalized, phone, password, role: "client" };
        set({ accounts: [...get().accounts, account], user: strip(account) });
        return { ok: true };
      },
      logout: () => set({ user: null }),
      linkGallery: (galleryId) => {
        const email = get().user?.email;
        if (!email) return;
        const current = get().linked[email] ?? [];
        if (current.includes(galleryId)) return;
        set({ linked: { ...get().linked, [email]: [...current, galleryId] } });
      },
    }),
    {
      name: "megga-auth",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
