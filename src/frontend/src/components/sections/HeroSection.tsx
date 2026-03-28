import { useEffect, useRef } from "react";
import { useDirectionalScrollOpacity } from "../../hooks/useDirectionalScrollOpacity";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { Button } from "../primitives/Button";
import NeuralParticlesOverlay from "../visual/NeuralParticlesOverlay";

interface HeroSectionProps {
  onStartAnonymously?: () => void;
}

export default function HeroSection({ onStartAnonymously }: HeroSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Direction-aware scroll opacity for background image
  const bgImageOpacity = useDirectionalScrollOpacity({
    elementRef: heroRef,
    minOpacity: 0.2,
    maxOpacity: 1,
    stableOpacity: 0.6,
  });

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;
    const hero = heroRef.current;
    hero.style.setProperty(
      "--gradient-animation",
      "gradient-shift 20s ease-in-out infinite",
    );
  }, [prefersReducedMotion]);

  const handleHowItWorks = () => {
    const howItWorksSection = document.getElementById("how-it-works-section");
    howItWorksSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.10 0.06 260) 0%, oklch(0.16 0.09 290) 50%, oklch(0.12 0.07 250) 100%)",
      }}
      aria-label="Hero section"
    >
      {/* Scroll-fading background image layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          opacity: bgImageOpacity,
          transition: prefersReducedMotion ? "none" : "opacity 0.1s ease-out",
        }}
        aria-hidden="true"
      >
        <img
          src="/assets/bg-it.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ mixBlendMode: "luminosity", opacity: 0.35 }}
        />
      </div>

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.10 0.06 260 / 0.7) 0%, oklch(0.16 0.09 290 / 0.6) 50%, oklch(0.12 0.07 250 / 0.7) 100%)",
          backgroundSize: "200% 200%",
          animation: prefersReducedMotion
            ? "none"
            : "var(--gradient-animation, none)",
        }}
        aria-hidden="true"
      />

      {/* Teal glow orb behind heading */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.72 0.2 185 / 0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-[15] max-w-5xl mx-auto text-center space-y-8">
        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.28 255) 0%, oklch(0.68 0.28 290) 50%, oklch(0.68 0.22 28) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
          }}
        >
          MINDVAULT
        </h1>

        <h2
          className="text-2xl md:text-3xl font-semibold"
          style={{ color: "oklch(0.95 0.02 240)" }}
        >
          Your mind deserves care too
        </h2>

        <p
          className="text-lg max-w-2xl mx-auto"
          style={{ color: "oklch(0.80 0.05 270)" }}
        >
          Anonymous AI support that listens, understands, and connects you to
          real help.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button variant="primary" size="lg" onClick={onStartAnonymously}>
            Start Anonymously
          </Button>
          <Button variant="secondary" size="lg" onClick={handleHowItWorks}>
            How It Works
          </Button>
          <Button variant="secondary" size="lg" onClick={handleAbout}>
            About
          </Button>
        </div>
      </div>

      {/* Neural particles overlay */}
      <NeuralParticlesOverlay />
    </section>
  );
}
