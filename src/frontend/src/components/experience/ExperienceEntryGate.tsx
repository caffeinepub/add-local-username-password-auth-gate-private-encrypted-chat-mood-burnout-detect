import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Key, Loader2 } from 'lucide-react';
import LocalAuthScreen from '../auth/LocalAuthScreen';
import GoBackButton from '../navigation/GoBackButton';
import ZoomTransition from '../motion/ZoomTransition';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

interface ExperienceEntryGateProps {
  onAuthenticated: () => void;
  onGoBack?: () => void;
}

export default function ExperienceEntryGate({ onAuthenticated, onGoBack }: ExperienceEntryGateProps) {
  const [authMode, setAuthMode] = useState<'choice' | 'local' | 'ii' | null>(null);
  const { login, loginStatus } = useInternetIdentity();

  const handleInternetIdentityLogin = async () => {
    setAuthMode('ii');
    try {
      await login();
      onAuthenticated();
    } catch (error) {
      console.error('Internet Identity login failed:', error);
      setAuthMode('choice');
    }
  };

  const handleBackToChoice = () => {
    setAuthMode('choice');
  };

  // Show local auth screen
  if (authMode === 'local') {
    return <LocalAuthScreen onGoBack={handleBackToChoice} />;
  }

  // Show II loading state
  if (authMode === 'ii' && loginStatus === 'logging-in') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f1419] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Connecting to Internet Identity...</p>
        </div>
      </div>
    );
  }

  // Show choice screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f1419] flex items-center justify-center px-4 py-8">
      <ZoomTransition className="w-full max-w-md space-y-6">
        {/* Go back button at the top */}
        {onGoBack && (
          <div className="flex justify-start">
            <GoBackButton onGoBack={onGoBack} />
          </div>
        )}

        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Choose Your Login Method</h1>
          <p className="text-muted-foreground">
            Select how you'd like to access your secure MindVault space
          </p>
        </div>

        <div className="space-y-4">
          {/* Internet Identity Option */}
          <button
            onClick={handleInternetIdentityLogin}
            disabled={loginStatus === 'logging-in'}
            className="w-full bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/30 transition-colors">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Internet Identity
                </h3>
                <p className="text-sm text-muted-foreground">
                  Secure blockchain-based authentication. No passwords to remember.
                </p>
              </div>
            </div>
          </button>

          {/* Local Username/Password Option */}
          <button
            onClick={() => setAuthMode('local')}
            className="w-full bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/30 transition-colors">
                <Key className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Username & Password
                </h3>
                <p className="text-sm text-muted-foreground">
                  Traditional login with enhanced security features and CAPTCHA verification.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Both methods provide secure, encrypted access to your data</p>
        </div>
      </ZoomTransition>
    </div>
  );
}
