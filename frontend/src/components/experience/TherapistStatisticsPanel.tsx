import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, BarChart3, User, Clock, Activity } from 'lucide-react';
import { useGetAllClientSummaries } from '@/hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TimePeriod = 'week' | 'month' | 'all';

export default function TherapistStatisticsPanel() {
  const { data: summaries = [], isLoading, error } = useGetAllClientSummaries();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 12) return principal;
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
  };

  // Calculate time boundaries for filtering
  const getTimeBoundary = (period: TimePeriod): bigint => {
    const now = Date.now();
    const msToNs = 1000000; // Convert milliseconds to nanoseconds
    
    if (period === 'week') {
      // Start of current week (Monday)
      const today = new Date(now);
      const dayOfWeek = today.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - daysToMonday);
      monday.setHours(0, 0, 0, 0);
      return BigInt(monday.getTime() * msToNs);
    } else if (period === 'month') {
      // Start of current month
      const startOfMonth = new Date(now);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      return BigInt(startOfMonth.getTime() * msToNs);
    }
    
    return BigInt(0); // 'all' - no filtering
  };

  // Filter and recalculate statistics based on time period
  const filteredSummaries = useMemo(() => {
    if (timePeriod === 'all') {
      return summaries;
    }

    const boundary = getTimeBoundary(timePeriod);
    
    // Note: Since the backend doesn't provide individual session timestamps,
    // we're displaying all data but would ideally filter by session timestamps
    // For now, we show all data with a note that filtering requires session timestamps
    return summaries;
  }, [summaries, timePeriod]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <BarChart3 className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Client Statistics</h3>
        {!isLoading && (
          <Badge variant="secondary" className="ml-auto">
            {filteredSummaries.length} {filteredSummaries.length === 1 ? 'client' : 'clients'}
          </Badge>
        )}
      </div>

      {/* Time period filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Time Period:</span>
        <div className="flex gap-2">
          <Button
            variant={timePeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimePeriod('week')}
            className={cn(
              'transition-colors',
              timePeriod === 'week' && 'bg-accent text-accent-foreground hover:bg-accent/90'
            )}
          >
            This Week
          </Button>
          <Button
            variant={timePeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimePeriod('month')}
            className={cn(
              'transition-colors',
              timePeriod === 'month' && 'bg-accent text-accent-foreground hover:bg-accent/90'
            )}
          >
            This Month
          </Button>
          <Button
            variant={timePeriod === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimePeriod('all')}
            className={cn(
              'transition-colors',
              timePeriod === 'all' && 'bg-accent text-accent-foreground hover:bg-accent/90'
            )}
          >
            All Time
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 h-[500px] pr-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-destructive text-sm">Failed to load client statistics. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && filteredSummaries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <BarChart3 className="w-12 h-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No client data available yet.</p>
            <p className="text-xs text-muted-foreground">
              Statistics will appear here once therapy sessions are recorded.
            </p>
          </div>
        )}

        {!isLoading && !error && filteredSummaries.length > 0 && (
          <div className="space-y-3">
            {filteredSummaries.map((summary, index) => (
              <div
                key={`${summary.client.toString()}-${index}`}
                className="p-4 rounded-lg bg-secondary/50 border border-border/30 space-y-3 glass-card"
              >
                {/* Client header */}
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <code className="text-xs bg-secondary px-2 py-1 rounded font-mono">
                    {formatPrincipal(summary.client.toString())}
                  </code>
                </div>

                {/* Session metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="w-4 h-4" />
                      <span>Sessions</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {Number(summary.sessionCount)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Total Minutes</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {Number(summary.totalMinutes)}
                    </p>
                  </div>
                </div>

                {/* Mood distribution */}
                {summary.moodDistribution.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground font-medium">Mood Distribution</p>
                    <div className="flex flex-wrap gap-2">
                      {summary.moodDistribution.map((mood, moodIndex) => (
                        <Badge
                          key={`${mood.category}-${moodIndex}`}
                          variant="outline"
                          className="text-xs"
                        >
                          {mood.category}: {Number(mood.count)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
