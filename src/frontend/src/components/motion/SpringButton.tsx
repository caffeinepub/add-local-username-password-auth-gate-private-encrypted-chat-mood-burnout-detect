import type { ReactNode } from "react";

interface SpringButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function SpringButton({
  children,
  className = "",
  onClick,
}: SpringButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      style={{
        display: "inline-flex",
        cursor: "pointer",
        transition: "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        userSelect: "none",
        background: "none",
        border: "none",
        padding: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.transition =
          "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)";
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
    >
      {children}
    </button>
  );
}
