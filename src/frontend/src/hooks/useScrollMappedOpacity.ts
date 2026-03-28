import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

interface UseScrollMappedOpacityOptions {
  maxScrollDistance?: number;
  stableOpacity?: number;
}

/**
 * Hook that returns an opacity value (0..1) mapped from scroll position.
 * Respects prefers-reduced-motion by returning a stable opacity value.
 */
export function useScrollMappedOpacity({
  maxScrollDistance = 300,
  stableOpacity = 1,
}: UseScrollMappedOpacityOptions = {}): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // If reduced motion is enabled, set stable opacity and skip scroll listener
    if (prefersReducedMotion) {
      setOpacity(stableOpacity);
      return;
    }

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const newOpacity = Math.min(scrollY / maxScrollDistance, 1);
        setOpacity(newOpacity);
        rafId = null;
      });
    };

    // Set initial opacity
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [maxScrollDistance, prefersReducedMotion, stableOpacity]);

  return opacity;
}
