import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

export interface ConversationPreviewProps {
  preview?: {
    user: string;
    ai: string;
  };
}

export default function ConversationPreview({
  preview,
}: ConversationPreviewProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!preview) return null;

  return (
    <section
      className={`mt-12 max-w-2xl mx-auto glass-card p-6 space-y-4 transition-all ${
        prefersReducedMotion
          ? ""
          : "duration-500 animate-in fade-in slide-in-from-bottom-4"
      }`}
      aria-label="Example conversation"
    >
      <div className="flex justify-end">
        <div className="bg-accent/20 text-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
          <p className="text-sm">{preview.user}</p>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="bg-muted/50 text-foreground rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
          <p className="text-sm">{preview.ai}</p>
        </div>
      </div>
    </section>
  );
}
