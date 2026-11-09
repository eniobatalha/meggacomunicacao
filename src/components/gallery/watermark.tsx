import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Tarja de proteção sobre as prévias.
 * Na versão com backend, a marca d'água também é aplicada no próprio
 * arquivo pelo servidor — esta camada visual é o reforço no navegador.
 */
export function Watermark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 select-none", className)}>
      <div className="watermark-pattern absolute inset-0 opacity-90 mix-blend-overlay" />
      <div className="watermark-pattern absolute inset-0 opacity-40" />
      {!compact && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-2 opacity-45">
            <Image src="/brand/simbolo.png" alt="" width={512} height={571} sizes="96px" className="h-auto w-[18%] min-w-12 max-w-24 drop-shadow-lg" />
            <span className="text-[0.6rem] font-bold tracking-[0.4em] text-white uppercase drop-shadow sm:text-xs">Prévia</span>
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-3 pt-6 pb-2 text-[0.55rem] font-semibold tracking-[0.25em] text-white/80 uppercase">
        <span>Megga Comunicação</span>
        {!compact && <span>Prévia protegida</span>}
      </div>
    </div>
  );
}
