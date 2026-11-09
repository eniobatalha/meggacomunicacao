import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center")}>
          <span className="h-px w-8 bg-gold-500/60" aria-hidden />
          {eyebrow}
          {align === "center" && <span className="h-px w-8 bg-gold-500/60" aria-hidden />}
        </p>
      )}
      <h2 className="mt-4 font-display text-4xl leading-[1.05] font-medium text-bone sm:text-5xl md:text-[3.4rem]">
        {title}
      </h2>
      {children && <div className="mt-5 text-base leading-relaxed text-mist sm:text-lg">{children}</div>}
    </div>
  );
}
