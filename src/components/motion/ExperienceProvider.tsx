"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export type Tier = "high" | "mid" | "low";

interface Experience {
  /** true once client capabilities are known — gate heavy rendering on this */
  ready: boolean;
  reducedMotion: boolean;
  tier: Tier;
  webgl: boolean;
  scrollTo: (target: string | number | HTMLElement, opts?: { immediate?: boolean }) => void;
  lockScroll: (locked: boolean) => void;
}

const ExperienceContext = createContext<Experience | null>(null);

export const useExperience = () => {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return ctx;
};

function detectWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function detectTier(): Tier {
  const w = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (w < 768 || (coarse && w < 1024) || cores <= 2 || memory <= 2) return "low";
  if (w < 1200 || coarse || cores <= 4 || memory <= 4) return "mid";
  return "high";
}

/**
 * One place that owns: device capability detection, reduced-motion preference,
 * and Lenis smooth scrolling synchronised to GSAP's ticker + ScrollTrigger.
 */
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tier, setTier] = useState<Tier>("high");
  const [webgl, setWebgl] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("js");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // ?motion=full | ?motion=reduced overrides the OS setting (QA / previews).
    const override = new URLSearchParams(location.search).get("motion");
    if (override === "full") document.documentElement.classList.add("motion-full");
    const sync = () => setReducedMotion(override === "full" ? false : override === "reduced" ? true : mq.matches);
    sync();
    setTier(detectTier());
    setWebgl(detectWebGL());
    setReady(true);
    mq.addEventListener("change", sync);

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTier(detectTier()));
    };
    window.addEventListener("resize", onResize);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Lenis ⇄ ScrollTrigger. Disabled entirely for reduced motion (native scroll).
  useEffect(() => {
    if (!ready || reducedMotion) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [ready, reducedMotion]);

  const value = useMemo<Experience>(
    () => ({
      ready,
      reducedMotion,
      tier,
      webgl,
      scrollTo: (target, opts) => {
        const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        if (el === null) return;
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(el as HTMLElement | number, { offset: 0, immediate: opts?.immediate, duration: 1.6 });
        } else if (typeof el === "number") {
          window.scrollTo({ top: el });
        } else {
          el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        }
      },
      lockScroll: (locked) => {
        const lenis = lenisRef.current;
        if (lenis) {
          if (locked) lenis.stop();
          else lenis.start();
        }
        document.documentElement.style.overflow = locked ? "hidden" : "";
      },
    }),
    [ready, reducedMotion, tier, webgl],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}
