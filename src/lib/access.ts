import type { Gallery } from "@/lib/data/galleries";
import type { SessionUser } from "@/lib/store/auth";

/** Galerias que o usuário pode ver: as dele + as vinculadas por código. Admin vê todas. */
export function galleriesFor(all: Gallery[], user: SessionUser | null, linked: Record<string, string[]>) {
  if (!user) return [];
  if (user.role === "admin") return all;
  const email = user.email.toLowerCase();
  const ids = linked[email] ?? linked[user.email] ?? [];
  return all.filter((g) => g.ownerEmail?.toLowerCase() === email || ids.includes(g.id));
}
