"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useExperience } from "./ExperienceProvider";

/**
 * Page-level motion wiring, mounted once:
 *  - a single ScrollTrigger.batch drives every [data-reveal] element
 *    (instead of one listener per element)
 *  - same-page anchor links route through Lenis
 */
export function PageMotion() {
  const { ready, reducedMotion, scrollTo } = useExperience();

  useEffect(() => {
    if (!ready) return;
    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (reducedMotion) {
      gsap.set(items, { opacity: 1, clearProps: "transform" });
      return;
    }
    gsap.set(items, { opacity: 0, y: 28 });
    const triggers = ScrollTrigger.batch(items, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
    });
    return () => triggers.forEach((t) => t.kill());
  }, [ready, reducedMotion]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href")!;
      const target = hash === "#" || hash === "#top" ? 0 : document.querySelector<HTMLElement>(hash);
      if (target === null) return;
      e.preventDefault();
      scrollTo(target === 0 ? 0 : (target as HTMLElement));
      if (target instanceof HTMLElement) {
        // Move focus for keyboard / screen-reader users without a second jump.
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      history.replaceState(null, "", hash === "#" ? " " : hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  // Refresh trigger positions once fonts/images have settled.
  useEffect(() => {
    if (!ready) return;
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, [ready]);

  return null;
}
