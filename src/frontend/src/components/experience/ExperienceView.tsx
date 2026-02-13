import { X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExperienceShell from './ExperienceShell';
import AnonymousChat from './AnonymousChat';
import DataEntryPanel from './DataEntryPanel';
import LocalAuthScreen from '../auth/LocalAuthScreen';
import { useLocalAuth } from '@/hooks/useLocalAuth';

interface ExperienceViewProps {
  onClose: () => void;
}

export default function ExperienceView({ onClose }: ExperienceViewProps) {
  const { isAuthenticated, signOut, isLoading } = useLocalAuth();

  const handleLogout = async () => {
    await signOut();
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <LocalAuthScreen />;
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f1419] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f1419] px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with close and logout buttons */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">MindVault Experience</h2>
            <p className="text-muted-foreground mt-1">Anonymous and secure space for your thoughts</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label="Close and return to landing page"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat panel */}
          <ExperienceShell className="h-[600px] flex flex-col">
            <AnonymousChat />
          </ExperienceShell>

          {/* Data entry panel */}
          <ExperienceShell className="h-[600px] flex flex-col">
            <DataEntryPanel />
          </ExperienceShell>
        </div>
      </div>
    </div>
  );
}
