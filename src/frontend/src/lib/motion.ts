// Motion constants for consistent animations across the app
export const MOTION = {
  duration: {
    fast: 300,
    normal: 500,
    slow: 700,
  },
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Helper to get transition string
export function getTransition(duration: keyof typeof MOTION.duration = 'normal'): string {
  return `${MOTION.duration[duration]}ms ${MOTION.easing}`;
}
