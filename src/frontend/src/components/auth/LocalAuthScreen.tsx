import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, User, AlertCircle } from 'lucide-react';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { getPasswordRequirementsText, getRotationWindowText } from '@/lib/security/passwordPolicy';
import LocalCaptcha from './LocalCaptcha';
import GoBackButton from '../navigation/GoBackButton';

interface LocalAuthScreenProps {
  onGoBack?: () => void;
}

export default function LocalAuthScreen({ onGoBack }: LocalAuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const { signIn, signUp, isLoading, error, clearError } = useLocalAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!captchaVerified) {
      setLocalError('Please complete the security check');
      return;
    }

    try {
      if (mode === 'signup') {
        await signUp(username, password);
      } else {
        await signIn(username, password);
      }
    } catch (err) {
      // Regenerate CAPTCHA on failed attempt
      setCaptchaKey(prev => prev + 1);
      setCaptchaVerified(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setUsername('');
    setPassword('');
    setCaptchaVerified(false);
    setCaptchaKey(prev => prev + 1);
    setLocalError(null);
    clearError();
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f1419] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Go back button at the top */}
        {onGoBack && (
          <div className="flex justify-start">
            <GoBackButton onGoBack={onGoBack} />
          </div>
        )}

        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'signin'
              ? 'Sign in to access your secure MindVault space'
              : 'Create a secure account to get started'}
          </p>
        </div>

        <div className="bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                minLength={3}
                disabled={isLoading}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={isLoading}
                className="bg-background/50"
              />
            </div>

            {mode === 'signup' && (
              <Alert className="bg-accent/10 border-accent/30">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs space-y-1">
                  <p className="font-semibold">Password Requirements:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {getPasswordRequirementsText().map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-muted-foreground">{getRotationWindowText()}</p>
                </AlertDescription>
              </Alert>
            )}

            <LocalCaptcha
              onVerify={setCaptchaVerified}
              regenerateTrigger={captchaKey}
            />

            {displayError && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !captchaVerified}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>{mode === 'signin' ? 'Sign In' : 'Create Account'}</>
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              disabled={isLoading}
              className="text-sm text-accent hover:underline disabled:opacity-50"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
