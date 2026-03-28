import { ZOOM_CONFIG } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { type ReactNode, useEffect, useState } from "react";

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
  const [_isTransitioning, setIsTransitioning] = useState(false);
  const [currentView, setCurrentView] = useState<"landing" | "experience">(
    showExperience ? "experience" : "landing",
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const targetView = showExperience ? "experience" : "landing";

    if (currentView !== targetView) {
      setIsTransitioning(true);

      const duration = prefersReducedMotion ? 150 : ZOOM_CONFIG.page.duration;

      const timer = setTimeout(() => {
        setCurrentView(targetView);
        setIsTransitioning(false);
        onTransitionComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [showExperience, currentView, prefersReducedMotion, onTransitionComplete]);

  const getViewStyle = (view: "landing" | "experience") => {
    const isActive = currentView === view;
    const isTarget = showExperience
      ? view === "experience"
      : view === "landing";

    if (prefersReducedMotion) {
      return {
        opacity: isActive ? 1 : 0,
        transform: "scale(1)",
        transition: "opacity 150ms ease-out",
        pointerEvents: isActive ? ("auto" as const) : ("none" as const),
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
      pointerEvents: isActive ? ("auto" as const) : ("none" as const),
    };
  };

  return (
    <div className="relative">
      {/* Landing Page Layer */}
      <div
        style={{
          ...getViewStyle("landing"),
          position: currentView === "landing" ? "relative" : "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: currentView === "landing" ? 1 : 0,
        }}
      >
        {landingContent}
      </div>

      {/* Experience Layer */}
      <div
        style={{
          ...getViewStyle("experience"),
          position: currentView === "experience" ? "relative" : "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: currentView === "experience" ? 1 : 0,
        }}
      >
        {experienceContent}
      </div>
    </div>
  );
}
