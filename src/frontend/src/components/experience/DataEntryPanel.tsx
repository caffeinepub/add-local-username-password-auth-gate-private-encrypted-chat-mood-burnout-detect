import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Database, Plus } from 'lucide-react';
import { useListEntries, useSubmitEntry } from '@/hooks/useQueries';
import { cn } from '@/lib/utils';

export default function DataEntryPanel() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const { data: entries = [], isLoading, error } = useListEntries();
  const submitEntry = useSubmitEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim() || !value.trim()) return;
    
    try {
      await submitEntry.mutateAsync({ key, value });
      setKey('');
      setValue('');
    } catch (err) {
      console.error('Failed to submit entry:', err);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <Database className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Data Entry</h3>
      </div>

      {/* Entry form */}
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-2xl bg-secondary/30 border border-border/30">
        <div className="space-y-2">
          <Label htmlFor="entry-key" className="text-sm font-medium text-foreground">
            Key
          </Label>
          <Input
            id="entry-key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter a key (e.g., mood, thought, goal)"
            className="bg-background/50 border-border/50 focus:border-accent/50"
            disabled={submitEntry.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="entry-value" className="text-sm font-medium text-foreground">
            Value
          </Label>
          <Textarea
            id="entry-value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your thoughts, feelings, or data..."
            className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-accent/50"
            disabled={submitEntry.isPending}
          />
        </div>

        <Button
          type="submit"
          disabled={!key.trim() || !value.trim() || submitEntry.isPending}
          className="w-full gap-2"
        >
          {submitEntry.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Submit Entry
            </>
          )}
        </Button>

        {submitEntry.isError && (
          <p className="text-xs text-destructive">
            {submitEntry.error instanceof Error ? submitEntry.error.message : 'Failed to submit entry'}
          </p>
        )}
      </form>

      {/* Entries list */}
      <div className="flex-1">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Your Entries</h4>
        
        <ScrollArea className="h-[300px] pr-4">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive text-sm">Failed to load entries. Please try again.</p>
            </div>
          )}

          {!isLoading && !error && entries.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <Database className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-muted-foreground text-sm">No entries yet. Submit your first entry above!</p>
            </div>
          )}

          {!isLoading && !error && entries.length > 0 && (
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <div
                  key={`${entry.timestamp}-${index}`}
                  className={cn(
                    'p-4 rounded-2xl backdrop-blur-sm',
                    'bg-secondary/50 border border-border/30',
                    'transition-all duration-200 hover:bg-secondary/70'
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-accent">
                      {entry.key}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground break-words whitespace-pre-wrap">
                    {entry.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
