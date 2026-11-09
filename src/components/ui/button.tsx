import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "gold" | "outline" | "ghost" | "dark" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-wide transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-ink-950 shadow-[0_8px_30px_-8px_rgba(212,164,65,0.55)] hover:bg-[position:100%_0] hover:shadow-[0_10px_40px_-6px_rgba(212,164,65,0.7)] active:scale-[0.98]",
  outline:
    "border border-gold-500/50 text-gold-200 hover:border-gold-300 hover:bg-gold-500/10 hover:text-gold-100 active:scale-[0.98]",
  ghost: "text-silver hover:text-bone hover:bg-white/5",
  dark: "bg-ink-700 text-bone border border-white/10 hover:bg-ink-600 hover:border-white/20 active:scale-[0.98]",
  whatsapp:
    "bg-[#25D366] text-[#06210f] hover:bg-[#2ee372] shadow-[0_8px_30px_-10px_rgba(37,211,102,0.6)] active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs rounded-full",
  md: "h-11 px-6 text-sm rounded-full",
  lg: "h-14 px-8 text-[0.95rem] rounded-full",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({
  variant = "gold",
  size = "md",
  className,
  ...props
}: Common & ComponentProps<"button">) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "gold",
  size = "md",
  className,
  external,
  ...props
}: Common & ComponentProps<typeof Link> & { external?: boolean }) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...ext} {...props} />;
}
