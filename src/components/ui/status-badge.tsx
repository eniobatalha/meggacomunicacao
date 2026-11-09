import { ORDER_STATUS, type OrderStatus } from "@/lib/store/orders";
import { cn } from "@/lib/cn";

const tones = {
  gold: "bg-gold-500/12 text-gold-300 ring-gold-500/30",
  green: "bg-success/12 text-success ring-success/30",
  blue: "bg-info/12 text-info ring-info/30",
  muted: "bg-white/5 text-mist ring-white/10",
  red: "bg-danger/12 text-danger ring-danger/30",
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const s = ORDER_STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ring-1 ring-inset", tones[s.tone], className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {s.label}
    </span>
  );
}
