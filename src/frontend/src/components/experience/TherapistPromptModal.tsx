import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, UserCheck } from 'lucide-react';

interface TherapistPromptModalProps {
  open: boolean;
  onProceed: () => void;
  onDecline: () => void;
}

export default function TherapistPromptModal({
  open,
  onProceed,
  onDecline,
}: TherapistPromptModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-accent" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Connect with a Licensed Therapist
          </DialogTitle>
          <DialogDescription className="text-center space-y-3 pt-2">
            <p>
              Based on what you've shared, we believe speaking with a licensed therapist
              could provide valuable support and guidance.
            </p>
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-accent" />
                <span className="font-semibold text-accent">First Session Free</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your first therapy session is completely free. No commitment required.
              </p>
            </div>
            <p className="text-sm">
              Professional support can make a real difference in your mental health journey.
              Would you like to proceed?
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onDecline}
            className="w-full sm:w-auto"
          >
            Not Right Now
          </Button>
          <Button
            onClick={onProceed}
            className="w-full sm:w-auto"
          >
            Yes, Connect Me
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
