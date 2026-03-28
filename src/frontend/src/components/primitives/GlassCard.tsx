import { getZoomTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => {
    const transitionStyle = `transition-all ${getZoomTransition("component")}`;

    return (
      <div
        ref={ref}
        className={cn(
          "glass-card hover:scale-[1.02] hover:shadow-lg focus-within:scale-[1.02] focus-within:shadow-lg",
          transitionStyle,
          className,
        )}
        {...props}
      />
    );
  },
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
