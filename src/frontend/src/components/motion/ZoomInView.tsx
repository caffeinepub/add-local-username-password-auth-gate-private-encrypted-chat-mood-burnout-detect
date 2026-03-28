import { ZOOM_CONFIG } from "@/lib/motion";
import { useInView } from "@/lib/useInView";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import type { ReactNode } from "react";

interface ZoomInViewProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export default function ZoomInView({
  children,
  className = "",
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
}: ZoomInViewProps) {
  const { ref, isInView } = useInView({ threshold, rootMargin });
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div ref={ref as any} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref as any}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView
          ? "scale(1)"
          : `scale(${ZOOM_CONFIG.component.scaleFrom})`,
        transition: `opacity ${ZOOM_CONFIG.component.duration}ms ${ZOOM_CONFIG.component.easing}, transform ${ZOOM_CONFIG.component.duration}ms ${ZOOM_CONFIG.component.easing}`,
      }}
    >
      {children}
    </div>
  );
}
