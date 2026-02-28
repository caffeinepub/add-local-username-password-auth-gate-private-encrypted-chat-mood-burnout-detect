import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/system/ErrorBoundary';
import MindVaultLandingPage from './pages/MindVaultLandingPage';
import { LocalAuthProvider } from './hooks/useLocalAuth';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <LocalAuthProvider>
          <MindVaultLandingPage />
          <Toaster position="top-right" />
        </LocalAuthProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
