import { useState, useEffect, useCallback } from 'react';

const HISTORY_STATE_KEY = 'mindvault_experience';

interface ExperienceHistoryState {
  experienceOpen: boolean;
}

/**
 * Centralized hook managing Experience view open/close state synchronized with browser history.
 * Prevents intermittent crashes by ensuring state consistency across navigation cycles.
 */
export function useExperienceNavigationState() {
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state from history on mount
  useEffect(() => {
    const currentState = window.history.state as ExperienceHistoryState | null;
    const shouldBeOpen = currentState?.[HISTORY_STATE_KEY] === true;
    
    if (shouldBeOpen !== isExperienceOpen) {
      setIsExperienceOpen(shouldBeOpen);
    }
    
    // Ensure we have a valid initial state
    if (!currentState || currentState[HISTORY_STATE_KEY] === undefined) {
      window.history.replaceState(
        { ...currentState, [HISTORY_STATE_KEY]: false },
        '',
        window.location.href
      );
    }
    
    setIsInitialized(true);
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as ExperienceHistoryState | null;
      const shouldBeOpen = state?.[HISTORY_STATE_KEY] === true;
      setIsExperienceOpen(shouldBeOpen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openExperience = useCallback(() => {
    if (!isExperienceOpen) {
      setIsExperienceOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Push new history entry with experience open state
      window.history.pushState(
        { [HISTORY_STATE_KEY]: true },
        '',
        window.location.href
      );
    }
  }, [isExperienceOpen]);

  const closeExperience = useCallback(() => {
    if (isExperienceOpen) {
      setIsExperienceOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Navigate back if we have a valid history entry to return to
      const currentState = window.history.state as ExperienceHistoryState | null;
      if (currentState?.[HISTORY_STATE_KEY] === true && window.history.length > 1) {
        window.history.back();
      } else {
        // Fallback: replace state to ensure consistency
        window.history.replaceState(
          { [HISTORY_STATE_KEY]: false },
          '',
          window.location.href
        );
      }
    }
  }, [isExperienceOpen]);

  return {
    isExperienceOpen,
    isInitialized,
    openExperience,
    closeExperience,
  };
}
