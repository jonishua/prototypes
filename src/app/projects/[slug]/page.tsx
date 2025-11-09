import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/data/projects";
import { ProjectDetailPanel } from "@/components/projects/ProjectDetailPanel";

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.slug
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Prototype not found — iSpySky",
      description: "The requested prototype could not be located."
    };
  }

  return {
    title: `${project.title} — iSpySky`,
    description: project.blurb,
    openGraph: {
      title: project.title,
      description: project.blurb,
      type: "website",
      url: `https://ispy-sky.vercel.app/projects/${project.slug}`
    }
  };
}

export default function ProjectPage({ params }: Props) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 h-[220px] bg-[radial-gradient(120%_80%_at_50%_0%,rgba(160,196,255,0.18),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.75)_0%,rgba(248,248,248,0.95)_28%,#f8f8f8_100%)]" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 md:py-28">
        <ProjectDetailPanel project={project} />
      </div>
    </div>
  );
}

