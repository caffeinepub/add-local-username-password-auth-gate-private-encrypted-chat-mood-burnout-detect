import { useEffect, useState, useRef } from 'react';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';

interface UseDirectionalScrollOpacityOptions {
  /**
   * The element to track (typically the hero section ref)
   */
  elementRef: React.RefObject<HTMLElement | null>;
  /**
   * Minimum opacity value (prevents full transparency)
   */
  minOpacity?: number;
  /**
   * Maximum opacity value
   */
  maxOpacity?: number;
  /**
   * Stable opacity when reduced-motion is enabled
   */
  stableOpacity?: number;
}

/**
 * Hook that returns a direction-aware opacity value for a specific section.
 * - Scrolling down within the section decreases opacity (fade out)
 * - Scrolling up within the section increases opacity (fade in)
 * - Respects prefers-reduced-motion by returning a stable opacity value
 * - Uses requestAnimationFrame for smooth, jank-free updates
 */
export function useDirectionalScrollOpacity({
  elementRef,
  minOpacity = 0.3,
  maxOpacity = 1,
  stableOpacity = 0.6,
}: UseDirectionalScrollOpacityOptions): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [opacity, setOpacity] = useState(maxOpacity);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // If reduced motion is enabled, set stable opacity and skip scroll listener
    if (prefersReducedMotion) {
      setOpacity(stableOpacity);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      if (rafId.current !== null) return;

      rafId.current = requestAnimationFrame(() => {
        if (!element) {
          rafId.current = null;
          return;
        }

        const currentScrollY = window.scrollY;
        const rect = element.getBoundingClientRect();
        const elementTop = currentScrollY + rect.top;
        const elementBottom = elementTop + rect.height;

        // Only update opacity when viewport is within the hero section area
        if (currentScrollY >= elementTop && currentScrollY <= elementBottom) {
          // Calculate progress through the section (0 at top, 1 at bottom)
          const progress = (currentScrollY - elementTop) / rect.height;
          
          // Reverse the mapping: higher progress = lower opacity
          // This creates fade-out on scroll down, fade-in on scroll up
          const reversedProgress = 1 - progress;
          
          // Map to opacity range with minimum clamp
          const newOpacity = Math.max(
            minOpacity,
            Math.min(maxOpacity, reversedProgress * maxOpacity)
          );
          
          setOpacity(newOpacity);
        } else if (currentScrollY < elementTop) {
          // Above the section: full opacity
          setOpacity(maxOpacity);
        } else if (currentScrollY > elementBottom) {
          // Below the section: minimum opacity
          setOpacity(minOpacity);
        }

        lastScrollY.current = currentScrollY;
        rafId.current = null;
      });
    };

    // Set initial opacity
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [elementRef, minOpacity, maxOpacity, prefersReducedMotion, stableOpacity]);

  return opacity;
}
