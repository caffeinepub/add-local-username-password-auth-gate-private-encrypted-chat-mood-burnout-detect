import { Quote } from "lucide-react";
import type { ReactNode } from "react";

export interface CalloutProps {
  children: ReactNode;
}

export default function Callout({ children }: CalloutProps) {
  return (
    <div className="glass-card p-8 my-8 border-l-4 border-accent" role="note">
      <div className="flex items-start gap-4">
        <Quote
          className="w-8 h-8 text-accent shrink-0 mt-1"
          aria-hidden="true"
        />
        <p className="text-xl font-semibold text-foreground leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}
