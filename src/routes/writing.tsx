import { createFileRoute } from "@tanstack/react-router";
import { WritingSection } from "@/components/site/WritingSection";

export const Route = createFileRoute("/writing")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Writing & Notes — Shubham" },
      {
        name: "description",
        content:
          "Deep dives into creative coding, motion design, fluid glass interfaces, and WebGL.",
      },
      { property: "og:title", content: "Writing & Notes — Shubham" },
      {
        property: "og:description",
        content:
          "Deep dives into creative coding, motion design, fluid glass interfaces, and WebGL.",
      },
    ],
  }),
  component: WritingPage,
});

function WritingPage() {
  return <WritingSection />;
}
