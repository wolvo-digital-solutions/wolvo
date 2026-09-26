"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, socials } from "@/data/company";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { lockScroll } = useExperience();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      // Keep focus inside the open menu.
      if (e.key === "Tab" && menuRef.current) {
        // DOM order: the toggle sits before the menu panel.
        const f = [toggleRef.current!, ...Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button"))];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, lockScroll]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled && !open
          ? "border-b border-line/60 bg-navy-950/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Primary" className="container-x flex h-[var(--nav-h)] items-center justify-between gap-6">
        <a href="#top" className="relative z-10 -m-2 p-2" aria-label="WOLVO — back to top">
          <Logo priority />
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative py-2 font-display text-[0.78rem] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-sky after:transition-transform after:duration-500 hover:after:scale-x-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ButtonLink href="#contact" className="min-h-10 px-5 text-[0.72rem]">
              Start a project
            </ButtonLink>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="relative z-10 inline-flex size-11 items-center justify-center rounded-[4px] border border-line text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-0 bg-navy-950/97 backdrop-blur-lg md:hidden"
      >
        <div className="container-x flex h-full flex-col justify-between pb-10 pt-[calc(var(--nav-h)+2rem)]">
          <ul className="space-y-2">
            {navLinks.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-3 font-display text-4xl uppercase tracking-tight"
                >
                  <span className="text-xs tracking-[0.2em] text-sky">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="space-y-6">
            <ButtonLink href="#contact" onClick={() => setOpen(false)} className="w-full">
              Start a project
            </ButtonLink>
            <p className="text-sm text-muted">
              {socials.map((s) => s.label).join(" · ")}
              <span className="placeholder ml-2 text-[0.7rem]">[SOCIAL URLS — TO BE PROVIDED]</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
