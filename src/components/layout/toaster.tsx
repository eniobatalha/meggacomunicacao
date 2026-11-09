"use client";

import Link from "next/link";
import { CircleCheck, Info, X } from "lucide-react";
import { useToast } from "@/lib/store/toast";
import { cn } from "@/lib/cn";

export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  const dismiss = useToast((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-4 top-20 z-[60] flex flex-col items-end gap-3 sm:left-auto sm:w-96" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto w-full animate-fade-up rounded-2xl border border-white/10 bg-ink-800/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <div className="flex gap-3">
            <span
              className={cn(
                "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full",
                t.tone === "error" ? "bg-danger/15 text-danger" : t.tone === "info" ? "bg-info/15 text-info" : "bg-gold-500/15 text-gold-300",
              )}
            >
              {t.tone === "info" || t.tone === "error" ? <Info className="size-4" /> : <CircleCheck className="size-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-bone">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-mist">{t.description}</p>}
              {t.action && (
                <Link
                  href={t.action.href}
                  onClick={() => dismiss(t.id)}
                  className="mt-2 inline-block text-sm font-semibold text-gold-300 underline-offset-4 hover:underline"
                >
                  {t.action.label} →
                </Link>
              )}
            </div>
            <button type="button" onClick={() => dismiss(t.id)} className="text-smoke hover:text-bone" aria-label="Fechar aviso">
              <X className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
