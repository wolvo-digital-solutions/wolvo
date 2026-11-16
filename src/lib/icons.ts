import {
  Clapperboard,
  Code,
  Cpu,
  Database,
  Globe,
  Layers,
  Layout,
  Megaphone,
  Monitor,
  Palette,
  PenTool,
  Rocket,
  Search,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Video,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Monitor,
  Smartphone,
  Megaphone,
  Clapperboard,
  PenTool,
  Share2,
  Code,
  Layout,
  Layers,
  Rocket,
  Sparkles,
  Cpu,
  Database,
  Globe,
  ShieldCheck,
  TrendingUp,
  Video,
  Palette,
  Search,
  Zap,
};

export const AVAILABLE_ICON_NAMES = Object.keys(ICON_MAP);

export function getIconComponent(name?: string | null): LucideIcon {
  if (!name) return Sparkles;
  return ICON_MAP[name] ?? Sparkles;
}
