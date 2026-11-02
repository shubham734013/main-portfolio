import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Scroll-triggered animations for [data-reveal], [data-split], [data-parallax] inside the container. */
export function useScrollFx() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-split] .w").forEach(() => {});
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll(".w > span"),
          { yPercent: 110, rotate: 6 },
          {
            yPercent: 0,
            rotate: 0,
            immediateRender: false,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              invalidateOnRefresh: true,
            },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 80, opacity: 0, scale: 0.95, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            immediateRender: false,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset["parallax"]),
          ease: "none",
          scrollTrigger: { trigger: el, scrub: true },
        });
      });
    }, ref);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
    });
    return () => ctx.revert();
  }, []);
  return ref;
}

export function Split({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span data-split className={className}>
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          className="w inline-block max-w-full overflow-hidden pb-[0.1em] align-bottom"
        >
          <span className="inline-block">{w}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}

/** 3D tilt + glare on hover */
export function Tilt({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, {
      rotateY: x * 14,
      rotateX: -y * 14,
      duration: 0.5,
      transformPerspective: 900,
    });
    ref.current!.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    ref.current!.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () =>
    gsap.to(ref.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 1,
      ease: "elastic.out(1,0.4)",
    });
  return (
    <div
      ref={ref}
      data-hover
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative [transform-style:preserve-3d] ${className ?? ""}`}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--gx) var(--gy), color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%)",
        }}
      />
    </div>
  );
}
