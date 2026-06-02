import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}

/**
 * Animated number that smoothly counts from its previous value to the new one
 * whenever `value` changes. Uses requestAnimationFrame for buttery motion.
 */
export function CountUp({ value, duration = 800, className, format }: CountUpProps) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(Math.round(start + (end - start) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return (
    <span className={className} aria-live="polite">
      {format ? format(display) : display.toLocaleString()}
    </span>
  );
}
