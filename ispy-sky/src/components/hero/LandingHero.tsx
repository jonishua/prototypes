"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 }
};

export function LandingHero() {
  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden">
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="pointer-events-none absolute left-1/2 top-12 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent-soft/30 blur-3xl"
      />

      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 2.4, ease: "easeOut" }}
        className="pointer-events-none absolute inset-x-0 bottom-[-120px] h-[320px] bg-[radial-gradient(120%_80%_at_50%_0%,rgba(160,196,255,0.18),transparent_75%)]"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-16 px-6 py-32 md:py-40">
        <motion.span
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.6em] text-text/40"
        >
          Curated cloud prototypes
          <span className="h-px w-16 bg-neutral" />
        </motion.span>

        <div className="space-y-10">
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            className="font-display text-[clamp(3rem,6vw,4.75rem)] font-extralight leading-[0.98] text-text"
          >
            iSpySky
            <span className="ml-4 inline-flex items-center rounded-full border border-[#d5dcf6] px-4 py-2 text-[0.65rem] uppercase tracking-[0.5em] text-text/50">
              prototypes & experiments
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="max-w-2xl text-[0.95rem] leading-[1.9] text-text/65"
          >
            Josh Gause curates light-touch interactive studies inspired by the sky: gentle systems,
            meditative loops, and design-forward prototypes that explore atmosphere with restraint.
            Expect fewer fireworks, more quiet detail.
          </motion.p>
        </div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12"
        >
          <Link
            href="/hub"
            className="inline-flex items-center justify-center rounded-full border border-accent/40 bg-accent text-[0.75rem] uppercase tracking-[0.4em] text-white transition-all duration-500 ease-gentle-out hover:-translate-y-0.5 hover:shadow-subtle hover:saturate-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <span className="px-8 py-4">Enter the collection</span>
          </Link>

          <div className="flex max-w-sm flex-col gap-3 text-[0.72rem] uppercase tracking-[0.35em] text-text/45">
            <div className="flex items-center gap-2 text-text/55">
              <span className="inline-flex h-2 w-2 rounded-full border border-accent/40" />
              Subtle cloud motif
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-8 bg-neutral-soft" />
              Slow reveal interactions
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full border border-text/20" />
              Smaller type · generous space
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

