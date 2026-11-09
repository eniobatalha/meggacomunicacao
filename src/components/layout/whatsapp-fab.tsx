import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Olá! Vim pelo site da Megga Comunicação e gostaria de mais informações.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="group fixed right-5 bottom-5 z-40 flex items-center gap-3 sm:right-7 sm:bottom-7"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-ink-800/95 px-4 py-2 text-sm font-medium text-bone opacity-0 shadow-xl ring-1 ring-white/10 backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Contrate pelo WhatsApp
      </span>
      <span className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-[#06210f] shadow-[0_10px_40px_-8px_rgba(37,211,102,0.7)] transition-transform duration-300 group-hover:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20 [animation-duration:2.5s]" aria-hidden />
        <WhatsAppIcon className="relative size-7" />
      </span>
    </a>
  );
}
