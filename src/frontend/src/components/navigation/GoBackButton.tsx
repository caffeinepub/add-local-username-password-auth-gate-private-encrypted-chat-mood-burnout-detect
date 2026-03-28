import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface GoBackButtonProps {
  onGoBack?: () => void;
  className?: string;
}

export default function GoBackButton({
  onGoBack,
  className,
}: GoBackButtonProps) {
  const handleClick = () => {
    if (onGoBack) {
      onGoBack();
    } else if (window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="sm"
      className={`gap-2 ${className || ""}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4" />
      Go back
    </Button>
  );
}
