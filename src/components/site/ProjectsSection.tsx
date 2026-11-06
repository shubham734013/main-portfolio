import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Split, Tilt } from "@/components/site/reveal";
import { Magnetic } from "@/components/site/Shell";
import { usePortfolioData } from "@/lib/portfolio-store";
import { ScrambleText } from "@/components/site/TextEffects";
import { Button } from "@/components/ui/button";

const PER = 4;

export function ProjectsSection({ embedded = false }: { embedded?: boolean }) {
  const { projects } = usePortfolioData();
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("All");
  const grid = useRef<HTMLDivElement>(null);

  const tags = ["All", "WebGL", "React", "AI", "Design System", "Mobile"];

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((p) =>
          p.tag.toLowerCase().includes(filter.toLowerCase()),
        );

  const pages = Math.ceil(filteredProjects.length / PER);
  const items = embedded
    ? filteredProjects
    : filteredProjects.slice(page * PER, page * PER + PER);

  useEffect(() => {
    if (!grid.current) return;
    const tween = gsap.fromTo(
      grid.current.children,
      { y: 80, opacity: 0, rotateX: -30 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        transformPerspective: 800,
        ...(embedded
          ? { scrollTrigger: { trigger: grid.current, start: "top 90%" } }
          : {}),
      },
    );
    return () => {
      tween.kill();
    };
  }, [page, filter, embedded]);

  const go = (p: number) => {
    if (p === page || p < 0 || p >= pages) return;
    if (!grid.current) return;
    gsap.to(grid.current.children, {
      y: -50,
      opacity: 0,
      duration: 0.3,
      stagger: 0.03,
      ease: "power2.in",
      onComplete: () => setPage(p),
    });
  };

  return (
    <div className={`px-6 pb-24 md:px-16 ${embedded ? "pt-24" : "pt-40"}`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.5em] text-primary">
            Portfolio
          </p>
          <h2 className="mt-4 max-w-full font-display text-[clamp(2rem,11vw,2.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em] min-[390px]:text-[clamp(2.35rem,11vw,3rem)] sm:text-6xl md:text-7xl xl:text-9xl">
            <Split text="Selected work" />
          </h2>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="mt-10 flex flex-wrap gap-2.5">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => {
              setFilter(t);
              setPage(0);
            }}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              filter === t
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div
        ref={grid}
        className="mt-16 grid min-w-0 gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8"
      >
        {items.map((p, i) => (
          <Tilt key={p.title} className="glass min-w-0 rounded-3xl">
            <div className="group/card flex min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl p-5 transition-colors duration-300 hover:border-primary/50 sm:min-h-[340px] sm:p-6 lg:p-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-mono text-xs text-primary">
                  {String(page * PER + i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                  {p.year}
                </span>
              </div>

              <div className="my-5 sm:my-6">
                <h3 className="font-display text-3xl font-extrabold leading-none transition-colors duration-300 group-hover/card:text-primary sm:text-4xl lg:text-5xl">
                  <ScrambleText text={p.title} />
                </h3>
                <p className="mt-2 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-primary sm:text-xs sm:tracking-widest">
                  {p.tag}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                  {p.desc}
                </p>
                {p.metrics && (
                  <div className="mt-4 block max-w-full break-words rounded-lg border border-glass-border bg-glass/60 px-3 py-1 text-[10px] font-mono leading-relaxed text-foreground/80 sm:text-[11px]">
                    ⚡️ {p.metrics}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-glass-border pt-4 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-primary sm:text-xs sm:tracking-widest">
                <span className="min-w-0">Explore Project Details</span>
                <span className="text-lg transition-transform duration-300 group-hover/card:translate-x-2">
                  ↗
                </span>
              </div>
            </div>
          </Tilt>
        ))}
      </div>

      {!embedded && pages > 1 && (
        <>
          <div className="mt-16 flex items-center justify-center gap-3">
            <Magnetic>
              <Button
                variant="ghost"
                aria-label="Previous projects"
                onClick={() => go(page - 1)}
                disabled={page === 0}
                className="glass h-14 w-14 rounded-full text-xl transition active:scale-75 disabled:opacity-30"
              >
                ←
              </Button>
            </Magnetic>
            {Array.from({ length: pages }).map((_, i) => (
              <Button
                variant="ghost"
                key={i}
                onClick={() => go(i)}
                aria-label={`Page ${i + 1}`}
                className={`h-3 p-0 rounded-full transition-all duration-500 ${
                  i === page
                    ? "w-12 bg-primary shadow-[var(--shadow-glow)]"
                    : "w-3 bg-muted-foreground/40 hover:bg-foreground"
                }`}
              />
            ))}
            <Magnetic>
              <Button
                variant="ghost"
                aria-label="Next projects"
                onClick={() => go(page + 1)}
                disabled={page === pages - 1}
                className="glass h-14 w-14 rounded-full text-xl transition active:scale-75 disabled:opacity-30"
              >
                →
              </Button>
            </Magnetic>
          </div>
          <p className="mt-4 text-center font-display text-sm text-muted-foreground">
            {String(page + 1).padStart(2, "0")} /{" "}
            {String(pages).padStart(2, "0")}
          </p>
        </>
      )}
    </div>
  );
}
