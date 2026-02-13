import { useState } from 'react';
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

export default function MindVaultLandingPage() {
  const [showExperience, setShowExperience] = useState(false);

  const handleOpenExperience = () => {
    setShowExperience(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseExperience = () => {
    setShowExperience(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showExperience) {
    return <ExperienceView onClose={handleCloseExperience} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f1419] text-foreground">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <main id="main-content" className="relative">
        <HeroSection onStartAnonymously={handleOpenExperience} />
        <CoreEmotionalQuestionSection />
        <HowItWorksSection />
        <FeaturesGridSection />
        <CorporateBurnoutInsightSection />
        <PrivacyTrustSection />
        <FAQSection />
        <FinalCTASection onStartMindVault={handleOpenExperience} />
      </main>

      <Footer />
    </div>
  );
}
