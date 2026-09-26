"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { heroLoading } from "@/lib/loading";

const MIN_MS = 700;
const MAX_MS = 2600;

/**
 * Minimal preloader: WOLVO symbol + a thin progress line tied to the hero's
 * first frames. Never holds the visitor longer than MAX_MS, and a CSS
 * failsafe removes it even if JavaScript never runs.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = performance.now();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      window.setTimeout(() => setDone(true), wait);
    };
    const unsub = heroLoading.subscribe((p) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (p >= 1) finish();
    });
    const cap = window.setTimeout(finish, MAX_MS);
    return () => {
      unsub();
      clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950 transition-opacity duration-700 ease-out"
      style={{
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "auto",
        animation: "preloader-failsafe 0.6s 4s forwards",
      }}
    >
      <div className="flex flex-col items-center gap-8">
        <Image src="/assets/branding/wolvo-symbol-160.webp" alt="" width={160} height={118} priority className="h-14 w-auto" />
        <div className="h-px w-40 overflow-hidden bg-line">
          <div
            ref={barRef}
            className="h-full origin-left bg-gradient-to-r from-royal via-electric to-cyan transition-transform duration-300"
            style={{ transform: "scaleX(0.04)" }}
          />
        </div>
      </div>
    </div>
  );
}
