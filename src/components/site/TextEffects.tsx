import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~";

/** High-tech decryption / scramble text on hover */
export function ScrambleText({
  text,
  className = "",
  as: Component = "span",
  speed = 30,
  interactive = false,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  speed?: number;
  interactive?: boolean;
}) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iteration = 0;
    const max = text.length;

    intervalRef.current = window.setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            if (index < iteration) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );

      iteration += 1 / 2;
      if (iteration >= max) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, speed);
  };

  const handleLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplay(text);
  };

  useEffect(() => {
    setDisplay(text);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <Component
      onMouseEnter={interactive ? startScramble : undefined}
      onMouseLeave={interactive ? handleLeave : undefined}
      onFocus={interactive ? startScramble : undefined}
      onBlur={interactive ? handleLeave : undefined}
      onClick={interactive ? startScramble : undefined}
      onKeyDown={
        interactive
          ? (event: { key: string; preventDefault: () => void }) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                startScramble();
              }
            }
          : undefined
      }
      data-hover={interactive ? true : undefined}
      className={`inline-block transition-[letter-spacing,color] duration-300 hover:tracking-[0.025em] ${className}`}
    >
      {display}
    </Component>
  );
}

/** Interactive 3D magnetic hover text where letters gently ripple */
export function MagneticText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const letters = children.split("");
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {letters.map((char, i) => (
        <span
          key={i}
          className="inline-block transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-110 hover:text-primary active:scale-95"
          style={{ transitionDelay: `${i * 12}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

/** Glass badge with glowing animated border on hover */
export function GlowingBadge({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-full border border-glass-border bg-glass px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-xl transition-all duration-300 hover:border-primary/80 hover:shadow-[var(--shadow-glow)] ${className}`}
    >
      <div className="pointer-events-none absolute -inset-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25)_0%,transparent_70%)]" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </div>
  );
}
