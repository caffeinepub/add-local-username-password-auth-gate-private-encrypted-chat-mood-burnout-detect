import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      asChild = false,
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const baseStyles =
      "inline-flex items-center justify-center rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none select-none";

    const variants = {
      primary:
        "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-md",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
    };

    const sizes = {
      default: "px-6 py-3 text-base",
      sm: "px-4 py-2 text-sm",
      lg: "px-8 py-4 text-lg",
    };

    const springStyle: React.CSSProperties = {
      transition:
        "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease, background-color 200ms ease",
      ...style,
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        style={springStyle}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.transition =
            "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease, background-color 200ms ease";
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLElement).style.transition =
            "transform 100ms cubic-bezier(0.4, 0, 0.2, 1)";
          (e.currentTarget as HTMLElement).style.transform = "scale(0.95)";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLElement).style.transition =
            "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)";
          (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
        }}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
