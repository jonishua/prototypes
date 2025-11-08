import { projects } from "@/data/projects";
import { ProjectGallery } from "@/components/hub/ProjectGallery";

export default function HubPage() {
  return <ProjectGallery projects={projects} />;
}

