import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Imagem que aceita tanto arquivos de /public quanto uploads feitos no
 * painel (data URL), que não passam pelo otimizador do Next.
 */
export function MediaImage({
  src,
  alt,
  sizes,
  className,
  fill,
  width,
  height,
  preload,
  eager,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  /** Imagem principal da página: baixa antes de tudo */
  preload?: boolean;
  /** Visível logo ao abrir a página (sem carregamento preguiçoso) */
  eager?: boolean;
}) {
  const local = src.startsWith("data:") || src.startsWith("blob:");
  const protect = { draggable: false };
  const loading = eager && !preload ? ("eager" as const) : undefined;
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized={local}
        preload={preload}
        loading={loading}
        className={cn("select-none", className)}
        {...protect}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1400}
      height={height ?? 933}
      sizes={sizes}
      unoptimized={local}
      preload={preload}
      loading={loading}
      className={cn("select-none", className)}
      {...protect}
    />
  );
}
