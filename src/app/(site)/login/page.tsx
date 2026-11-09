import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { Lock } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { BrandSymbol } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Área do cliente",
  description: "Acesse sua galeria privada de fotos e vídeos da Megga Comunicação.",
};

export default function LoginPage() {
  return (
    <section className="relative min-h-[100svh] bg-ink-950 pt-[4.5rem]">
      <div className="grid min-h-[calc(100svh-4.5rem)] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:block">
          <Image src="/amostras/casamento-07.jpg" alt="" fill preload sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/20" />
          <div className="absolute inset-x-0 bottom-0 p-12">
            <BrandSymbol className="w-12" />
            <p className="mt-6 max-w-md font-display text-4xl leading-tight text-bone">
              Reviva cada momento e escolha como quer <em className="text-gold italic">guardar suas lembranças</em>.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-mist">
              <Lock className="size-4 text-gold-400" /> Galeria privada · prévias protegidas por marca d&apos;água
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center px-5 py-14 sm:px-10">
          <Suspense fallback={<div className="h-[34rem] w-full max-w-md animate-pulse rounded-3xl bg-ink-850" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
