"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Mounts a heavy 3D scene only when its container approaches the viewport,
 * reports visibility so the scene can pause its render loop, and unmounts
 * (disposing GPU resources) once it is far away again.
 */
export function SceneMount({
  className,
  children,
  fallback,
  enabled = true,
}: {
  className?: string;
  children: (visible: boolean) => ReactNode;
  fallback: ReactNode;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const nearObs = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "100% 0px 100% 0px" });
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "10% 0px" });
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, [enabled]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {enabled && near ? children(visible) : fallback}
    </div>
  );
}
