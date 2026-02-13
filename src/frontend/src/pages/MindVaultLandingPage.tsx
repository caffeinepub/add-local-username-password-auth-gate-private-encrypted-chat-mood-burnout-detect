import { useState, useEffect } from 'react';
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
import SubscriptionPlansPage from './SubscriptionPlansPage';
import ZoomPageTransition from '../components/motion/ZoomPageTransition';
import ZoomInView from '../components/motion/ZoomInView';

type ViewState = 'landing' | 'experience' | 'subscription-plans';

export default function MindVaultLandingPage() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  const handleOpenExperience = () => {
    setCurrentView('experience');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Push a history state so browser back works
    window.history.pushState({ view: 'experience' }, '', window.location.href);
  };

  const handleOpenSubscriptionPlans = () => {
    setCurrentView('subscription-plans');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Push a history state so browser back works
    window.history.pushState({ view: 'subscription-plans' }, '', window.location.href);
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (currentView !== 'landing') {
        setCurrentView('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

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
          <HeroSection onStartAnonymously={handleOpenExperience} />
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
          <FinalCTASection 
            onStartMindVault={handleOpenExperience}
            onSubscriptionPlans={handleOpenSubscriptionPlans}
          />
        </ZoomInView>
      </main>

      <Footer />
    </div>
  );

  const experienceContent = (
    <ExperienceView onClose={handleBackToLanding} />
  );

  const subscriptionPlansContent = (
    <SubscriptionPlansPage onGoBack={handleBackToLanding} />
  );

  // Render based on current view
  if (currentView === 'subscription-plans') {
    return subscriptionPlansContent;
  }

  return (
    <ZoomPageTransition
      showExperience={currentView === 'experience'}
      landingContent={landingContent}
      experienceContent={experienceContent}
    />
  );
}
