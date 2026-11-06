import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { Split, Tilt } from "@/components/site/reveal";
import {
  usePortfolioData,
  type Certificate as Cert,
} from "@/lib/portfolio-store";
import { ScrambleText } from "@/components/site/TextEffects";
import { Button } from "@/components/ui/button";

function CertFace({ c, big }: { c: Cert; big?: boolean }) {
  return (
    <div
      className={`glass group/cert relative flex min-h-[280px] w-full min-w-0 flex-col justify-between overflow-hidden rounded-3xl transition-colors duration-300 hover:border-primary/60 sm:min-h-[300px] lg:min-h-[340px] ${
        big ? "p-6 sm:p-12" : "p-5 sm:p-7"
      }`}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl transition-transform duration-500 group-hover/cert:scale-125" />
      <div className="flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Certificate of completion
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 text-primary transition-transform duration-300 group-hover/cert:rotate-45">
          ✦
        </span>
      </div>
      <div className="my-3">
        <h3
          className={`font-display font-bold leading-tight ${
            big
              ? "text-3xl sm:text-5xl"
              : "text-lg leading-snug sm:text-xl lg:text-2xl"
          }`}
        >
          <ScrambleText text={c.title} />
        </h3>
        <p className="mt-2 text-sm text-primary font-medium">{c.issuer}</p>

        {c.skills && (
          <div className="mt-3 flex max-h-12 flex-wrap gap-1.5 overflow-hidden sm:max-h-none">
            {c.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-mono text-primary/90"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-end justify-between gap-3 border-t border-glass-border pt-3 text-xs text-muted-foreground sm:pt-4">
        <span className="font-script text-3xl leading-none normal-case text-foreground sm:text-4xl">
          Shubham
        </span>
        <span className="shrink-0 text-right font-mono text-[10px] sm:text-[11px]">
          {c.date} · {c.id}
        </span>
      </div>
    </div>
  );
}

export function CertificatesSection({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { certificates } = usePortfolioData();
  const [open, setOpen] = useState<Cert | null>(null);
  const modal = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Staggered card entrance animation with clearProps
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.children;

    const tween = gsap.fromTo(
      cards,
      { y: 50, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "opacity,transform",
        ...(embedded
          ? {
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 88%",
                once: true,
              },
            }
          : {}),
      },
    );

    return () => {
      tween.kill();
    };
  }, [embedded, certificates]);

  // Modal open/close animation and body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (modal.current) {
        gsap.fromTo(
          modal.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
        );
        gsap.fromTo(
          ".cert-big",
          { scale: 0.96, y: 24 },
          {
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            transformPerspective: 1000,
          },
        );
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const close = () =>
    gsap.to(modal.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => setOpen(null),
    });

  return (
    <div className={`px-6 pb-24 md:px-16 ${embedded ? "pt-24" : "pt-40"}`}>
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

      <p className="text-xs uppercase tracking-[0.5em] text-primary">
        Credentials
      </p>
      <h2 className="mt-4 max-w-full font-display text-[clamp(2.25rem,13vw,3rem)] font-extrabold leading-[0.95] tracking-[-0.04em] min-[390px]:text-[clamp(2.75rem,12vw,3.25rem)] sm:text-6xl md:text-7xl xl:text-9xl">
        <Split text="Certified" />{" "}
        <span className="text-liquid">curiosity</span>
      </h2>
      <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
        Every certificate is a chapter of deliberate, disciplined learning and
        craft expansion.
      </p>

      {/* Certificates Grid */}
      <div
        ref={gridRef}
        className="mt-20 grid min-w-0 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8"
      >
        {certificates.map((c, index) => (
          <div key={c.id} className="min-w-0">
            <div className="mx-auto flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-primary shadow-[var(--shadow-glow)]" />
              <div className="h-14 w-px bg-gradient-to-b from-primary to-transparent" />
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setOpen(c)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(c);
                }
              }}
              className="group/btn block w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-3xl transition-transform active:scale-95"
            >
              <div
                className="swing"
                style={{
                  animationDelay: `${index * -0.7}s`,
                  animationDuration: `${3.8 + (index % 2) * 0.4}s`,
                }}
              >
                <Tilt className="min-w-0 rounded-3xl">
                  <CertFace c={c} />
                </Tilt>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal View for Big Certificate */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          ref={modal}
          onClick={close}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-background/85 p-4 backdrop-blur-2xl sm:p-6"
        >
          <div
            className="cert-big w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CertFace c={open} big />
            <Button
              variant="ghost"
              onClick={close}
              className="glass mx-auto mt-6 block h-auto rounded-full px-6 py-3 text-xs uppercase tracking-widest text-primary hover:border-primary"
            >
              Close Credential
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
