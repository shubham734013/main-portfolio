import { createFileRoute } from "@tanstack/react-router";
import { CertificatesSection } from "@/components/site/CertificatesSection";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Certificates — Shubham" },
      {
        name: "description",
        content: "Certifications and credentials earned by Shubham.",
      },
      { property: "og:title", content: "Certificates — Shubham" },
      {
        property: "og:description",
        content: "Certifications and credentials earned by Shubham.",
      },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  return <CertificatesSection />;
}
