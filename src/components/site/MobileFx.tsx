import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MOBILE = "(max-width: 767px)";
const TOUCH = "(pointer: coarse)";
const REDUCED = "(prefers-reduced-motion: reduce)";

export function MobileFx() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !window.matchMedia(MOBILE).matches ||
      !window.matchMedia(TOUCH).matches ||
      !navigator.maxTouchPoints ||
      window.matchMedia(REDUCED).matches
    ) return;

    const progress = gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });

    const skewTargets = () =>
      gsap.utils.toArray<HTMLElement>("main section");
    const skewTween = gsap.quickTo(skewTargets(), "skewY", {
      duration: 0.5,
      ease: "power3",
    });
    const velocityTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = gsap.utils.clamp(-2.5, 2.5, self.getVelocity() / -600);
        skewTween(velocity);
        gsap.delayedCall(0.12, () => skewTween(0));
      },
    });

    const pressSelector = "a, button, .glass, [data-hover]";
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      const ripple = document.createElement("span");
      ripple.className = "tap-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });

      const element = (e.target as HTMLElement).closest<HTMLElement>(pressSelector);
      if (element) gsap.to(element, { scale: 0.96, duration: 0.15, ease: "power2.out" });
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      const element = (e.target as HTMLElement).closest<HTMLElement>(pressSelector);
      if (element) gsap.to(element, { scale: 1, duration: 0.6, ease: "elastic.out(1,0.45)" });
    };

    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointercancel", onUp, { passive: true });

    return () => {
      progress.scrollTrigger?.kill();
      progress.kill();
      velocityTrigger.kill();
      gsap.set(skewTargets(), { clearProps: "transform" });
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return <div ref={bar} aria-hidden="true" className="scroll-progress md:hidden" />;
}
