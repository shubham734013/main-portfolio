import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/site/ContactSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Contact — Shubham" },
      {
        name: "description",
        content:
          "Get in touch with Shubham for creative engineering and collaborations.",
      },
      { property: "og:title", content: "Contact — Shubham" },
      {
        property: "og:description",
        content:
          "Get in touch with Shubham for creative engineering and collaborations.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return <ContactSection />;
}
