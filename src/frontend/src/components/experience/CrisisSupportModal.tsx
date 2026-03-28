import { Heart, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
      setTimeout(() => closeButtonRef.current?.focus(), 50);
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
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.dialog
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 m-0 w-full h-full max-w-none max-h-none bg-transparent border-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-labelledby="crisis-modal-title"
          open
        >
          {/* Full-screen warm gradient background */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-rose-900 via-purple-900 to-indigo-900 backdrop-blur-md"
            onClick={onClose}
            onKeyDown={handleBackdropKey}
            aria-hidden="true"
          />

          {/* Glowing radial overlay for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(244,63,94,0.35) 0%, rgba(168,85,247,0.2) 45%, transparent 75%)",
            }}
            aria-hidden="true"
          />

          {/* Content panel */}
          <motion.div
            className="relative z-10 w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 26,
              delay: 0.05,
            }}
          >
            {/* Glowing border wrapper */}
            <div
              className="rounded-3xl p-[2px]"
              style={{
                background:
                  "linear-gradient(135deg, #fb7185, #c084fc, #818cf8)",
                boxShadow:
                  "0 0 48px 12px rgba(251,113,133,0.4), 0 0 96px 24px rgba(192,132,252,0.25), 0 25px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div className="rounded-[22px] bg-gradient-to-b from-rose-950/95 to-indigo-950/95 p-10 sm:p-14 text-center space-y-7 relative">
                {/* Top-right close button */}
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-rose-300/60"
                  aria-label="Close this message"
                  data-ocid="crisis.close_button"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Pulsing heart icon */}
                <div className="flex justify-center">
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #fb7185 0%, #c084fc 60%, #818cf8 100%)",
                      boxShadow: "0 0 32px 8px rgba(251,113,133,0.5)",
                    }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 1.8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Heart className="w-12 h-12 text-white fill-white" />
                  </motion.div>
                </div>

                {/* Headline */}
                <div className="space-y-4">
                  <h2
                    id="crisis-modal-title"
                    className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight"
                  >
                    You Are Not Alone
                  </h2>
                  <p className="text-lg sm:text-xl text-rose-100/90 leading-relaxed max-w-lg mx-auto">
                    We hear you, and we care deeply. Whatever you&apos;re
                    carrying right now — your life has immense value. People
                    care about you, and you deserve to feel that.
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="w-20 h-[2px] mx-auto rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #fb7185, #c084fc)",
                  }}
                />

                {/* FREE 60-MINUTE SESSION offer box */}
                <div
                  className="rounded-2xl p-6 sm:p-8 space-y-4 border border-rose-400/30"
                  style={{ background: "rgba(251,113,133,0.12)" }}
                >
                  <p className="text-xs font-bold text-rose-300 uppercase tracking-[0.2em]">
                    Free Offer — Just For You
                  </p>

                  <p className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                    FREE 60-MINUTE SESSION
                  </p>
                  <p className="text-base sm:text-lg text-rose-100/85">
                    with a licensed therapist — just for you.
                    <br />
                    <span className="text-rose-200/70 text-sm">
                      No strings attached. Your wellbeing comes first.
                    </span>
                  </p>

                  {/* Phone number */}
                  <div
                    className="flex items-center justify-center gap-3 rounded-xl py-4 px-6 border border-rose-300/30"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <Phone className="w-6 h-6 text-rose-300 shrink-0" />
                    <span className="text-3xl font-bold text-white tracking-wider select-all">
                      90xoxo90xo
                    </span>
                  </div>
                </div>

                {/* Closing message */}
                <p className="text-sm text-rose-200/60 leading-relaxed max-w-md mx-auto">
                  Reaching out takes courage. You deserve compassion, support,
                  and someone who truly listens. Help is just one call away.
                </p>

                {/* Bottom dismiss button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-4 px-6 rounded-xl border border-white/20 text-white font-semibold text-base transition-all hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-rose-300/50"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                  data-ocid="crisis.cancel_button"
                >
                  I&apos;ve read this — close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
}
