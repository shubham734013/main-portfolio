import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/site/AboutSection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "About — Shubham" },
      {
        name: "description",
        content:
          "The story, skills and journey of Shubham, creative developer.",
      },
      { property: "og:title", content: "About — Shubham" },
      {
        property: "og:description",
        content: "The story, skills and journey of Shubham.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return <AboutSection />;
}
