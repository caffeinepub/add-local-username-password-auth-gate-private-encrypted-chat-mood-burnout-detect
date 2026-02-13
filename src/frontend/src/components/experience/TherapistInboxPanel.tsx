import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Inbox, Calendar, User, MessageSquare } from 'lucide-react';
import { useGetAllSessionRequests } from '@/hooks/useQueries';
import { getCategoryLabel, getCategoryColor } from '@/lib/moodPresets';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function TherapistInboxPanel() {
  const { data: requests = [], isLoading, error } = useGetAllSessionRequests();

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
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <Inbox className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Therapist Inbox</h3>
        {!isLoading && (
          <Badge variant="secondary" className="ml-auto">
            {requests.length} {requests.length === 1 ? 'request' : 'requests'}
          </Badge>
        )}
      </div>

      <ScrollArea className="flex-1 h-[500px] pr-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-destructive text-sm">Failed to load session requests. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <Inbox className="w-12 h-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No session requests yet.</p>
            <p className="text-xs text-muted-foreground">
              Requests from users will appear here.
            </p>
          </div>
        )}

        {!isLoading && !error && requests.length > 0 && (
          <div className="space-y-3">
            {requests.map((request, index) => (
              <div
                key={`${request.timestamp}-${index}`}
                className="p-4 rounded-lg bg-secondary/50 border border-border/30 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn('font-medium', getCategoryColor(request.category))}
                    >
                      {getCategoryLabel(request.category)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatTimestamp(request.timestamp)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">User:</span>
                    <code className="text-xs bg-secondary px-2 py-0.5 rounded">
                      {formatPrincipal(request.caller.toString())}
                    </code>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="w-4 h-4" />
                      <span>Message:</span>
                    </div>
                    <p className="text-sm text-foreground pl-6 break-words whitespace-pre-wrap">
                      {request.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
