/**
 * Utilities for capturing navigation context during ErrorBoundary crashes.
 * Helps debug intermittent navigation-related failures.
 */

interface NavigationContext {
  url: string;
  historyState: any;
  experienceIntendedOpen: boolean;
  timestamp: string;
}

let experienceIntendedOpenFlag = false;

export function setExperienceIntendedOpen(isOpen: boolean): void {
  experienceIntendedOpenFlag = isOpen;
}

export function getNavigationContext(): NavigationContext {
  let historyState: any = null;
  
  try {
    historyState = window.history.state;
  } catch (e) {
    historyState = { error: 'Unable to read history.state' };
  }

  return {
    url: window.location.href,
    historyState: safeStringify(historyState),
    experienceIntendedOpen: experienceIntendedOpenFlag,
    timestamp: new Date().toISOString(),
  };
}

function safeStringify(obj: any): any {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return { error: 'Unable to stringify object' };
  }
}

export function logNavigationContext(error: Error, errorInfo?: any): void {
  const context = getNavigationContext();
  
  console.group('🔍 ErrorBoundary Navigation Context');
  console.error('Original Error:', error);
  if (errorInfo) {
    console.error('Error Info:', errorInfo);
  }
  console.log('URL:', context.url);
  console.log('History State:', context.historyState);
  console.log('Experience Intended Open:', context.experienceIntendedOpen);
  console.log('Timestamp:', context.timestamp);
  console.groupEnd();
}
