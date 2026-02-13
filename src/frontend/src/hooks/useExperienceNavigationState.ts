import { useState, useEffect, useCallback } from 'react';

const HISTORY_STATE_KEY = 'mindvault_experience';

interface ExperienceHistoryState {
  experienceOpen: boolean;
}

/**
 * Centralized hook managing Experience view open/close state synchronized with browser history.
 * Hardened to safely handle null/undefined/non-object history.state on initial mount and navigation.
 */
export function useExperienceNavigationState() {
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state from history on mount
  useEffect(() => {
    try {
      const currentState = window.history.state;
      
      // Safely read the experience state, treating non-objects as empty
      const shouldBeOpen = 
        currentState && 
        typeof currentState === 'object' && 
        currentState[HISTORY_STATE_KEY] === true;
      
      if (shouldBeOpen !== isExperienceOpen) {
        setIsExperienceOpen(shouldBeOpen);
      }
      
      // Ensure we have a valid initial state, preserving existing keys
      const needsInitialization = 
        !currentState || 
        typeof currentState !== 'object' || 
        currentState[HISTORY_STATE_KEY] === undefined;
      
      if (needsInitialization) {
        // Merge with existing state if it's an object, otherwise start fresh
        const baseState = 
          currentState && typeof currentState === 'object' 
            ? { ...currentState } 
            : {};
        
        window.history.replaceState(
          { ...baseState, [HISTORY_STATE_KEY]: false },
          '',
          window.location.href
        );
      }
    } catch (error) {
      // If anything fails during initialization, log and continue with defaults
      console.warn('Failed to initialize experience navigation state:', error);
    } finally {
      // Always mark as initialized so the app can render
      setIsInitialized(true);
    }
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      try {
        const state = event.state;
        
        // Safely read state, treating null/non-object as closed
        const shouldBeOpen = 
          state && 
          typeof state === 'object' && 
          state[HISTORY_STATE_KEY] === true;
        
        setIsExperienceOpen(shouldBeOpen);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.warn('Failed to handle popstate:', error);
        // On error, default to closed state
        setIsExperienceOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openExperience = useCallback(() => {
    if (!isExperienceOpen) {
      setIsExperienceOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      try {
        // Preserve existing history state keys when pushing new entry
        const currentState = window.history.state;
        const baseState = 
          currentState && typeof currentState === 'object' 
            ? { ...currentState } 
            : {};
        
        window.history.pushState(
          { ...baseState, [HISTORY_STATE_KEY]: true },
          '',
          window.location.href
        );
      } catch (error) {
        console.warn('Failed to push history state:', error);
      }
    }
  }, [isExperienceOpen]);

  const closeExperience = useCallback(() => {
    if (isExperienceOpen) {
      setIsExperienceOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      try {
        // Navigate back if we have a valid history entry to return to
        const currentState = window.history.state;
        const hasExperienceState = 
          currentState && 
          typeof currentState === 'object' && 
          currentState[HISTORY_STATE_KEY] === true;
        
        if (hasExperienceState && window.history.length > 1) {
          window.history.back();
        } else {
          // Fallback: replace state to ensure consistency, preserving other keys
          const baseState = 
            currentState && typeof currentState === 'object' 
              ? { ...currentState } 
              : {};
          
          window.history.replaceState(
            { ...baseState, [HISTORY_STATE_KEY]: false },
            '',
            window.location.href
          );
        }
      } catch (error) {
        console.warn('Failed to close experience:', error);
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
