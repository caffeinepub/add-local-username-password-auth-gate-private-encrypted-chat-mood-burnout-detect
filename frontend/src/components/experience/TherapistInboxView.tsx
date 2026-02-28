import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Inbox, Bell, FileText, MessageSquare } from 'lucide-react';
import GlassCard from '../primitives/GlassCard';
import InboxMessageThread from './InboxMessageThread';
import InboxFilterControls from './InboxFilterControls';
import { useGetInboxMessages, useGetNotifications, useGetAllSessionNotes } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { filterByClient, filterByReadStatus, sortByDate, groupByThread } from '@/lib/inboxFilters';
import type { InboxMessage, Notification, SessionNote } from '@/backend';

export default function TherapistInboxView() {
  const { identity } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications' | 'notes'>('messages');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const { data: messages = [], isLoading: messagesLoading } = useGetInboxMessages(
    identity?.getPrincipal().toString() || ''
  );
  const { data: notifications = [], isLoading: notificationsLoading } = useGetNotifications(
    identity?.getPrincipal().toString() || ''
  );
  const { data: sessionNotes = [], isLoading: notesLoading } = useGetAllSessionNotes();

  // Filter and sort messages
  const filteredMessages = useMemo(() => {
    let filtered = [...messages];
    
    if (selectedClient) {
      filtered = filterByClient(filtered, selectedClient);
    }
    
    if (readFilter !== 'all') {
      filtered = filterByReadStatus(filtered, readFilter === 'read');
    }
    
    filtered = sortByDate(filtered, sortOrder === 'newest');
    
    return filtered;
  }, [messages, selectedClient, readFilter, sortOrder]);

  // Group messages by thread
  const messageThreads = useMemo(() => {
    return groupByThread(filteredMessages);
  }, [filteredMessages]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];
    
    if (readFilter !== 'all') {
      filtered = filtered.filter(n => n.read === (readFilter === 'read'));
    }
    
    return filtered.sort((a, b) => {
      const aTime = Number(a.timestamp);
      const bTime = Number(b.timestamp);
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });
  }, [notifications, readFilter, sortOrder]);

  // Filter session notes
  const filteredNotes = useMemo(() => {
    let filtered = [...sessionNotes];
    
    if (selectedClient) {
      filtered = filtered.filter(n => n.client.toString() === selectedClient);
    }
    
    return filtered.sort((a, b) => {
      const aTime = Number(a.timestamp);
      const bTime = Number(b.timestamp);
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });
  }, [sessionNotes, selectedClient, sortOrder]);

  // Get unique clients from messages
  const uniqueClients = useMemo(() => {
    const clientSet = new Set<string>();
    messages.forEach(msg => {
      clientSet.add(msg.sender.toString());
    });
    sessionNotes.forEach(note => {
      clientSet.add(note.client.toString());
    });
    return Array.from(clientSet);
  }, [messages, sessionNotes]);

  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleClearFilters = () => {
    setSelectedClient(null);
    setReadFilter('all');
    setSortOrder('newest');
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 12) return principal;
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Inbox className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold text-foreground">Therapist Inbox</h2>
      </div>

      <InboxFilterControls
        clients={uniqueClients}
        selectedClient={selectedClient}
        onClientChange={setSelectedClient}
        readFilter={readFilter}
        onReadFilterChange={setReadFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onClearFilters={handleClearFilters}
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Messages
            {unreadMessagesCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1 text-xs">
                {unreadMessagesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
            {unreadNotificationsCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1 text-xs">
                {unreadNotificationsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="w-4 h-4" />
            Session Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="mt-6">
          <GlassCard className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              {messagesLoading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              )}

              {!messagesLoading && messageThreads.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No messages found.</p>
                  <p className="text-xs text-muted-foreground">
                    Client messages will appear here.
                  </p>
                </div>
              )}

              {!messagesLoading && messageThreads.length > 0 && (
                <div className="space-y-6">
                  {messageThreads.map((thread) => (
                    <InboxMessageThread key={thread.threadId} messages={thread.messages} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </GlassCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <GlassCard className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              {notificationsLoading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              )}

              {!notificationsLoading && filteredNotifications.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                  <Bell className="w-12 h-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No notifications found.</p>
                  <p className="text-xs text-muted-foreground">
                    System notifications will appear here.
                  </p>
                </div>
              )}

              {!notificationsLoading && filteredNotifications.length > 0 && (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id.toString()}
                      className={`p-4 rounded-lg border transition-colors ${
                        notification.read
                          ? 'bg-secondary/30 border-border/30'
                          : 'bg-accent/10 border-accent/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Bell className={`w-4 h-4 ${notification.read ? 'text-muted-foreground' : 'text-accent'}`} />
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <Badge variant="default" className="text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </GlassCard>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <GlassCard className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              {notesLoading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              )}

              {!notesLoading && filteredNotes.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                  <FileText className="w-12 h-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No session notes found.</p>
                  <p className="text-xs text-muted-foreground">
                    Session notes will appear here.
                  </p>
                </div>
              )}

              {!notesLoading && filteredNotes.length > 0 && (
                <div className="space-y-3">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id.toString()}
                      className="p-4 rounded-lg bg-secondary/50 border border-border/30 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-foreground">
                            Session #{note.sessionId.toString()}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(note.timestamp)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          Client: <code className="bg-secondary px-2 py-0.5 rounded">
                            {formatPrincipal(note.client.toString())}
                          </code>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
