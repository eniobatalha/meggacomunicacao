import Link from "next/link";
import { BrandSymbol } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-ink-950 px-5 text-center">
      <div>
        <BrandSymbol className="mx-auto w-14" />
        <p className="mt-8 eyebrow">Erro 404</p>
        <h1 className="mt-3 font-display text-5xl">Página não encontrada</h1>
        <p className="mt-3 text-mist">O endereço pode ter mudado ou não existe mais.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-gold px-6 text-sm font-semibold text-ink-950"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
