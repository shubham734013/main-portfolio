import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { Split, Tilt, useScrollFx } from "@/components/site/reveal";
import { Magnetic } from "@/components/site/Shell";
import { usePortfolioData, type Article } from "@/lib/portfolio-store";
import { ScrambleText } from "@/components/site/TextEffects";
import { Button } from "@/components/ui/button";

export function WritingSection({ embedded = false }: { embedded?: boolean }) {
  const { articles } = usePortfolioData();
  const ref = useScrollFx();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = [
    "All",
    "Motion & GSAP",
    "UI Architecture",
    "UX & Details",
    "3D & WebGL",
  ];

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  useEffect(() => {
    if (activeArticle) {
      document.body.style.overflow = "hidden";
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
        );
        gsap.fromTo(
          ".article-modal-box",
          { y: 50, scale: 0.95, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" },
        );
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeArticle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeArticle) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeArticle]);

  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => setActiveArticle(null),
      });
    } else {
      setActiveArticle(null);
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
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.5em] text-primary">
            Thoughts & Insights
          </p>
          <h2 className="mt-4 max-w-full font-display text-[clamp(2rem,11vw,2.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em] min-[390px]:text-[clamp(2.35rem,11vw,3rem)] sm:text-6xl md:text-7xl xl:text-8xl">
            <Split text="Articles &" />{" "}
            <span className="text-liquid">writings</span>
          </h2>
        </div>
      </div>

      <p
        data-reveal
        className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg"
      >
        Notes on creative coding, high-framerate motion orchestration, fluid
        glass aesthetics, and interface psychology.
      </p>

      {/* Category Filters */}
      <div className="mt-10 flex flex-wrap gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div ref={gridRef} className="mt-14 grid gap-8 md:grid-cols-2">
        {filteredArticles.map((art) => (
          <Tilt key={art.slug} className="w-full">
            <div
              onClick={() => setActiveArticle(art)}
              className="glass group/card relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-8 transition-colors duration-300 hover:border-primary/60"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                  {art.category}
                </span>
                <span>
                  {art.readTime} · {art.date}
                </span>
              </div>

              <div className="my-6">
                <h3 className="font-display text-2xl font-bold leading-snug transition-colors duration-300 group-hover/card:text-primary md:text-3xl">
                  <ScrambleText text={art.title} />
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {art.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-glass-border pt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                <span>Read article</span>
                <span className="transition-transform duration-300 group-hover/card:translate-x-2">
                  →
                </span>
              </div>
            </div>
          </Tilt>
        ))}
      </div>

      {/* Full Article Modal */}
      {activeArticle && (
        <div
          ref={modalRef}
          onClick={closeModal}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-background/85 p-4 backdrop-blur-2xl md:p-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="article-modal-box glass relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-glass-border pb-4">
              <span className="text-xs uppercase tracking-widest text-primary font-medium">
                {activeArticle.category} · {activeArticle.readTime}
              </span>
              <button
                onClick={closeModal}
                className="glass flex h-9 w-9 items-center justify-center rounded-full text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close article"
              >
                ✕
              </button>
            </div>

            <h2 className="mt-6 font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-foreground">
              {activeArticle.title}
            </h2>
            <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
              Published {activeArticle.date} by Shubham
            </p>

            <div className="mt-8 space-y-5 whitespace-pre-line text-sm sm:text-base leading-relaxed text-foreground/90">
              {activeArticle.content}
            </div>

            <div className="mt-10 flex justify-end border-t border-glass-border pt-6">
              <Magnetic>
                <Button
                  variant="ghost"
                  onClick={closeModal}
                  className="glass rounded-full px-6 py-2.5 text-xs uppercase tracking-widest text-primary"
                >
                  Close article
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
