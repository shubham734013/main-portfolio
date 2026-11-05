import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { SignatureLogo } from "@/components/site/SignatureLogo";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- Handwriting Loader ---------------- */
function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const penRef = useRef<SVGGElement>(null);
  const [count, setCount] = useState(0);

  const signatureD =
    "M 110 220 C 120 130, 140 65, 185 60 C 215 55, 200 110, 155 160 C 120 200, 130 245, 180 240 C 205 235, 215 210, 215 205 C 235 150, 260 70, 275 70 C 285 70, 275 120, 255 190 C 250 215, 250 235, 255 235 C 265 200, 280 175, 300 175 C 320 175, 320 205, 320 235 C 330 210, 345 190, 365 190 C 380 190, 380 215, 380 235 C 390 210, 405 190, 420 190 C 435 190, 435 215, 430 235 C 445 175, 465 70, 480 70 C 490 70, 480 120, 460 195 C 455 220, 460 235, 475 235 C 495 235, 500 205, 490 195 C 480 185, 505 190, 525 190 C 540 145, 560 70, 575 70 C 585 70, 575 120, 555 195 C 550 220, 555 235, 565 235 C 575 200, 590 175, 610 175 C 625 175, 625 205, 625 235 C 635 210, 650 190, 670 190 C 655 190, 645 205, 645 220 C 645 235, 660 238, 673 232 C 683 225, 690 205, 690 190 C 690 210, 690 235, 695 235 C 705 205, 720 185, 740 185 C 755 185, 755 210, 750 235 C 760 205, 775 185, 795 185 C 810 185, 810 210, 805 235 C 815 205, 830 185, 850 185 C 865 185, 865 210, 860 235 C 870 215, 890 180, 920 170 C 940 160, 945 190, 925 225 C 885 280, 680 325, 380 315 C 220 310, 90 298, 110 270 C 125 250, 190 250, 280 260";

  useEffect(() => {
    const path = pathRef.current;
    const glowPath = glowPathRef.current;
    const pen = penRef.current;
    if (!path || !glowPath || !pen) return;

    const totalLength = path.getTotalLength();
    path.style.strokeDasharray = `${totalLength}`;
    path.style.strokeDashoffset = `${totalLength}`;
    glowPath.style.strokeDasharray = `${totalLength}`;
    glowPath.style.strokeDashoffset = `${totalLength}`;

    const startPoint = path.getPointAtLength(0);
    pen.setAttribute(
      "transform",
      `translate(${startPoint.x}, ${startPoint.y}) rotate(25)`,
    );

    const progressObj = { progress: 0 };
    const tl = gsap.timeline({
      onComplete: onDone,
      defaults: { ease: "power2.inOut" },
    });

    tl.to(progressObj, {
      progress: 1,
      duration: 2.8,
      onComplete: () => {
        const nameFill =
          root.current?.querySelector<HTMLElement>(".loader-name-fill");
        if (nameFill) nameFill.style.clipPath = "inset(0 0 0 0)";
        setCount(100);
      },
      onUpdate: () => {
        const currentLength = totalLength * progressObj.progress;
        path.style.strokeDashoffset = `${totalLength - currentLength}`;
        glowPath.style.strokeDashoffset = `${totalLength - currentLength}`;
        setCount(Math.round(progressObj.progress * 100));

        const pt = path.getPointAtLength(currentLength);
        const ahead = path.getPointAtLength(
          Math.min(totalLength, currentLength + 4),
        );
        const angle =
          Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * (180 / Math.PI);
        pen.setAttribute(
          "transform",
          `translate(${pt.x}, ${pt.y}) rotate(${angle - 45})`,
        );
        const nameFill =
          root.current?.querySelector<HTMLElement>(".loader-name-fill");
        if (nameFill) {
          nameFill.style.clipPath = `inset(0 ${(1 - progressObj.progress) * 100}% 0 0)`;
        }
      },
    })
      .to(
        pen,
        { opacity: 0, scale: 0.5, duration: 0.4, ease: "power2.out" },
        "-=0.2",
      )
      // Finished signature shines
      .to(
        ".sig-wrap",
        {
          filter: "brightness(1.5) drop-shadow(0 0 35px var(--primary))",
          duration: 0.4,
        },
        "-=0.2",
      )
      .to(
        ".sig-wrap",
        {
          scale: 0.94,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.5,
          ease: "power3.in",
        },
        "+=0.2",
      )
      .to(
        root.current,
        { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" },
        "-=0.2",
      );

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-background select-none"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute left-1/3 top-1/3 h-[40vmin] w-[40vmin] rounded-full bg-accent/20 blur-[100px]" />

      <div className="sig-wrap relative flex flex-col items-center">
        <div className="relative h-32 w-[min(82vw,680px)] select-none sm:h-40 md:h-48">
          <div className="absolute inset-0 flex items-center justify-center font-script text-[clamp(7rem,24vw,14rem)] leading-none text-transparent [-webkit-text-stroke:1px_oklch(86%_0.15_195_/_0.18)]">
            Shubham
          </div>
          <div
            className="loader-name-fill absolute inset-0 flex items-center justify-center overflow-hidden font-script text-[clamp(7rem,24vw,14rem)] leading-none text-liquid"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            Shubham
          </div>
        </div>
        <svg
          viewBox="0 0 1000 360"
          className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        >
          <defs>
            <linearGradient
              id="liquid-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="50%" stopColor="oklch(0.85 0.16 160)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
            <linearGradient
              id="nib-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="pen-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            ref={glowPathRef}
            d={signatureD}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
            style={{ filter: "blur(6px)" }}
          />
          <path
            ref={pathRef}
            d={signatureD}
            fill="none"
            stroke="url(#liquid-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g
            ref={penRef}
            filter="url(#pen-glow)"
            className="pen-nib pointer-events-none"
          >
            <circle cx="0" cy="0" r="4.5" fill="var(--primary)" />
            <circle cx="0" cy="0" r="8" fill="var(--primary)" opacity="0.4" />
            <path
              d="M 0 0 L -8 -22 L -13 -48 L 0 -54 L 13 -48 L 8 -22 Z"
              fill="url(#nib-gradient)"
              stroke="var(--primary)"
              strokeWidth="1.2"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-32"
              stroke="#000"
              strokeWidth="1.2"
              opacity="0.8"
            />
            <circle cx="0" cy="-32" r="2.5" fill="var(--primary)" />
          </g>
        </svg>

        <p className="mt-4 font-mono text-xs uppercase tracking-[0.4em] text-primary/80">
          Inking digital canvas...
        </p>
      </div>

      <div className="absolute bottom-10 right-10 font-display text-6xl font-bold text-outline md:text-8xl">
        {count}%
      </div>
      <div className="absolute bottom-12 left-10 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
        <span>Shubham · Full-Stack Developer</span>
      </div>
    </div>
  );
}

/* ---------------- Fluid Velocity Cursor ---------------- */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let mouseX = 0,
      mouseY = 0;
    let prevX = 0,
      prevY = 0;
    let velocity = 0;

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.1 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.1 });
    const rx = gsap.quickTo(ring.current, "x", {
      duration: 0.35,
      ease: "power3",
    });
    const ry = gsap.quickTo(ring.current, "y", {
      duration: 0.35,
      ease: "power3",
    });

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const vx = mouseX - prevX;
      const vy = mouseY - prevY;
      velocity = Math.min(Math.sqrt(vx * vx + vy * vy), 50);

      prevX = mouseX;
      prevY = mouseY;

      dx(mouseX);
      dy(mouseY);
      rx(mouseX);
      ry(mouseY);

      const hot = (e.target as HTMLElement).closest(
        "a,button,[data-hover],input,textarea",
      );
      gsap.to(ring.current, {
        scale: hot ? 2.4 : 1 + velocity * 0.02,
        duration: 0.25,
      });
    };

    const click = (e: MouseEvent) => {
      const r = document.createElement("span");
      r.className = "click-ripple";
      r.style.left = e.clientX + "px";
      r.style.top = e.clientY + "px";
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 700);
      gsap.fromTo(
        ring.current,
        { scale: 0.5 },
        { scale: 1, duration: 0.4, ease: "back.out(3)" },
      );
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("click", click);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 hidden h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)] md:block"
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-5 -mt-5 hidden h-10 w-10 rounded-full border border-primary/70 mix-blend-difference md:block"
      />
    </>
  );
}

/* ---------------- Magnetic wrapper ---------------- */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canMagnetize = () =>
      window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    let enabled = canMagnetize();

    const reset = () => gsap.set(el, { x: 0, y: 0 });

    const move = (e: MouseEvent) => {
      if (!enabled) return;
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * strength,
        y: (e.clientY - r.top - r.height / 2) * strength,
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const leave = () => {
      if (!enabled) return reset();
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    };
    const updatePointer = () => {
      enabled = canMagnetize();
      if (!enabled) reset();
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    window.addEventListener("resize", updatePointer);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
      window.removeEventListener("resize", updatePointer);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}

/* ---------------- Liquid Responsive Nav ---------------- */
const links = [
  { hash: "home", label: "Home" },
  { hash: "about", label: "About" },
  { hash: "work", label: "Credentials" },
  { hash: "experience", label: "Experience" },
  { hash: "writing", label: "Writing" },
  { hash: "certificates", label: "Work" },
  { hash: "contact", label: "Contact" },
] as const;

function Nav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const current = [...links].reverse().find((l) => {
        const section = document.getElementById(l.hash);
        return (
          section && section.getBoundingClientRect().top <= innerHeight * 0.4
        );
      });
      setActive(current?.hash ?? "home");
    };
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [path]);

  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <nav className="glass hidden max-w-[calc(100vw-2rem)] items-center gap-1 overflow-x-auto rounded-full p-1.5 shadow-2xl no-scrollbar md:flex">
        <Link
          to="/"
          hash="home"
          className="px-3.5 font-script text-3xl leading-none text-primary transition-transform hover:scale-110 active:scale-90"
          aria-label="Shubham Vaishnav portfolio home"
        >
          <SignatureLogo className="text-3xl text-primary" />
        </Link>
        {links.map((l) => (
          <Link
            key={l.hash}
            to="/"
            hash={l.hash}
            aria-label={l.label}
            resetScroll={false}
            aria-current={
              path === "/" && active === l.hash ? "location" : undefined
            }
            className={`group relative overflow-hidden rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors md:px-4 md:text-xs ${
              path === "/" && active === l.hash
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="relative block transition-transform duration-500 group-hover:-translate-y-full">
              {l.label}
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-full block text-center transition-transform duration-500 group-hover:-translate-y-full"
            >
              {l.label}
            </span>
          </Link>
        ))}
      </nav>
      <div className="relative md:hidden">
        <nav className="glass flex h-12 items-center gap-1 rounded-full px-1.5 shadow-2xl">
          <Link
            to="/"
            hash="home"
            onClick={() => setMobileOpen(false)}
            className="px-2 font-script text-3xl leading-none text-primary"
            aria-label="Shubham Vaishnav portfolio home"
          >
            <SignatureLogo className="text-3xl text-primary" />
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-glass-border text-lg text-foreground"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </nav>
        {mobileOpen && (
          <div className="glass absolute left-1/2 top-[calc(100%+0.75rem)] grid w-[min(19rem,calc(100vw-2rem))] -translate-x-1/2 grid-cols-2 gap-2 rounded-3xl p-3 shadow-2xl">
            {links.map((link) => (
              <Link
                key={link.hash}
                to="/"
                hash={link.hash}
                resetScroll={false}
                onClick={() => setMobileOpen(false)}
                className={`rounded-2xl px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                  active === link.hash
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

/* ---------------- Footer with scroll-fill name & rich navigation ---------------- */
function Footer() {
  const ref = useRef<HTMLElement>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-name-fill",
        {
          clipPath: "inset(100% 0 0 0)",
          y: 90,
          scaleY: 1.3,
          filter: "blur(18px)",
          opacity: 0,
          letterSpacing: "0.12em",
          backgroundPosition: "200% 50%",
        },
        {
          clipPath: "inset(0 0% 0 0)",
          y: 0,
          scaleY: 1,
          filter: "blur(0px)",
          opacity: 1,
          letterSpacing: "-0.07em",
          backgroundPosition: "-200% 50%",
          duration: 1.35,
          ease: "power4.inOut",
          overwrite: "auto",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      gsap.fromTo(
        ".footer-name-outline",
        { opacity: 0.18, y: 44, scaleX: 0.82 },
        {
          opacity: 1,
          y: 0,
          scaleX: 1,
          duration: 1.6,
          ease: "expo.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [path]);

  return (
    <footer
      id="site-footer"
      ref={ref}
      className="relative overflow-hidden border-t border-glass-border px-6 pb-8 pt-24"
    >
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Let's build something <span className="text-liquid">unreal.</span>
          </p>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Bridging conceptual design, modern frontend engineering, and fluid
            micro-interactions into unforgettable web moments.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:flex sm:flex-wrap sm:gap-4">
            <Link
              to="/contact"
              className="group glass flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-primary transition-[transform,color,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-glow)] active:scale-95 motion-reduce:transition-none sm:min-h-0 sm:justify-start sm:px-6"
            >
              Contact Form <span className="ml-1 inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none">↗</span>
            </Link>
            <Link
              to="/writing"
              className="group glass flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-[transform,color,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/60 hover:text-foreground hover:shadow-[var(--shadow-glow)] active:scale-95 motion-reduce:transition-none sm:min-h-0 sm:justify-start sm:px-6"
            >
              Read Articles <span className="ml-1 inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none">↗</span>
            </Link>
            <Link
              to="/admin"
              className="group glass flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-[transform,color,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-[var(--shadow-glow)] active:scale-95 motion-reduce:transition-none min-[390px]:col-span-2 sm:min-h-0 sm:justify-start"
            >
              Admin Studio <span className="ml-1 inline-block transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none">⚙️</span>
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted-foreground md:justify-start">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-foreground">
            Connect
          </p>
          <a
            href="mailto:shubhamvaishnav640@gmail.com"
            className="block font-mono text-foreground hover:text-primary transition-colors"
          >
            shubhamvaishnav640@gmail.com
          </a>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider">
            {[
              { name: "GitHub", href: "https://github.com/shubham734013" },
              {
                name: "LinkedIn",
                href: "https://www.linkedin.com/in/shubham-vaishnav-380970313?utm_source=share_via&utm_content=profile&utm_medium=member_android",
              },
              { name: "Email", href: "mailto:shubhamvaishnav640@gmail.com" },
            ].map((s) => (
              <Magnetic key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass block rounded-full px-4 py-2 hover:border-primary hover:text-primary transition-colors"
                >
                  {s.name}
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-name group relative mt-24 box-border w-full max-w-full cursor-default select-none overflow-hidden px-2 py-2 text-center font-display text-[clamp(2rem,12vw,6rem)] font-extrabold leading-[0.8] tracking-[-0.055em] sm:px-4">
        <span className="footer-name-outline block w-full origin-bottom whitespace-nowrap text-transparent [-webkit-text-stroke:1px_oklch(86%_0.15_195_/_0.25)]">
          SHUBHAM
        </span>
        <span className="footer-name-fill absolute inset-0 block w-full whitespace-nowrap text-liquid transition-[filter,transform,letter-spacing] duration-700 ease-out group-hover:-translate-y-1 group-hover:brightness-125 group-hover:tracking-[-0.04em] motion-reduce:transition-none">
          SHUBHAM
        </span>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <span>
          © {new Date().getFullYear()} Shubham — Crafted with code, physics &
          curiosity
        </span>
        <span className="text-glass-border">·</span>
        <Link
          to="/admin"
          className="text-primary/70 hover:text-primary transition-colors"
        >
          Studio Admin ⚙
        </Link>
      </div>
    </footer>
  );
}

/* ---------------- Shell ---------------- */
export function Shell({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  const lenisRef = useRef<Lenis | null>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      lenisRef.current = null;
      return;
    }
    const lenis = new Lenis({ lerp: 0.09 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    if (first.current) {
      first.current = false;
      return;
    }
    gsap.fromTo(
      curtain.current,
      { clipPath: "circle(150% at 50% 50%)" },
      { clipPath: "circle(0% at 50% 100%)", duration: 1, ease: "expo.inOut" },
    );
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }, [path]);

  useEffect(() => {
    if (loading) lenisRef.current?.stop();
    else {
      lenisRef.current?.start();
      ScrollTrigger.refresh();
    }
  }, [loading]);

  useEffect(() => {
    if (loading || path !== "/" || !hash) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(hash);
      lenisRef.current?.resize();
      if (target) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, {
            duration: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? 0
              : 1.4,
          });
        } else {
          target?.scrollIntoView({ block: "start" });
        }
      }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [hash, path, loading]);

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="blob absolute -left-[10vw] top-[10vh] h-[45vw] w-[45vw] bg-primary/25 blur-[120px]" />
        <div
          className="blob absolute right-[-10vw] top-[40vh] h-[40vw] w-[40vw] bg-accent/20 blur-[120px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="blob absolute bottom-[-10vh] left-[30vw] h-[35vw] w-[35vw] bg-primary/15 blur-[120px]"
          style={{ animationDelay: "-12s" }}
        />
      </div>
      <div className="grain" />
      <div
        ref={curtain}
        className="pointer-events-none fixed inset-0 z-[80] bg-primary"
        style={{ clipPath: "circle(0% at 50% 100%)" }}
      />
      <Cursor />
      <Nav />
      <main key={path} className="page-enter relative z-10">
        {children}
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
