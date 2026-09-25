import { cn } from "@/lib/utils";

/**
 * Renders content that still needs to be supplied by WOLVO. Values wrapped in
 * [SQUARE BRACKETS] get the dashed placeholder style so they can never be
 * mistaken for real copy.
 */
export function Content({ value, className }: { value: string; className?: string }) {
  const isPlaceholder = /^\[.*\]$/.test(value.trim());
  return <span className={cn(isPlaceholder && "placeholder", className)}>{value}</span>;
}

export const isPlaceholder = (value: string) => /^\[.*\]$/.test(value.trim());
