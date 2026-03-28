import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/system/ErrorBoundary";
import { LocalAuthProvider } from "./hooks/useLocalAuth";
import MindVaultLandingPage from "./pages/MindVaultLandingPage";

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
