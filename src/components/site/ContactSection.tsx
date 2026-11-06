import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Split, Tilt, useScrollFx } from "@/components/site/reveal";
import { Magnetic } from "@/components/site/Shell";
import { contactDetails } from "@/components/site/data";
import { ScrambleText } from "@/components/site/TextEffects";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { submitInquiry } from "@/lib/inquiries";

const socialIcons = {
  GitHub: Github,
  LinkedIn: Linkedin,
  "Twitter / X": Twitter,
  Email: Mail,
};

export function ContactSection({ embedded = false }: { embedded?: boolean }) {
  const ref = useScrollFx();
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(contactDetails.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formState.name.trim() ||
      !formState.email.trim() ||
      !formState.message.trim()
    )
      return;
    setSending(true);
    setSubmitError("");

    try {
      await submitInquiry({
        data: {
          name: formState.name.trim(),
          email: formState.email.trim(),
          message: formState.message.trim(),
        },
      });

      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      window.setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setSubmitError(
        "The message could not be sent. Please email me directly or try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      ref={ref}
      className={`px-6 pb-24 md:px-16 ${embedded ? "pt-24" : "pt-40"}`}
    >
      {!embedded && (
        <div className="mb-8">
          <Link
            to="/"
            className="glass group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            <span>Back to overview</span>
          </Link>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="w-full min-w-0 sm:w-auto">
          <p className="text-xs uppercase tracking-[0.5em] text-primary">
            Get in touch
          </p>
          <h2 className="mt-4 max-w-full font-display text-[clamp(1.35rem,7vw,1.9rem)] font-extrabold leading-[0.95] tracking-[-0.04em] min-[390px]:text-[clamp(1.55rem,7.5vw,2.2rem)] sm:text-6xl md:text-7xl xl:text-8xl">
            <Split text="Let's connect &" />{" "}
            <span className="text-liquid">collaborate</span>
          </h2>
        </div>

        {/* Live Local Time Widget */}
        <div className="glass flex items-center gap-3 rounded-full px-5 py-2.5 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-muted-foreground">IST (India)</span>
          <span className="font-mono font-bold text-primary">
            {mounted ? time : "21:30:00"}
          </span>
        </div>
      </div>

      <p
        data-reveal
        className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg"
      >
        Have an exciting project, an ambitious vision, or simply want to talk
        creative development? My inbox is always open.
      </p>

      {/* Main Grid: Form + Direct Contact Cards */}
      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        {/* Left Column: Direct Info & Copy Button */}
        <div className="space-y-6 lg:col-span-5">
          <Tilt className="w-full">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Direct Contact
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold">
                Drop an email
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Typically replying within 24 hours.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="font-mono text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors break-all"
                >
                  {contactDetails.email}
                </a>
                <Magnetic>
                  <Button
                    variant="ghost"
                    onClick={handleCopy}
                    className="glass h-9 rounded-full px-4 text-xs font-semibold text-primary transition active:scale-90"
                  >
                    {copied ? "✓ Copied!" : "Copy address"}
                  </Button>
                </Magnetic>
              </div>

              <div className="mt-6 border-t border-glass-border pt-4 text-xs text-muted-foreground">
                <p>📍 {contactDetails.location}</p>
                <p className="mt-1 text-primary">
                  ● {contactDetails.availability}
                </p>
              </div>
            </div>
          </Tilt>

          <Tilt className="w-full">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Social Channels
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold">
                Find me online
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {contactDetails.socials.map((s) => (
                  <Magnetic key={s.name} className="w-full">
                    <a
                      href={s.url}
                      target={
                        s.url.startsWith("mailto:") ? undefined : "_blank"
                      }
                      rel={
                        s.url.startsWith("mailto:")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="glass group flex flex-col rounded-2xl p-4 transition-all duration-300 hover:border-primary/60 hover:-translate-y-1"
                    >
                      <span className="mb-3 flex size-10 items-center justify-center rounded-xl border border-glass-border bg-white/5 text-primary transition-transform duration-300 group-hover:scale-105">
                        {(() => {
                          const SocialIcon =
                            socialIcons[s.name as keyof typeof socialIcons];
                          return (
                            <SocialIcon aria-hidden="true" className="size-5" />
                          );
                        })()}
                      </span>
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                        <ScrambleText text={s.name} />
                      </span>
                      <span className="text-xs text-muted-foreground font-mono mt-0.5">
                        {s.handle}
                      </span>
                    </a>
                  </Magnetic>
                ))}
              </div>
            </div>
          </Tilt>
        </div>

        {/* Right Column: Interactive Send Form */}
        <div className="lg:col-span-7">
          <Tilt className="w-full h-full">
            <div className="glass relative flex h-full flex-col justify-between rounded-3xl p-6 sm:p-8 md:p-10">
              <div>
                <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                  Dispatch a Message
                </span>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold">
                  Send an inquiry
                </h3>

                {submitted ? (
                  <div className="my-16 text-center">
                    <div className="font-display text-6xl text-primary animate-bounce">
                      ✦
                    </div>
                    <h4 className="mt-4 font-display text-3xl font-bold text-foreground">
                      Message Dispatched!
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Thank you for reaching out. I’ll get back to you promptly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        placeholder="e.g. Jane Doe"
                        className="glass mt-2 w-full rounded-2xl border border-glass-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        placeholder="jane@example.com"
                        className="glass mt-2 w-full rounded-2xl border border-glass-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                        Your Message or Project Brief
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            message: e.target.value,
                          })
                        }
                        placeholder="Tell me about your project, timeline, and goals..."
                        className="glass mt-2 w-full rounded-2xl border border-glass-border p-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none resize-none"
                      />
                    </div>

                    <Magnetic>
                      <button
                        type="submit"
                        disabled={sending}
                        className="glass group relative overflow-hidden rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {sending ? "Sending..." : "Send Message ↗"}
                        </span>
                      </button>
                    </Magnetic>
                    {submitError && (
                      <p className="text-sm text-red-400" role="alert">
                        {submitError}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </div>
  );
}
