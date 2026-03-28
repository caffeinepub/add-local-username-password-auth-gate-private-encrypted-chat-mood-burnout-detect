import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, UserCheck } from "lucide-react";
import { useState } from "react";
import { MoodCategory } from "../../backend";
import SessionRequestForm from "./SessionRequestForm";

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
      <DialogContent className="sm:max-w-2xl popup-surface p-10 shadow-2xl animate-modal-entrance">
        {!showForm ? (
          <>
            <DialogHeader className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center ring-4 ring-accent/30 shadow-lg">
                  <UserCheck className="w-12 h-12 text-accent" />
                </div>
              </div>
              <DialogTitle className="text-center text-4xl font-bold popup-text-gradient">
                Connect with a Licensed Therapist
              </DialogTitle>
              <DialogDescription className="text-center space-y-6 pt-4 popup-text-high-contrast text-lg">
                <p className="leading-relaxed">
                  Based on what you've shared, we believe speaking with a
                  licensed therapist could provide valuable support and
                  guidance.
                </p>
                <div className="bg-accent/10 border-2 border-accent/40 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Heart className="w-7 h-7 text-accent" />
                    <span className="font-bold text-2xl text-accent">
                      First Session Free
                    </span>
                  </div>
                  <p className="text-lg popup-text-high-contrast font-medium">
                    Your first therapy session is completely free. No commitment
                    required.
                  </p>
                </div>
                <p className="text-base leading-relaxed">
                  Professional support can make a real difference in your mental
                  health journey. Would you like to proceed?
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="w-full sm:w-auto text-lg py-6 px-8"
              >
                Not Right Now
              </Button>
              <Button
                onClick={handleProceedClick}
                className="w-full sm:w-auto text-lg py-6 px-8"
              >
                Yes, Connect Me
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="space-y-4">
              <DialogTitle className="popup-text-gradient text-3xl font-bold">
                Request a Therapy Session
              </DialogTitle>
              <DialogDescription className="popup-text-high-contrast text-lg leading-relaxed">
                Please provide some details about what you're experiencing. A
                licensed therapist will review your request.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <SessionRequestForm
                category={detectedCategory}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
