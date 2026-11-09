import { BookImage, Camera, Cast, Clapperboard, GraduationCap, Smartphone } from "lucide-react";
import type { ServiceIcon as IconName } from "@/lib/data/services";

const ICONS = {
  camera: Camera,
  album: BookImage,
  film: Clapperboard,
  story: Smartphone,
  school: GraduationCap,
  live: Cast,
} as const;

export function ServiceIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={1.5} />;
}
