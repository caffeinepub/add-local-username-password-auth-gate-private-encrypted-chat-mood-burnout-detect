import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, UserCheck } from 'lucide-react';
import SessionRequestForm from './SessionRequestForm';
import { MoodCategory } from '../../backend';

interface TherapistPromptModalProps {
  open: boolean;
  onProceed: () => void;
  onDecline: () => void;
  detectedCategory?: MoodCategory;
}

export default function TherapistPromptModal({
  open,
  onProceed,
  onDecline,
  detectedCategory = MoodCategory.neutral,
}: TherapistPromptModalProps) {
  const [showForm, setShowForm] = useState(false);

  const handleProceedClick = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    onProceed();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleDecline = () => {
    setShowForm(false);
    onDecline();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShowForm(false);
      onDecline();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md popup-surface">
        {!showForm ? (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <UserCheck className="w-8 h-8 text-accent" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl popup-text-gradient">
                Connect with a Licensed Therapist
              </DialogTitle>
              <DialogDescription className="text-center space-y-3 pt-2 popup-text-high-contrast">
                <p>
                  Based on what you've shared, we believe speaking with a licensed therapist
                  could provide valuable support and guidance.
                </p>
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-accent">First Session Free</span>
                  </div>
                  <p className="text-sm popup-text-high-contrast">
                    Your first therapy session is completely free. No commitment required.
                  </p>
                </div>
                <p className="text-sm">
                  Professional support can make a real difference in your mental health journey.
                  Would you like to proceed?
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="w-full sm:w-auto"
              >
                Not Right Now
              </Button>
              <Button
                onClick={handleProceedClick}
                className="w-full sm:w-auto"
              >
                Yes, Connect Me
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="popup-text-gradient">Request a Therapy Session</DialogTitle>
              <DialogDescription className="popup-text-high-contrast">
                Please provide some details about what you're experiencing. A licensed therapist will review your request.
              </DialogDescription>
            </DialogHeader>
            <SessionRequestForm
              category={detectedCategory}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
