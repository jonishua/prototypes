"use client";

import Link from "next/link";
import type { ProjectEntry } from "@/data/projects";

type Props = {
  project: ProjectEntry;
};

export function ProjectDetailPanel({ project }: Props) {
  const isExternal = project.ctaHref.startsWith("http");

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-12 rounded-[36px] border border-neutral-soft bg-surface/95 p-10 shadow-soft md:grid-cols-[1.05fr_0.95fr] md:p-14">
      <div className="flex flex-col gap-8">
        <div className="space-y-5">
          <span className="text-[0.65rem] uppercase tracking-[0.6em] text-text/45">
            {project.status}
          </span>
          <h1 className="font-display text-[clamp(2.8rem,5vw,3.8rem)] font-light leading-[1.05] text-text">
            {project.title}
          </h1>
          <p className="max-w-xl text-[0.98rem] leading-[1.85] text-text/70">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-text/45">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-soft/80 px-4 py-1 text-text/55"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-6 text-[0.72rem] uppercase tracking-[0.4em]">
          <Link
            href={project.ctaHref}
            prefetch={!isExternal}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer noopener" : undefined}
            className="inline-flex items-center gap-3 rounded-full border border-accent/35 bg-accent px-7 py-3 text-white transition duration-500 ease-gentle-out hover:-translate-y-0.5 hover:shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            {project.ctaLabel}
          </Link>
          <Link
            href="/hub"
            className="inline-flex items-center gap-3 rounded-full border border-neutral-soft px-6 py-3 text-text/55 transition duration-300 ease-gentle-out hover:-translate-y-0.5 hover:border-accent/35 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
          >
            Back to collection
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-3xl border border-neutral-soft/80 bg-surface-muted/60 shadow-[0_24px_48px_rgba(15,23,42,0.08)] transition duration-700 ease-gentle-out hover:border-accent/40">
          <img
            src={project.artwork}
            alt={`${project.title} artwork`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.4em] text-text/45">
          <span>Captured mood</span>
          <span className="flex items-center gap-2 text-text/35">
            <span className="h-1 w-10 bg-neutral-soft" />
            {project.tags[0]}
          </span>
        </div>
      </div>
    </section>
  );
}

