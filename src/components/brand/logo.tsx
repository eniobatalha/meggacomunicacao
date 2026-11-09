import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, href = "/", preload }: { className?: string; href?: string; preload?: boolean }) {
  return (
    <Link href={href} className={cn("relative block shrink-0", className)} aria-label="Megga Comunicação — página inicial">
      <Image
        src="/brand/logo-horizontal.png"
        alt="Megga Comunicação"
        width={1200}
        height={378}
        preload={preload}
        loading="eager"
        sizes="200px"
        className="h-full w-auto"
      />
    </Link>
  );
}

export function BrandSymbol({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/simbolo.png"
      alt=""
      aria-hidden
      width={512}
      height={571}
      loading="eager"
      sizes="120px"
      className={cn("h-auto", className)}
    />
  );
}
