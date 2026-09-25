import { ExperienceProvider } from "@/components/motion/ExperienceProvider";
import { PageMotion } from "@/components/motion/PageMotion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { Hero } from "@/components/sections/Hero";
import { Trust } from "@/components/sections/Trust";
import { Services } from "@/components/sections/Services";
import { Capabilities } from "@/components/sections/Capabilities";
import { Work } from "@/components/sections/Work";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stubs = [
  ["process", "Process"],
  ["about", "About WOLVO"],
  ["founders", "Founders"],
  ["technology", "Technology"],
  ["testimonials", "Testimonials"],
  ["vision", "Global vision"],
  ["contact", "Final CTA"],
] as const;

export default function Home() {
  return (
    <ExperienceProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-navy-950"
      >
        Skip to content
      </a>
      <Preloader />
      <PageMotion />
      <Navbar />
      <main id="main">
        <Hero />
        <Trust />
        <Services />
        <Capabilities />
        <Work />
        {stubs.map(([id, name], i) => (
          <section key={id} id={id} className="container-x flex min-h-screen items-center border-b border-line/40">
            <SectionHeading index={String(i + 6).padStart(2, "0")} eyebrow={name} title={name} />
          </section>
        ))}
      </main>
      <Footer />
    </ExperienceProvider>
  );
}
