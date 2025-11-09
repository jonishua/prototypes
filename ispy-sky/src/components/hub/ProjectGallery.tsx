"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import Link from "next/link";
import type { ProjectEntry } from "@/data/projects";

type Props = {
  projects: ProjectEntry[];
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, rotate: -0.6 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    rotate: index % 2 === 0 ? 0.4 : -0.2,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      delay: index * 0.08
    }
  })
};

export function ProjectGallery({ projects }: Props) {
  const pairings = useMemo(
    () =>
      projects.map((project, index) => {
        const layout = index % 3;
        return {
          project,
          layoutClass:
            layout === 0
              ? "md:translate-y-[-6%] lg:translate-y-[-4%] lg:col-span-1"
              : layout === 1
                ? "md:translate-y-[6%] lg:col-span-1"
                : "md:translate-y-[-2%] lg:col-span-1",
          surfaceClass:
            layout === 1
              ? "md:pr-16"
              : ""
        };
      }),
    [projects]
  );

  return (
    <div className="relative min-h-screen bg-transparent">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[260px] bg-[radial-gradient(120%_90%_at_50%_0%,rgba(160,196,255,0.18),transparent_70%)]" />

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-24 md:py-28 lg:py-32">
        <header className="space-y-6 md:max-w-2xl">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text/40">
            <span className="h-px w-16 bg-neutral" />
            Prototype index
          </div>
          <h1 className="font-display text-[clamp(2.4rem,4vw,3.2rem)] font-light leading-tight text-text">
            A quieter cloud hub
          </h1>
          <p className="text-[0.95rem] leading-[1.85] text-text/65">
            Each study keeps the same content as before, now reframed through a lighter palette,
            asymmetrical composition, and restrained motion. Hover to reveal intent; click to explore
            details or launch the active build.
          </p>
        </header>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 gap-10 md:grid-cols-2"
        >
          {pairings.map(({ project, layoutClass, surfaceClass }, index) => {
            const isExternal = project.ctaHref.startsWith("http");
            return (
              <motion.article
                key={project.id}
                custom={index}
                variants={cardVariants}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-soft bg-surface/95 shadow-subtle transition-all duration-700 ease-gentle-out hover:-translate-y-3 hover:border-accent/45 hover:shadow-soft ${layoutClass}`}
              >
                <div className={`flex flex-1 flex-col gap-8 p-8 md:p-10 ${surfaceClass}`}>
                  <div className="flex items-start justify-between gap-6">
                    <div className="space-y-3">
                      <span className="text-[0.65rem] uppercase tracking-[0.55em] text-text/45">
                        {project.status}
                      </span>
                      <h2 className="font-display text-[2rem] font-light leading-[1.05] text-text">
                        {project.title}
                      </h2>
                    </div>
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 text-[0.65rem] uppercase tracking-[0.4em] text-text/50 transition-colors duration-500 group-hover:border-accent group-hover:text-accent">
                      {index + 1}
                    </span>
                  </div>

                  <p className="max-w-md text-[0.92rem] leading-[1.75] text-text/70">{project.blurb}</p>

                  <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-text/40">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-neutral-soft/80 px-4 py-1 transition-colors duration-500 group-hover:border-accent/30 group-hover:text-text/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6 border-t border-neutral-soft/80 bg-surface-muted/60 p-8">
                  <div className="overflow-hidden rounded-2xl border border-neutral-soft/70 bg-surface shadow-[0_16px_36px_rgba(15,23,42,0.06)] transition duration-700 group-hover:border-accent/35">
                    <img
                      src={project.artwork}
                      alt={`${project.title} artwork`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[0.72rem] uppercase tracking-[0.4em] text-text/55">
                    <Link
                      href={project.ctaHref}
                      prefetch={false}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer noopener" : undefined}
                      className="inline-flex items-center gap-3 rounded-full border border-accent/40 bg-accent px-6 py-3 text-white transition duration-500 ease-gentle-out hover:-translate-y-0.5 hover:shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      {project.ctaLabel}
                    </Link>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-text/55 transition duration-300 ease-gentle-out hover:text-text"
                    >
                      <span className="h-2 w-2 rounded-full border border-text/30" aria-hidden />
                      Detail view
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}

