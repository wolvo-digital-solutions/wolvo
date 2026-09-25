"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once, client-side only.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  // Dev-only handle for debugging timelines from the console / QA scripts.
  if (process.env.NODE_ENV !== "production") Object.assign(window, { gsap, ScrollTrigger });
}

export { gsap, ScrollTrigger, useGSAP };
