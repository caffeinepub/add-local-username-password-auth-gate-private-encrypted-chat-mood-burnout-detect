import { ZOOM_CONFIG } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { type ReactNode, useEffect, useState } from "react";

interface ZoomTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ZoomTransition({
  children,
  className = "",
  delay = 0,
}: ZoomTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (prefersReducedMotion) {
    return (
      <div
        className={className}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 150ms ease-out",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "scale(1)"
          : `scale(${ZOOM_CONFIG.component.scaleFrom})`,
        transition: `opacity ${ZOOM_CONFIG.component.duration}ms ${ZOOM_CONFIG.component.easing}, transform ${ZOOM_CONFIG.component.duration}ms ${ZOOM_CONFIG.component.easing}`,
      }}
    >
      {children}
    </div>
  );
}
