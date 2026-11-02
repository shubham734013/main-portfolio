import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/site/AdminDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Admin Studio — Shubham Portfolio" },
      {
        name: "description",
        content:
          "Portfolio control room: add certificates, journey milestones, selected work, experience craft, and articles.",
      },
      { property: "og:title", content: "Admin Studio — Shubham Portfolio" },
      {
        property: "og:description",
        content:
          "Portfolio control room: add certificates, journey milestones, selected work, experience craft, and articles.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return <AdminDashboard />;
}
