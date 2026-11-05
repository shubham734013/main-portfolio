import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Split, Tilt, useScrollFx } from "@/components/site/reveal";
import { ScrambleText } from "@/components/site/TextEffects";
import { SignatureLogo } from "@/components/site/SignatureLogo";
import { usePortfolioData } from "@/lib/portfolio-store";
import journeyVideo from "@/assests/journey-video-optimized.mp4";
import journeyPoster from "@/assests/journey-video-poster.jpg";

gsap.registerPlugin(ScrollTrigger);

const traits = [
  {
    k: "Curious",
    v: "Always learning how scalable systems, APIs, and data models work from the inside.",
  },
  {
    k: "Obsessive",
    v: "About clean architecture, reliable code, thoughtful interfaces, and practical performance.",
  },
  {
    k: "Human",
    v: "Building useful digital products that solve real problems and create meaningful experiences.",
  },
];

export function AboutSection({ embedded = false }: { embedded?: boolean }) {
  const ref = useScrollFx();
  const line = useRef<HTMLDivElement>(null);
  const journeyVideoRef = useRef<HTMLVideoElement>(null);
  const { timeline } = usePortfolioData();

  useEffect(() => {
    const video = journeyVideoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tl-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".tl",
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      requestAnimationFrame(() => ScrollTrigger.refresh());
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((el, i) =>
        gsap.from(el, {
          x: window.innerWidth >= 768 ? (i % 2 ? 100 : -100) : 24,
          opacity: 0,
          rotate: i % 2 ? 3 : -3,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        }),
      );
    }, line);
    return () => ctx.revert();
  }, [timeline]);

  return (
    <div ref={ref}>
      <section
        className={`relative flex items-center px-6 md:px-16 ${embedded ? "py-24" : "min-h-screen pt-28"}`}
      >
        <div className="grid w-full min-w-0 items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.5em] text-primary">
              About me
            </p>
            <h2 className="mt-6 max-w-full font-display text-5xl font-extrabold leading-[0.9] sm:text-6xl md:text-7xl xl:text-8xl">
              <Split text="Hi, I'm" />
              <br />
              <span className="relative top-2 inline-block max-w-full px-[0.03em] pb-[0.12em] pt-[0.08em] font-script text-[clamp(4.25rem,18vw,7rem)] font-normal normal-case leading-[1] text-liquid transition-all hover:brightness-125 md:top-3 md:text-[clamp(5.5rem,9vw,8rem)]">
                Shubham
              </span>
            </h2>
            <p
              data-reveal
              className="mt-8 max-w-lg text-lg text-muted-foreground leading-relaxed"
            >
              Full-stack developer and B.Tech AI & ML student at JECRC
              University, enrolled in the Xebia program. I build practical
              software with React, Node.js, Express, TypeScript, and MongoDB.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["React.js", "Node.js", "MongoDB", "TypeScript"].map((badge) => (
                <span
                  key={badge}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.currentTarget.querySelector("span")?.click();
                    }
                  }}
                  className="motion-safe:cursor-pointer motion-safe:select-none rounded-full border border-glass-border bg-glass px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition-[transform,border-color,color,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/[0.08] hover:text-foreground hover:shadow-[var(--shadow-glow)] active:scale-95 motion-reduce:transition-none"
                >
                  <ScrambleText text={badge} interactive />
                </span>
              ))}
            </div>
          </div>

          <Tilt className="mx-auto aspect-[4/5] w-full max-w-[20rem] rounded-[1.75rem] sm:max-w-sm md:max-w-md lg:max-w-lg">
            <div className="group/avatar relative h-full overflow-hidden rounded-[1.75rem] border border-glass-border bg-[linear-gradient(145deg,oklch(18%_0.025_225),oklch(9%_0.02_250))] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.9)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,oklch(86%_0.15_195_/_0.18),transparent_28%),radial-gradient(circle_at_24%_78%,oklch(64%_0.18_285_/_0.16),transparent_38%)]" />
              <div className="absolute left-[12%] top-[9%] aspect-square w-[58%] rounded-full border border-primary/20 bg-primary/[0.08]" />
              <div className="absolute bottom-[16%] right-[8%] aspect-square w-[46%] rounded-full bg-accent/10 blur-xl" />
              <video
                ref={journeyVideoRef}
                className="absolute inset-0 z-10 h-full w-full object-cover"
                src={journeyVideo}
                poster={journeyPoster}
                loop
                muted
                playsInline
                preload="none"
                aria-label="Shubham's creative journey"
              />
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-12 select-none">
                <SignatureLogo className="-rotate-[8deg] text-[clamp(7rem,20vw,10rem)] text-foreground/90 drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 border-t border-glass-border pt-4 text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-widest">
                <span>Jaipur, India</span>
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  Available
                </span>
              </div>
            </div>
          </Tilt>
        </div>
      </section>

      {/* Traits Section */}
      <section className="grid gap-6 px-6 py-24 md:grid-cols-3 md:px-16">
        {traits.map((t, i) => (
          <div
            key={t.k}
            data-reveal
            className="swing"
            style={{ animationDelay: `${-i * 1.3}s` }}
          >
            <div className="mx-auto h-16 w-px bg-glass-border" />
            <div className="glass group rounded-3xl p-8 transition-all duration-300 hover:border-primary hover:shadow-[var(--shadow-glow)]">
              <h3 className="font-display text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                <ScrambleText text={t.k} />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.v}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Journey Timeline */}
      <section ref={line} className="overflow-hidden px-6 py-24 md:px-16">
        <h2 className="mb-20 text-center font-display text-5xl font-bold md:text-7xl">
          <Split text="The journey" />
        </h2>
        <div className="tl relative mx-auto max-w-4xl">
          <div className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-glass-border md:left-1/2" />
          <div className="tl-fill absolute left-4 top-0 h-full w-[2px] origin-top -translate-x-1/2 bg-primary shadow-[var(--shadow-glow)] md:left-1/2" />
          {timeline.map((t, i) => (
            <div
              key={t.year}
              className={`tl-item relative mb-16 flex justify-end ${
                i % 2 ? "md:justify-end" : "md:justify-start"
              }`}
            >
              <div className="absolute left-4 top-6 h-4 w-4 -translate-x-1/2 rounded-full bg-primary ring-8 ring-primary/20 shadow-[var(--shadow-glow)] md:left-1/2" />
              <div
                className={`glass ml-auto w-[calc(100%-3rem)] rounded-3xl p-5 transition-all duration-300 hover:border-primary/50 sm:p-6 md:w-[44%] md:mx-0 ${
                  i % 2 ? "md:ml-auto md:mr-0" : "md:ml-0 md:mr-auto"
                }`}
              >
                <div className="font-display text-4xl font-extrabold text-liquid">
                  {t.year}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-foreground">
                  <ScrambleText text={t.title} />
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {t.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
