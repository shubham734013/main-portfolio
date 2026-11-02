import { createFileRoute } from "@tanstack/react-router";
import { ProjectsSection } from "@/components/site/ProjectsSection";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Work — Shubham" },
      {
        name: "description",
        content:
          "Selected projects by Shubham: WebGL, interfaces, design systems and more.",
      },
      { property: "og:title", content: "Work — Shubham" },
      { property: "og:description", content: "Selected projects by Shubham." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return <ProjectsSection />;
}
