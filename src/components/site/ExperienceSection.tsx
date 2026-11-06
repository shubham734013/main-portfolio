import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Split, Tilt, useScrollFx } from "@/components/site/reveal";
import { Magnetic } from "@/components/site/Shell";
import { skillCategories } from "@/components/site/data";
import { usePortfolioData } from "@/lib/portfolio-store";
import { ScrambleText, GlowingBadge } from "@/components/site/TextEffects";
import { Button } from "@/components/ui/button";
import resumeUrl from "@/assests/SHUBHAM_VANSHAV_RESUME_pdf.pdf";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceSection({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { experiences } = usePortfolioData();
  const ref = useScrollFx();
  const [activeCategory, setActiveCategory] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".exp-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      requestAnimationFrame(() => ScrollTrigger.refresh());

      gsap.utils.toArray<HTMLElement>(".exp-card").forEach((card, index) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          rotateX: 15,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          delay: (index % 2) * 0.1,
        });
      });
    }, lineRef);

    return () => ctx.revert();
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "Shubham_Vaishnav_CV.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
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
            Career & Competence
          </p>
          <h2 className="mt-4 max-w-full font-display text-[clamp(1.5rem,8vw,2.25rem)] font-extrabold leading-[0.95] tracking-[-0.04em] min-[390px]:text-[clamp(1.75rem,9vw,2.6rem)] sm:text-6xl md:text-7xl xl:text-8xl">
            <Split text="Experience &" />{" "}
            <span className="text-liquid">craft</span>
          </h2>
        </div>
        <Magnetic>
          <Button
            variant="ghost"
            onClick={handleDownload}
            className="glass flex items-center gap-3 rounded-full px-6 py-3 font-semibold text-foreground transition-all duration-300 hover:border-primary hover:text-primary active:scale-95"
          >
            <span>{downloaded ? "✓ CV Saved" : "Download Full CV ↓"}</span>
          </Button>
        </Magnetic>
      </div>

      <p
        data-reveal
        className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg"
      >
        Through academic study, focused project development, and virtual
        training, I have built practical experience across full-stack web
        applications, backend APIs, databases, and responsive interfaces.
      </p>

      {/* Experience Timeline */}
      <div
        ref={lineRef}
        className="exp-container relative mx-auto mt-20 max-w-5xl"
      >
        <div className="absolute left-4 top-0 hidden h-full w-px bg-glass-border md:left-1/2 md:block md:-translate-x-1/2" />
        <div className="exp-fill absolute left-4 top-0 hidden h-full w-[2px] origin-top bg-primary shadow-[var(--shadow-glow)] md:left-1/2 md:block md:-translate-x-1/2" />

        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <div
              key={exp.role}
              className={`exp-card relative flex flex-col items-center md:flex-row ${
                i % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="hidden h-5 w-5 rounded-full border-2 border-primary bg-background shadow-[var(--shadow-glow)] md:absolute md:left-1/2 md:top-8 md:block md:-translate-x-1/2" />

              <div className="w-full md:w-[46%]">
                <Tilt className="w-full">
                  <div className="glass group relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-colors duration-300 hover:border-primary/50">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-glass-border pb-4">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-primary font-mono">
                          {exp.period}
                        </span>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          <ScrambleText text={exp.role} />
                        </h3>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {exp.company}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>

                    <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                      {exp.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">✦</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {exp.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-glass-border bg-glass px-2.5 py-1 text-[11px] font-mono text-foreground/80 transition-colors group-hover:border-primary/40 group-hover:text-primary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Tilt>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skill Breakdown Matrix */}
      <div className="mt-28">
        <p className="text-xs uppercase tracking-[0.5em] text-primary">
          Architecture & Tech Stack
        </p>
        <h3 className="mt-3 font-display text-4xl font-bold md:text-6xl">
          <Split text="Skills Breakdown" />
        </h3>

        <div className="mt-8 flex flex-wrap gap-2.5">
          {skillCategories.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(idx)}
              className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === idx
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <Tilt className="w-full">
            <div className="glass rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300">
              <h4 className="font-display text-2xl font-bold text-foreground">
                {skillCategories[activeCategory].name}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                {skillCategories[activeCategory].description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {skillCategories[activeCategory].skills.map((skill) => (
                  <GlowingBadge key={skill} className="text-sm">
                    <span className="text-primary">✦</span>
                    <ScrambleText text={skill} />
                  </GlowingBadge>
                ))}
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </div>
  );
}
