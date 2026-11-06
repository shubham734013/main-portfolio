import { createServerFn } from "@tanstack/react-start";
import { list, put } from "@vercel/blob";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const configured = process.env.ADMIN_PASSWORD?.trim();
    const expected = configured || "shubham2026";
    return data.password.trim() === expected;
  });

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; message: string }) => data)
  .handler(async ({ data }) => {
    const name = data.name.trim();
    const email = data.email.trim();
    const message = data.message.trim();

    if (!name || !email || !message) {
      throw new Error("Name, email, and message are required.");
    }

    const inquiry: Inquiry = {
      id: crypto.randomUUID(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    await put(
      `inquiries/${inquiry.id}.json`,
      JSON.stringify(inquiry),
      { access: "private", addRandomSuffix: false },
    );

    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from:
              process.env.CONTACT_FROM_EMAIL ||
              "Portfolio <onboarding@resend.dev>",
            to:
              process.env.CONTACT_EMAIL ||
              "shubhamvaishnav640@gmail.com",
            reply_to: email,
            subject: `New portfolio inquiry from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
          }),
          signal: AbortSignal.timeout(15_000),
        });
      } catch (error) {
        console.error("Inquiry email notification failed", error);
      }
    }

    return { success: true };
  });

export const loadInquiries = createServerFn({ method: "GET" }).handler(
  async () => {
    const { blobs } = await list({ prefix: "inquiries/" });
    const inquiries = await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(blob.downloadUrl);
        if (!response.ok) return null;
        return (await response.json()) as Inquiry;
      }),
    );

    return inquiries
      .filter((inquiry): inquiry is Inquiry => inquiry !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
);
