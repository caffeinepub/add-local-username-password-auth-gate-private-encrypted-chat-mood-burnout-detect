import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

interface AccessDeniedScreenProps {
  onGoBack?: () => void;
}

export default function AccessDeniedScreen({
  onGoBack,
}: AccessDeniedScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center p-6">
      <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
        <ShieldAlert className="w-10 h-10 text-destructive" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground">
          You don't have permission to access this area. This section is
          restricted to authorized therapists and administrators.
        </p>
      </div>

      {onGoBack && (
        <Button onClick={onGoBack} variant="outline">
          Go Back
        </Button>
      )}
    </div>
  );
}
