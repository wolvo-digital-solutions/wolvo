import type { ComponentType } from 'react';
import {
  Code2,
  Compass,
  Cpu,
  MessagesSquare,
  Rocket,
  Search,
  Sparkles,
  Target,
  Globe,
  Smartphone,
  Megaphone,
  Video,
  Palette,
  Share2,
  Layers,
  Shield,
  Zap,
  Database,
} from 'lucide-react';
import type { DynamicIconName } from '@/types/cms';

export interface IconOption {
  name: DynamicIconName;
  label: string;
  component: ComponentType<{ className?: string; size?: number; strokeWidth?: number; color?: string }>;
}

export const DYNAMIC_ICONS: Record<DynamicIconName, ComponentType<{ className?: string; size?: number; strokeWidth?: number; color?: string }>> = {
  Code2,
  Compass,
  Cpu,
  MessagesSquare,
  Rocket,
  Search,
  Sparkles,
  Target,
  Globe,
  Smartphone,
  Megaphone,
  Video,
  Palette,
  Share2,
  Layers,
  Shield,
  Zap,
  Database,
};

export const AVAILABLE_ICONS: IconOption[] = [
  { name: 'Sparkles', label: 'Sparkles (Default)', component: Sparkles },
  { name: 'Globe', label: 'Web & Globe', component: Globe },
  { name: 'Smartphone', label: 'Mobile App', component: Smartphone },
  { name: 'Megaphone', label: 'Marketing & Ads', component: Megaphone },
  { name: 'Video', label: 'Video Production', component: Video },
  { name: 'Palette', label: 'Branding & Design', component: Palette },
  { name: 'Share2', label: 'Social Media', component: Share2 },
  { name: 'Code2', label: 'Code & Dev', component: Code2 },
  { name: 'Cpu', label: 'Technology / AI', component: Cpu },
  { name: 'Rocket', label: 'Launch & Growth', component: Rocket },
  { name: 'Target', label: 'Strategy & Target', component: Target },
  { name: 'Compass', label: 'Planning & Roadmap', component: Compass },
  { name: 'Search', label: 'Discovery / SEO', component: Search },
  { name: 'Layers', label: 'Architecture / Stacks', component: Layers },
  { name: 'Shield', label: 'Security & Auth', component: Shield },
  { name: 'Zap', label: 'Performance / Speed', component: Zap },
  { name: 'Database', label: 'Database & Cloud', component: Database },
  { name: 'MessagesSquare', label: 'Communication', component: MessagesSquare },
];

export function resolveIcon(name?: string): ComponentType<{ className?: string; size?: number; strokeWidth?: number; color?: string }> {
  if (!name) return Sparkles;
  return DYNAMIC_ICONS[name as DynamicIconName] || Sparkles;
}
