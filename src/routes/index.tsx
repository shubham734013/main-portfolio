import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "@/components/site/Shell";
import { Split, useScrollFx } from "@/components/site/reveal";
import { AboutSection } from "@/components/site/AboutSection";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { WritingSection } from "@/components/site/WritingSection";
import { CertificatesSection } from "@/components/site/CertificatesSection";
import { ContactSection } from "@/components/site/ContactSection";
import { ScrambleText, GlowingBadge } from "@/components/site/TextEffects";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Shubham Vaishnav | Full-Stack Developer & UI Motion Designer" },
      {
        name: "description",
        content:
          "Shubham builds futuristic, motion-rich web experiences with liquid glass interfaces, 60fps animations, and creative code.",
      },
      {
        property: "og:title",
        content: "Shubham Vaishnav — Full-Stack Developer Portfolio",
      },
      {
        property: "og:description",
        content: "Futuristic, motion-rich web experiences by Shubham.",
      },
    ],
  }),
  component: Home,
});

const skills = [
  "React.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Tailwind CSS",
  "REST APIs",
  "JavaScript",
  "MySQL",
  "Git & GitHub",
];

function AnimatedMetric({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match?.[2] ?? "";

  useEffect(() => {
    const element = ref.current;
    if (!element || !target) return;

    const counter = { value: 0 };
    const animation = gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: "power3.out",
      paused: true,
      onUpdate: () => {
        element.textContent = `${Math.round(counter.value)}${suffix}`;
      },
    });
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      once: true,
      onEnter: () => animation.play(),
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [suffix, target]);

  return (
    <div
      ref={ref}
      className="font-display text-[clamp(2.75rem,12vw,3.75rem)] font-extrabold leading-none text-liquid lg:text-5xl xl:text-6xl"
    >
      0{suffix}
    </div>
  );
}

function CharacterFadeText({ text }: { text: string }) {
  const heading = useRef<HTMLHeadingElement>(null);

  const animateWord = (word: HTMLSpanElement) => {
    const characters = word.querySelectorAll<HTMLElement>(".word-character");
    gsap.killTweensOf(characters);
    gsap.fromTo(characters, {
      opacity: 0.35,
      y: 8,
      color: "var(--foreground)",
    }, {
      opacity: 1,
      y: 0,
      color: "var(--primary)",
      duration: 0.35,
      ease: "power2.out",
      stagger: 0.025,
    });
  };

  const resetWord = (word: HTMLSpanElement) => {
    const characters = word.querySelectorAll<HTMLElement>(".word-character");
    gsap.killTweensOf(characters);
    gsap.to(characters, {
      opacity: 1,
      y: 0,
      color: "",
      duration: 0.25,
      ease: "power1.out",
      stagger: 0.015,
    });
  };

  return (
    <h2
      ref={heading}
      className="max-w-5xl cursor-default font-display text-4xl font-bold leading-tight md:text-6xl"
      aria-label={text}
    >
      {text.split(" ").map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`}>
          <span
            className="inline-block whitespace-nowrap"
            aria-hidden="true"
            onMouseEnter={(event) => animateWord(event.currentTarget)}
            onMouseLeave={(event) => resetWord(event.currentTarget)}
          >
            {word.split("").map((character, characterIndex) => (
              <span
                key={`${character}-${characterIndex}`}
                className="word-character inline-block"
              >
                {character}
              </span>
            ))}
          </span>
          {wordIndex < text.split(" ").length - 1 ? "\u00a0" : null}
        </span>
      ))}
    </h2>
  );
}

function Home() {
  const ref = useScrollFx();
  const hero = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".orb", {
        scale: 0,
        rotate: -90,
        duration: 1.8,
        ease: "elastic.out(1,0.5)",
        delay: 0.4,
      });
      const move = (e: MouseEvent) => {
        const x = e.clientX / innerWidth - 0.5;
        const y = e.clientY / innerHeight - 0.5;
        gsap.to(".orb", {
          x: x * 60,
          y: y * 60,
          rotate: x * 20,
          duration: 1.2,
        });
      };
      addEventListener("mousemove", move);
      return () => removeEventListener("mousemove", move);
    }, hero);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} id="home">
      {/* Hero Section */}
      <section
        ref={hero}
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-28 md:px-16"
      >
        <div className="orb pointer-events-none absolute right-[8vw] top-[22vh] h-[34vw] w-[34vw] max-h-[480px] max-w-[480px]">
          <div
            className="blob glass h-full w-full"
            style={{ animationDuration: "10s" }}
          />
          <div className="blob absolute inset-[18%] bg-primary/40 blur-2xl" />
        </div>

        <div className="hero-return-reveal mb-6 flex flex-wrap items-center gap-3">
          <GlowingBadge>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for select projects</span>
          </GlowingBadge>
        </div>

        <h1
          className="hero-name-mask relative w-full max-w-5xl font-display text-[clamp(2.75rem,14vw,7.5rem)] font-extrabold leading-[0.88] tracking-[-0.055em] sm:text-[clamp(3.25rem,9vw,7.5rem)]"
        >
          <span className="block origin-bottom text-liquid">
            Shubham
          </span>
          <span className="block origin-bottom text-liquid">
            Vaishnav
          </span>
        </h1>
        <div className="hero-return-reveal hero-role-list mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary md:text-base">
          <span>Full-Stack Developer</span>
          <span className="hidden text-muted-foreground sm:inline">/</span>
          <span>UI & Motion Designer</span>
          <span className="hidden text-muted-foreground sm:inline">/</span>
          <span className="text-muted-foreground">Jaipur, Rajasthan</span>
        </div>
        <p className="hero-return-reveal hero-intro mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          I build full-stack web applications with React, TypeScript, Node.js,
          and MongoDB, turning practical ideas into reliable digital products.
        </p>

        <div className="hero-return-reveal mt-10 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <Magnetic>
            <Link
              to="/"
              hash="work"
              className="group inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full bg-primary px-5 py-3 text-sm font-semibold leading-none text-primary-foreground shadow-[var(--shadow-glow)] transition-colors sm:px-8 sm:py-4 sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Selected Work{" "}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              to="/"
              hash="about"
              className="glass inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold leading-none text-foreground transition-colors hover:border-primary sm:px-8 sm:py-4 sm:text-base"
            >
              Who am I?
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              to="/"
              hash="contact"
              className="glass inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold leading-none text-muted-foreground hover:text-primary transition-colors sm:px-8 sm:py-4 sm:text-base"
            >
              Get in touch
            </Link>
          </Magnetic>
        </div>

      </section>

      {/* Marquee Skills Banner */}
      <section className="overflow-hidden border-y border-glass-border py-8">
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-4xl font-bold uppercase md:text-6xl">
          {[...skills, ...skills, ...skills].map((s, i) => (
            <span
              key={i}
              className={`transition-colors duration-300 hover:text-primary ${
                i % 2 ? "text-outline" : "text-foreground"
              }`}
            >
              {s} <span className="text-primary">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Philosophy Statement */}
      <section className="px-6 py-32 md:px-16">
        <CharacterFadeText text="I craft digital experiences where code meets motion and every pixel has a pulse." />
      </section>

      {/* Key Metric Highlights */}
      <section className="grid grid-cols-1 gap-4 px-6 py-12 min-[390px]:grid-cols-2 sm:gap-6 md:px-16 lg:grid-cols-4">
        {[
          ["4+", "Core disciplines", "AI, ML, full-stack development, and cloud technologies"],
          ["5+", "Projects built", "Healthcare, SaaS, and frontend experiences"],
          ["3", "Credentials", "Google Cloud, Xebia, and Adobe"],
          ["2028", "Graduation year", "B.Tech AI & ML student at JECRC University"],
        ].map(([n, l, desc]) => (
          <div
            key={l}
            data-reveal
            className="glass flex min-h-44 min-w-0 flex-col justify-center rounded-2xl p-5 min-[390px]:min-h-52 sm:min-h-56 sm:rounded-3xl sm:p-6 xl:p-8"
          >
            <AnimatedMetric value={n} />
            <div className="mt-3 text-xs font-semibold uppercase leading-snug tracking-wider text-foreground sm:text-sm">
              {l}
            </div>
            <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</div>
          </div>
        ))}
      </section>

      {/* Embedded Sections */}
      <section id="about" className="scroll-mt-24 border-t border-glass-border">
        <AboutSection embedded />
        <div className="px-6 pb-16 md:px-16">
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary transition-all hover:gap-3"
          >
            <span>Explore full story & background</span>
            <span>↗</span>
          </Link>
        </div>
      </section>

      <section id="work" className="scroll-mt-24 border-t border-glass-border">
        <CertificatesSection embedded />
        <div className="px-6 pb-16 md:px-16">
          <Link
            to="/certificates"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary transition-all hover:gap-3"
          >
            <span>Open credentials credential vault</span>
            <span>↗</span>
          </Link>
        </div>
      </section>

      <section
        id="experience"
        className="scroll-mt-24 border-t border-glass-border"
      >
        <ExperienceSection embedded />
        <div className="px-6 pb-16 md:px-16">
          <Link
            to="/experience"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary transition-all hover:gap-3"
          >
            <span>View detailed career history & tech matrix</span>
            <span>↗</span>
          </Link>
        </div>
      </section>

      <section
        id="writing"
        className="scroll-mt-24 border-t border-glass-border"
      >
        <WritingSection embedded />
        <div className="px-6 pb-16 md:px-16">
          <Link
            to="/writing"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary transition-all hover:gap-3"
          >
            <span>Read all articles & creative coding notes</span>
            <span>↗</span>
          </Link>
        </div>
      </section>

      <section
        id="certificates"
        className="scroll-mt-24 border-t border-glass-border"
      >
        <ProjectsSection embedded />
        <div className="px-6 pb-16 md:px-16">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary transition-all hover:gap-3"
          >
            <span>Browse complete project gallery</span>
            <span>↗</span>
          </Link>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-24 border-t border-glass-border"
      >
        <ContactSection embedded />
        <div className="px-6 pb-16 md:px-16">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary transition-all hover:gap-3"
          >
            <span>Dedicated contact page & guestbook</span>
            <span>↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
