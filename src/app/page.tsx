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
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Founders } from "@/components/sections/Founders";
import { Technology } from "@/components/sections/Technology";
import { Testimonials } from "@/components/sections/Testimonials";
import { GlobalVision } from "@/components/sections/GlobalVision";
import { FinalCta } from "@/components/sections/FinalCta";
import { siteMeta, siteUrl } from "@/lib/site";
import { services } from "@/data/services";

// Structured data: only verified facts (name, description, services offered).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WOLVO",
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  description: siteMeta.description,
  slogan: "Ideas → Digital → Impact",
  makesOffer: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.summary } })),
};

export default function Home() {
  return (
    <ExperienceProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
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
        <Process />
        <About />
        <Founders />
        <Technology />
        <Testimonials />
        <GlobalVision />
        <FinalCta />
      </main>
      <Footer />
    </ExperienceProvider>
  );
}
