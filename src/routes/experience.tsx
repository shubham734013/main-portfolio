import { createFileRoute } from "@tanstack/react-router";
import { ExperienceSection } from "@/components/site/ExperienceSection";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Experience — Shubham" },
      {
        name: "description",
        content:
          "Career milestones, technical mastery, and engineering philosophy of Shubham.",
      },
      { property: "og:title", content: "Experience — Shubham" },
      {
        property: "og:description",
        content:
          "Career milestones, technical mastery, and engineering philosophy of Shubham.",
      },
    ],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  return <ExperienceSection />;
}
