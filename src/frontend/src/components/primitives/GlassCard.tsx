import { getZoomTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, style, ...props }, ref) => {
    const transitionStyle = `transition-all ${getZoomTransition("component")}`;

    return (
      <div
        ref={ref}
        className={cn(
          "hover:scale-[1.02] hover:shadow-lg focus-within:scale-[1.02] focus-within:shadow-lg rounded-xl",
          transitionStyle,
          className,
        )}
        style={{
          background: "oklch(0.17 0.05 260 / 0.85)",
          border: "1px solid oklch(0.28 0.06 260)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          ...style,
        }}
        {...props}
      />
    );
  },
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
