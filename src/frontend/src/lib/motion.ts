// Motion constants for consistent animations across the app
export const MOTION = {
  duration: {
    fast: 300,
    normal: 500,
    slow: 700,
    page: 600, // Page-level transitions
    component: 400, // Component-level zoom entries
  },
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  zoomEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Dynamic bounce for zoom
} as const;

// Helper to get transition string
export function getTransition(duration: keyof typeof MOTION.duration = 'normal'): string {
  return `${MOTION.duration[duration]}ms ${MOTION.easing}`;
}

// Zoom-specific transition helpers
export function getZoomTransition(type: 'page' | 'component' = 'component'): string {
  const duration = type === 'page' ? MOTION.duration.page : MOTION.duration.component;
  return `${duration}ms ${MOTION.zoomEasing}`;
}

export function getZoomStyles(isActive: boolean, reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      opacity: isActive ? 1 : 0,
      transform: 'scale(1)',
      transition: `opacity ${MOTION.duration.fast}ms ${MOTION.easing}`,
    };
  }

  return {
    opacity: isActive ? 1 : 0,
    transform: isActive ? 'scale(1)' : 'scale(0.95)',
    transition: `opacity ${getZoomTransition('component')}, transform ${getZoomTransition('component')}`,
  };
}

export const ZOOM_CONFIG = {
  page: {
    duration: MOTION.duration.page,
    easing: MOTION.zoomEasing,
    scaleFrom: 0.9,
    scaleTo: 1,
  },
  component: {
    duration: MOTION.duration.component,
    easing: MOTION.zoomEasing,
    scaleFrom: 0.95,
    scaleTo: 1,
  },
} as const;
