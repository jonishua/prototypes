import { getAllProjects } from "@/data/projects";
import { ProjectGallery } from "@/components/hub/ProjectGallery";

export default function HubPage() {
  const projects = getAllProjects();
  return <ProjectGallery projects={projects} />;
}

