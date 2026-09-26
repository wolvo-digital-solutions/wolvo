import { company, navLinks, socials } from "@/data/company";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-line/70 bg-navy-950">
      <div className="container-x grid gap-14 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Logo />
          <p className="mt-6 font-display text-2xl uppercase tracking-tight md:text-3xl">
            Ideas <span className="text-sky">→</span> Digital <span className="text-sky">→</span> Impact
          </p>
          <p className="mt-4 max-w-sm text-sm text-muted">{company.descriptor}.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow text-muted">Explore</h2>
          <ul className="mt-5 space-y-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-ink/90 transition-colors hover:text-cyan">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-muted">Social</h2>
          <ul className="mt-5 space-y-3">
            {socials.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-ink/90 transition-colors hover:text-cyan">
                    {s.label}
                  </a>
                ) : (
                  <span className="text-ink/60">
                    {s.label} <span className="placeholder text-[0.65rem]">[URL — TO BE PROVIDED]</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-3 border-t border-line/50 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 WOLVO. All rights reserved.</p>
        <a href="#top" className="uppercase tracking-[0.2em] transition-colors hover:text-ink">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
