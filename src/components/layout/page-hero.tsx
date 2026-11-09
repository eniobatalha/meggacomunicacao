import Image from "next/image";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  children,
  image,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  image?: string;
}) {
  return (
    <section className="grain relative overflow-hidden bg-ink-950 pt-36 pb-16 sm:pt-44 sm:pb-20">
      {image && (
        <>
          <Image src={image} alt="" fill preload sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
        </>
      )}
      <div className="container-page relative">
        <p className="eyebrow animate-fade-up">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl animate-fade-up font-display text-5xl leading-[1.02] font-medium [animation-delay:100ms] sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {children && (
          <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-silver [animation-delay:200ms]">
            {children}
          </p>
        )}
      </div>
    </section>
  );
}
