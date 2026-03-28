import { useEffect, useState } from "react";
import ExperienceView from "../components/experience/ExperienceView";
import Footer from "../components/layout/Footer";
import StickyNav from "../components/layout/StickyNav";
import ZoomInView from "../components/motion/ZoomInView";
import ZoomPageTransition from "../components/motion/ZoomPageTransition";
import AboutSection from "../components/sections/AboutSection";
import CoreEmotionalQuestionSection from "../components/sections/CoreEmotionalQuestionSection";
import CorporateBurnoutInsightSection from "../components/sections/CorporateBurnoutInsightSection";
import FAQSection from "../components/sections/FAQSection";
import FeaturesGridSection from "../components/sections/FeaturesGridSection";
import FinalCTASection from "../components/sections/FinalCTASection";
import HeroSection from "../components/sections/HeroSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import PrivacyTrustSection from "../components/sections/PrivacyTrustSection";
import SubscriptionPlansPage from "./SubscriptionPlansPage";

type ViewState = "landing" | "experience" | "subscription-plans";

export default function MindVaultLandingPage() {
  const [currentView, setCurrentView] = useState<ViewState>("landing");

  const handleOpenExperience = () => {
    setCurrentView("experience");
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState({ view: "experience" }, "", window.location.href);
  };

  const handleOpenSubscriptionPlans = () => {
    setCurrentView("subscription-plans");
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(
      { view: "subscription-plans" },
      "",
      window.location.href,
    );
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePopState = (_event: PopStateEvent) => {
      if (currentView !== "landing") {
        setCurrentView("landing");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentView]);

  const landingContent = (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <StickyNav />

      <main id="main-content" className="relative">
        <ZoomInView direction="up">
          <HeroSection onStartAnonymously={handleOpenExperience} />
        </ZoomInView>

        <ZoomInView direction="left">
          <CoreEmotionalQuestionSection />
        </ZoomInView>

        <ZoomInView direction="right">
          <HowItWorksSection />
        </ZoomInView>

        <ZoomInView direction="left">
          <FeaturesGridSection />
        </ZoomInView>

        <ZoomInView direction="right">
          <AboutSection />
        </ZoomInView>

        <ZoomInView direction="left">
          <CorporateBurnoutInsightSection />
        </ZoomInView>

        <ZoomInView direction="right">
          <PrivacyTrustSection />
        </ZoomInView>

        <ZoomInView direction="left">
          <FAQSection />
        </ZoomInView>

        <ZoomInView direction="up">
          <FinalCTASection
            onStartMindVault={handleOpenExperience}
            onSubscriptionPlans={handleOpenSubscriptionPlans}
          />
        </ZoomInView>
      </main>

      <Footer />
    </div>
  );

  const experienceContent = <ExperienceView onClose={handleBackToLanding} />;

  const subscriptionPlansContent = (
    <SubscriptionPlansPage onGoBack={handleBackToLanding} />
  );

  if (currentView === "subscription-plans") {
    return subscriptionPlansContent;
  }

  return (
    <ZoomPageTransition
      showExperience={currentView === "experience"}
      landingContent={landingContent}
      experienceContent={experienceContent}
    />
  );
}
