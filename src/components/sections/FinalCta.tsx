"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { company } from "@/data/company";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { ButtonLink } from "@/components/ui/Button";
import { ContactForm } from "@/components/ui/ContactForm";

/**
 * The journey closes where it began: the supplied wolf frame returns, lit by
 * the same blue energy, and hands over to the enquiry form.
 */
export function FinalCta() {
  const { ready, reducedMotion } = useExperience();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready || reducedMotion) return;
      const q = gsap.utils.selector(root);
      const stage = q("[data-cta-stage]")[0];
      gsap
        .timeline({ scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: 0.6 } })
        .fromTo(q("[data-wolf]"), { scale: 1.18, yPercent: 6, opacity: 0.35 }, { scale: 1, yPercent: -4, opacity: 1, ease: "none" }, 0)
        .fromTo(q("[data-energy-line]"), { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0.1);
      gsap.from(q("[data-cta-copy] > *"), {
        autoAlpha: 0,
        y: 36,
        stagger: 0.12,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: stage, start: "top 55%", once: true },
      });
    },
    { scope: root, dependencies: [ready, reducedMotion] },
  );

  return (
    <section id="contact" ref={root} aria-labelledby="cta-title" className="relative">
      <div data-cta-stage className="relative flex min-h-svh items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-wolf
          src="/assets/video-frames/hero/poster-lg.webp"
          srcSet="/assets/video-frames/hero/poster-sm.webp 900w, /assets/video-frames/hero/poster-lg.webp 1600w"
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-y-0 left-0 h-full w-full object-cover object-center will-change-transform md:left-[22%]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/30 to-navy-950" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/20 to-transparent" />

        <div className="container-x relative" data-cta-copy>
          <p className="eyebrow">
            <span className="text-muted">11</span>
            <span aria-hidden className="mx-3 inline-block h-px w-8 translate-y-[-3px] bg-sky/60" />
            Start a project
          </p>
          <h2 id="cta-title" className="mt-6 text-[clamp(3rem,8vw,8rem)] uppercase leading-[0.92]">
            Have an idea?
            <br />
            <span className="text-brand">Let&rsquo;s build it.</span>
          </h2>
          <p className="mt-8 max-w-md text-lg text-ink/80">
            Tell us what you&rsquo;re planning — an app, a website, a brand or a campaign — and we&rsquo;ll get back to you with next
            steps.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#enquiry" magnetic>
              Start a project
            </ButtonLink>
            <ButtonLink href={company.email ? `mailto:${company.email}` : "#enquiry"} variant="secondary" icon={false}>
              Talk to WOLVO
            </ButtonLink>
          </div>
        </div>
        <div
          aria-hidden
          data-energy-line
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-royal via-electric to-cyan shadow-[0_0_20px_rgb(24_172_253/0.8)]"
        />
      </div>

      <div id="enquiry" className="relative scroll-mt-[var(--nav-h)] py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h3 className="font-display text-h3 uppercase">Project enquiry</h3>
            <p className="mt-5 max-w-sm text-muted">A few details help us understand your idea and reply with something useful.</p>
            <dl className="mt-10 space-y-5 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-faint">Email</dt>
                <dd className="mt-1">
                  {company.email ? (
                    <a href={`mailto:${company.email}`} className="hover:text-cyan">
                      {company.email}
                    </a>
                  ) : (
                    <span className="placeholder">[CONTACT EMAIL — TO BE PROVIDED]</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
          <div className="panel rounded-[8px] p-6 md:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
