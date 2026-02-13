import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/system/ErrorBoundary';
import MindVaultLandingPage from './pages/MindVaultLandingPage';

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <MindVaultLandingPage />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
