import { type ReactNode, useEffect, useState, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { ZOOM_CONFIG } from '@/lib/motion';

interface ZoomPageTransitionProps {
  showExperience: boolean;
  landingContent: ReactNode;
  experienceContent: ReactNode;
  onTransitionComplete?: () => void;
}

export default function ZoomPageTransition({
  showExperience,
  landingContent,
  experienceContent,
  onTransitionComplete,
}: ZoomPageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'experience'>(
    showExperience ? 'experience' : 'landing'
  );
  const prefersReducedMotion = usePrefersReducedMotion();
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const targetView = showExperience ? 'experience' : 'landing';
    
    // Clear any pending transition timer to prevent race conditions
    if (transitionTimerRef.current !== null) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    
    if (currentView !== targetView) {
      setIsTransitioning(true);
      
      const duration = prefersReducedMotion ? 150 : ZOOM_CONFIG.page.duration;
      
      transitionTimerRef.current = window.setTimeout(() => {
        setCurrentView(targetView);
        setIsTransitioning(false);
        transitionTimerRef.current = null;
        onTransitionComplete?.();
      }, duration);
    }

    return () => {
      if (transitionTimerRef.current !== null) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [showExperience, currentView, prefersReducedMotion, onTransitionComplete]);

  const getViewStyle = (view: 'landing' | 'experience') => {
    const isActive = currentView === view;
    const isTarget = showExperience ? view === 'experience' : view === 'landing';

    if (prefersReducedMotion) {
      return {
        opacity: isActive ? 1 : 0,
        transform: 'scale(1)',
        transition: `opacity 150ms ease-out`,
        pointerEvents: isActive ? ('auto' as const) : ('none' as const),
      };
    }

    // Zoom out when leaving, zoom in when entering
    let scale = 1;
    let opacity = 1;

    if (!isActive) {
      opacity = 0;
      scale = isTarget ? ZOOM_CONFIG.page.scaleFrom : 1.05; // Zoom out when leaving, zoom in when entering
    }

    return {
      opacity,
      transform: `scale(${scale})`,
      transition: `opacity ${ZOOM_CONFIG.page.duration}ms ${ZOOM_CONFIG.page.easing}, transform ${ZOOM_CONFIG.page.duration}ms ${ZOOM_CONFIG.page.easing}`,
      pointerEvents: isActive ? ('auto' as const) : ('none' as const),
    };
  };

  return (
    <div className="relative">
      {/* Landing Page Layer */}
      <div
        style={{
          ...getViewStyle('landing'),
          position: currentView === 'landing' ? 'relative' : 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: currentView === 'landing' ? 1 : 0,
        }}
      >
        {landingContent}
      </div>

      {/* Experience Layer */}
      <div
        style={{
          ...getViewStyle('experience'),
          position: currentView === 'experience' ? 'relative' : 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: currentView === 'experience' ? 1 : 0,
        }}
      >
        {experienceContent}
      </div>
    </div>
  );
}
