import { useInView } from "@/lib/useInView";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { Eye, FileCheck, Lock, Shield } from "lucide-react";

const privacyCommitments = [
  {
    icon: Shield,
    text: "Your data is never sold or shared with third parties",
  },
  {
    icon: Lock,
    text: "End-to-end encryption protects all your conversations",
  },
  {
    icon: Eye,
    text: "Anonymous by default - no personal information required",
  },
  {
    icon: FileCheck,
    text: "HIPAA-compliant security standards",
  },
];

export default function PrivacyTrustSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="privacy-section" ref={ref} className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(-20px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 0.8s ease-out, transform 0.8s ease-out",
            }}
          >
            <p className="text-accent font-semibold mb-2 uppercase tracking-wide text-sm">
              Privacy & Trust
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Your Privacy is Our Priority
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We understand that mental health is deeply personal. That's why
              we've built MindVault with privacy and security at its core.
            </p>

            <ul className="space-y-4">
              {privacyCommitments.map((commitment, index) => {
                const Icon = commitment.icon;
                const delay = prefersReducedMotion ? 0 : index * 100;

                return (
                  <li
                    key={commitment.text}
                    className="flex items-start gap-3"
                    style={{
                      opacity: isInView ? 1 : 0,
                      transform: isInView
                        ? "translateX(0)"
                        : "translateX(-10px)",
                      transition: prefersReducedMotion
                        ? "none"
                        : `opacity 0.6s ease-out ${delay + 200}ms, transform 0.6s ease-out ${delay + 200}ms`,
                    }}
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-foreground">{commitment.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Trust badge illustration */}
          <div
            className="flex items-center justify-center"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(20px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 0.8s ease-out 200ms, transform 0.8s ease-out 200ms",
            }}
          >
            <img
              src="/assets/generated/mindvault-trust-badge.dim_512x512.png"
              alt="Trust and security badge"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
