import type { ComponentProps, ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function Label({ children, htmlFor, hint }: { children: ReactNode; htmlFor?: string; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between text-xs font-semibold tracking-wide text-silver">
      {children}
      {hint && <span className="font-normal text-smoke">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-white/10 bg-ink-850 px-4 text-base text-bone placeholder:text-smoke pointer-fine:text-sm transition-colors outline-none focus:border-gold-500/70 focus:bg-ink-800 focus:ring-4 focus:ring-gold-500/10",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-12 w-full appearance-none rounded-xl border border-white/10 bg-ink-850 px-4 text-base text-bone outline-none pointer-fine:text-sm transition-colors focus:border-gold-500/70 focus:ring-4 focus:ring-gold-500/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Field({ label, hint, id, ...props }: { label: string; hint?: string; id: string } & ComponentProps<"input">) {
  return (
    <div>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <Input id={id} name={id} {...props} />
    </div>
  );
}

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Quantidade",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const btn = cn(
    "grid place-items-center text-silver transition-colors hover:text-gold-300 disabled:opacity-30",
    size === "sm" ? "size-8" : "size-10",
  );
  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-ink-850" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Diminuir">
        <Minus className="size-3.5" />
      </button>
      <span className={cn("min-w-8 text-center font-semibold tabular-nums", size === "sm" ? "text-sm" : "text-base")} aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Aumentar">
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
