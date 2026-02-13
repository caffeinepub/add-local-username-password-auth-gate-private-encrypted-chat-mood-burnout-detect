import { useState } from 'react';
import { X, LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExperienceShell from './ExperienceShell';
import AnonymousChat from './AnonymousChat';
import DataEntryPanel from './DataEntryPanel';
import TherapistInboxPanel from './TherapistInboxPanel';
import ExperienceEntryGate from './ExperienceEntryGate';
import GoBackButton from '../navigation/GoBackButton';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

interface ExperienceViewProps {
  onClose: () => void;
}

export default function ExperienceView({ onClose }: ExperienceViewProps) {
  const { isAuthenticated: localAuthAuthenticated, signOut: localSignOut, isLoading: localLoading } = useLocalAuth();
  const { identity, clear: iiClear } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'experience' | 'inbox'>('experience');

  const isAuthenticated = localAuthAuthenticated || !!identity;
  const isLoading = localLoading;

  const handleLogout = async () => {
    if (localAuthAuthenticated) {
      await localSignOut();
    }
    if (identity) {
      await iiClear();
      queryClient.clear();
    }
  };

  const handleGoBack = () => {
    // Use the centralized close handler from parent
    onClose();
  };

  // Show entry gate if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <ExperienceEntryGate onAuthenticated={() => {}} onGoBack={handleGoBack} />;
  }

  // Show loading state while checking auth
  if (isLoading || isAdminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-muted border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with go back, close and logout buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GoBackButton onGoBack={handleGoBack} />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">MindVault Experience</h2>
              <p className="text-muted-foreground mt-1">Anonymous and secure space for your thoughts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                onClick={() => setActiveTab(activeTab === 'experience' ? 'inbox' : 'experience')}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                {activeTab === 'experience' ? 'Therapist Inbox' : 'Experience'}
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </Button>
          </div>
        </div>

        {/* Main content area */}
        {isAdmin ? (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'experience' | 'inbox')} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="experience">User Experience</TabsTrigger>
              <TabsTrigger value="inbox">Therapist Inbox</TabsTrigger>
            </TabsList>
            
            <TabsContent value="experience" className="mt-6">
              <ExperienceShell>
                <Tabs defaultValue="chat" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chat">Anonymous Chat</TabsTrigger>
                    <TabsTrigger value="journal">Data Entry</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat" className="mt-6">
                    <AnonymousChat />
                  </TabsContent>
                  
                  <TabsContent value="journal" className="mt-6">
                    <DataEntryPanel />
                  </TabsContent>
                </Tabs>
              </ExperienceShell>
            </TabsContent>
            
            <TabsContent value="inbox" className="mt-6">
              <ExperienceShell>
                <TherapistInboxPanel />
              </ExperienceShell>
            </TabsContent>
          </Tabs>
        ) : (
          <ExperienceShell>
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Anonymous Chat</TabsTrigger>
                <TabsTrigger value="journal">Data Entry</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-6">
                <AnonymousChat />
              </TabsContent>
              
              <TabsContent value="journal" className="mt-6">
                <DataEntryPanel />
              </TabsContent>
            </Tabs>
          </ExperienceShell>
        )}
      </div>
    </div>
  );
}
