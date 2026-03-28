import { Heart, Phone, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface CrisisSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrisisSupportModal({
  isOpen,
  onClose,
}: CrisisSupportModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the close button when modal opens for accessibility
      setTimeout(() => closeButtonRef.current?.focus(), 50);

      // Prevent background scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 m-0 w-full h-full max-w-none max-h-none bg-transparent"
      aria-labelledby="crisis-modal-title"
      open
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
        role="presentation"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-lg mx-auto animate-crisis-entrance">
        {/* Warm gradient border wrapper */}
        <div className="rounded-3xl p-[2px] bg-gradient-to-br from-crisis-warm via-crisis-mid to-crisis-cool shadow-crisis">
          <div className="rounded-[22px] bg-crisis-surface p-8 sm:p-10 text-center space-y-6">
            {/* Close button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close this message"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Heart icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-crisis-warm to-crisis-mid flex items-center justify-center shadow-lg">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h2
                id="crisis-modal-title"
                className="text-3xl sm:text-4xl font-bold text-white leading-tight"
              >
                You Are Not Alone
              </h2>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                We hear you, and we care deeply about your wellbeing. Whatever
                you're going through right now, please know that your life has
                immense value and there are people who want to help.
              </p>
            </div>

            {/* Divider */}
            <div className="w-16 h-[2px] bg-white/30 mx-auto rounded-full" />

            {/* Free session offer */}
            <div className="bg-white/10 rounded-2xl p-5 space-y-3 border border-white/20">
              <p className="text-sm font-semibold text-white/80 uppercase tracking-widest">
                Free Offer — Just For You
              </p>
              <p className="text-base sm:text-lg text-white font-medium">
                A complimentary{" "}
                <span className="font-bold text-crisis-highlight">
                  30-minute session
                </span>{" "}
                with a real therapist is available to you right now.
              </p>
              <p className="text-sm text-white/80">
                Reach out — someone is ready to listen.
              </p>

              {/* Phone number */}
              <div className="flex items-center justify-center gap-3 mt-2 bg-white/15 rounded-xl py-4 px-5 border border-white/25">
                <Phone className="w-5 h-5 text-crisis-highlight shrink-0" />
                <span className="text-xl sm:text-2xl font-bold text-white tracking-wider select-all">
                  90xoxo90xo
                </span>
              </div>
            </div>

            {/* Supportive closing message */}
            <p className="text-sm text-white/70 leading-relaxed">
              Taking this step takes courage. You deserve support, compassion,
              and care — and help is just a call away.
            </p>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              I've read this — close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
