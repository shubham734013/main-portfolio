import { createServerFn } from "@tanstack/react-start";
import { list, put } from "@vercel/blob";
import nodemailer from "nodemailer";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

// SMTP configuration
const smtpConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "",
  },
};

// Create reusable transporter object
const createTransporter = () => {
  return nodemailer.createTransport(smtpConfig);
};

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    const inquiry: Inquiry = {
      id: crypto.randomUUID(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    let stored = false;
    let storageError: unknown;
    try {
      await put(
        `inquiries/${inquiry.id}.json`,
        JSON.stringify(inquiry),
        { access: "private", addRandomSuffix: false },
      );
      stored = true;
    } catch (error) {
      storageError = error;
      console.error("Inquiry storage failed", error);
    }

    let emailed = false;
    // Send email via SMTP if configured
    const smtpUser = process.env.SMTP_USER;
    const smtpPass =
      process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
    const contactEmail = process.env.CONTACT_EMAIL || "shubhamvaishnav640@gmail.com";

    if (smtpUser && smtpPass) {
      try {
        const transporter = createTransporter();

        // Test the connection first
        await transporter.verify();

        // Send the email
        await transporter.sendMail({
          from:
            process.env.SMTP_FROM || `Portfolio Contact Form <${smtpUser}>`,
          to: process.env.SMTP_TO || contactEmail,
          replyTo: email,
          subject: `New portfolio inquiry from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Portfolio Inquiry</h2>
              <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <div style="margin: 20px 0;">
                <h3 style="color: #555;">Message:</h3>
                <p style="line-height: 1.6; white-space: pre-wrap; background-color: #fff; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px;">${message}</p>
              </div>
              <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
                <p>This inquiry was submitted via your portfolio contact form.</p>
                <p><strong>Reply to:</strong> <a href="mailto:${email}">${email}</a></p>
              </div>
            </div>
          `,
        });

        emailed = true;
        console.log(`Inquiry email sent successfully to ${contactEmail}`);
      } catch (error) {
        console.error("SMTP email notification failed:", error);
      }
    }

    if (!stored && !emailed) {
      throw new Error(
        storageError
          ? "Inquiry storage is unavailable and email delivery is not configured."
          : "Email delivery is not configured.",
      );
    }

    return { success: true };
  });

export const loadInquiries = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
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
    } catch (error) {
      console.error("Failed to load inquiries", error);
      return [];
    }
  },
);
