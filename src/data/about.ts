import { Code2, Compass, Cpu, MessagesSquare, Rocket, Search, Sparkles, Target } from 'lucide-react';
import type { ProcessStep, ProofPoint, Stat } from '@/types/content';

export const proofPoints: ProofPoint[] = [
  {
    title: 'Modern technology',
    description: 'Proven, modern stacks that keep your product fast, secure and easy to grow.',
    icon: Cpu,
  },
  {
    title: 'Creative thinking',
    description: 'Design-led ideas that make your brand memorable — not just functional.',
    icon: Sparkles,
  },
  {
    title: 'Transparent communication',
    description: 'Talk directly to the people building your project. No middlemen, no guesswork.',
    icon: MessagesSquare,
  },
  {
    title: 'Result-driven execution',
    description: 'Every decision ties back to your goals — leads, sales, sign-ups or reach.',
    icon: Target,
  },
];

/**
 * Structural facts about how Wolvo works (not performance claims).
 * Swap in verified numbers (projects shipped, years active) once available.
 */
export const stats: Stat[] = [
  { value: 6, pad: 2, label: 'Core digital services' },
  { value: 4, pad: 2, label: 'Step delivery process' },
  { value: 1, pad: 2, label: 'Team from idea to launch' },
  { value: 100, suffix: '%', label: 'Custom-built, no templates' },
];

export const processSteps: ProcessStep[] = [
  {
    id: 'discover',
    title: 'Discover',
    description: 'We get to know your business, audience, goals and requirements.',
    icon: Search,
  },
  {
    id: 'plan',
    title: 'Plan',
    description: 'We define the solution, scope, design direction and roadmap.',
    icon: Compass,
  },
  {
    id: 'build',
    title: 'Build',
    description: 'We design, develop, test and refine — with you in the loop.',
    icon: Code2,
  },
  {
    id: 'launch',
    title: 'Launch',
    description: 'We ship your product and stay on hand for support and growth.',
    icon: Rocket,
  },
];
