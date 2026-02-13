import { useEffect } from 'react';
import HeroSection from '../components/sections/HeroSection';
import CoreEmotionalQuestionSection from '../components/sections/CoreEmotionalQuestionSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import FeaturesGridSection from '../components/sections/FeaturesGridSection';
import CorporateBurnoutInsightSection from '../components/sections/CorporateBurnoutInsightSection';
import PrivacyTrustSection from '../components/sections/PrivacyTrustSection';
import FAQSection from '../components/sections/FAQSection';
import FinalCTASection from '../components/sections/FinalCTASection';
import Footer from '../components/layout/Footer';
import ExperienceView from '../components/experience/ExperienceView';
import ZoomPageTransition from '../components/motion/ZoomPageTransition';
import ZoomInView from '../components/motion/ZoomInView';
import { useExperienceNavigationState } from '../hooks/useExperienceNavigationState';
import { setExperienceIntendedOpen } from '../utils/errorBoundaryDiagnostics';

export default function MindVaultLandingPage() {
  const { isExperienceOpen, isInitialized, openExperience, closeExperience } = useExperienceNavigationState();

  // Update diagnostic flag whenever experience state changes
  useEffect(() => {
    setExperienceIntendedOpen(isExperienceOpen);
  }, [isExperienceOpen]);

  // Fail-open: render landing content even if initialization is delayed
  // This prevents blank screens on initial load
  const shouldShowLoading = !isInitialized;

  const landingContent = (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <main id="main-content" className="relative">
        <ZoomInView>
          <HeroSection onStartAnonymously={openExperience} />
        </ZoomInView>
        
        <ZoomInView>
          <CoreEmotionalQuestionSection />
        </ZoomInView>
        
        <ZoomInView>
          <HowItWorksSection />
        </ZoomInView>
        
        <ZoomInView>
          <FeaturesGridSection />
        </ZoomInView>
        
        <ZoomInView>
          <CorporateBurnoutInsightSection />
        </ZoomInView>
        
        <ZoomInView>
          <PrivacyTrustSection />
        </ZoomInView>
        
        <ZoomInView>
          <FAQSection />
        </ZoomInView>
        
        <ZoomInView>
          <FinalCTASection onStartMindVault={openExperience} />
        </ZoomInView>
      </main>

      <Footer />
    </div>
  );

  const experienceContent = (
    <ExperienceView onClose={closeExperience} />
  );

  // Show minimal loading state only if truly not initialized
  if (shouldShowLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-muted border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ZoomPageTransition
      showExperience={isExperienceOpen}
      landingContent={landingContent}
      experienceContent={experienceContent}
    />
  );
}
