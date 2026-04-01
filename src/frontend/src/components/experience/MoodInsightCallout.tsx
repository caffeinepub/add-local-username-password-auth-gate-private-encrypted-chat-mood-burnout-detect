import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Brain, Heart, Minus, Sparkles } from "lucide-react";
import { MoodCategory } from "../../backend";

interface MoodInsightCalloutProps {
  category: MoodCategory;
  categoryLabel: string;
  reassuranceMessage: string;
  className?: string;
}

function getCategoryStyle(category: MoodCategory) {
  switch (category) {
    case MoodCategory.anxiety:
      return {
        icon: Brain,
        iconColor: "oklch(0.78 0.18 70)",
        titleColor: "oklch(0.85 0.15 70)",
        borderStyle: "2px solid oklch(0.78 0.18 70 / 0.4)",
      };
    case MoodCategory.depression:
      return {
        icon: Heart,
        iconColor: "oklch(0.72 0.2 240)",
        titleColor: "oklch(0.80 0.18 240)",
        borderStyle: "2px solid oklch(0.72 0.2 240 / 0.4)",
      };
    case MoodCategory.stress:
      return {
        icon: Brain,
        iconColor: "oklch(0.68 0.22 28)",
        titleColor: "oklch(0.78 0.18 28)",
        borderStyle: "2px solid oklch(0.68 0.22 28 / 0.4)",
      };
    case MoodCategory.positive:
      return {
        icon: Sparkles,
        iconColor: "oklch(0.72 0.2 155)",
        titleColor: "oklch(0.80 0.18 155)",
        borderStyle: "2px solid oklch(0.72 0.2 155 / 0.4)",
      };
    default:
      return {
        icon: Minus,
        iconColor: "oklch(0.75 0.06 270)",
        titleColor: "oklch(0.85 0.04 270)",
        borderStyle: "2px solid oklch(0.75 0.06 270 / 0.4)",
      };
  }
}

export default function MoodInsightCallout({
  category,
  categoryLabel,
  reassuranceMessage,
  className,
}: MoodInsightCalloutProps) {
  const {
    icon: Icon,
    iconColor,
    titleColor,
    borderStyle,
  } = getCategoryStyle(category);

  return (
    <Alert
      className={cn(
        "popup-surface p-8 space-y-4 shadow-2xl animate-modal-entrance",
        className,
      )}
      style={{ border: borderStyle }}
    >
      <Icon className="h-10 w-10" style={{ color: iconColor }} />
      <AlertTitle>
        <span className="text-3xl font-bold" style={{ color: titleColor }}>
          Detected: {categoryLabel}
        </span>
      </AlertTitle>
      <AlertDescription
        className="mt-4 text-xl leading-relaxed font-medium"
        style={{ color: "oklch(0.92 0.03 240)" }}
      >
        {reassuranceMessage}
      </AlertDescription>
    </Alert>
  );
}
