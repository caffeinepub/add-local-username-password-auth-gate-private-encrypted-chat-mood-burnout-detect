import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Database, Plus } from 'lucide-react';
import { useListEntries, useSubmitEntry } from '@/hooks/useQueries';
import { classifyFromEntry } from '@/lib/classifier/moodBurnoutRules';
import { generateMoodInsight } from '@/lib/moodInsight';
import { detectCrisisKeywords } from '@/lib/crisisDetection';
import MoodInsightCallout from './MoodInsightCallout';
import CrisisSupportModal from './CrisisSupportModal';
import { cn } from '@/lib/utils';
import { useActor } from '@/hooks/useActor';
import { toast } from 'sonner';

export default function DataEntryPanel() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [showInsight, setShowInsight] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<{
    category: any;
    categoryLabel: string;
    reassuranceMessage: string;
  } | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const { data: entries = [], isLoading, error } = useListEntries();
  const submitEntry = useSubmitEntry();
  const { actor } = useActor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim() || !value.trim()) return;
    
    try {
      // Check for crisis keywords in both key and value fields
      if (detectCrisisKeywords(value) || detectCrisisKeywords(key)) {
        setShowCrisisModal(true);
      }

      // Classify the entry
      const classification = classifyFromEntry(key, value);

      await submitEntry.mutateAsync({ key, value });
      
      // Clear form
      setKey('');
      setValue('');

      // Fetch templates from backend for the classified category
      let templates: string[] | null = null;
      
      if (actor) {
        try {
          templates = await actor.getTemplatesForCategory(classification.category);
        } catch (err) {
          console.error('Failed to fetch templates from backend:', err);
        }
      }

      // Generate and show insight with backend templates (or fallback)
      const insight = generateMoodInsight(classification.category, templates);
      setCurrentInsight(insight);
      setShowInsight(true);

      // Show reassuring toast notification
      toast.success('Your entry has been safely saved', {
        description: 'Thank you for sharing. Your thoughts have been securely recorded in your therapist\'s inbox. You\'re taking an important step in your journey, and everything will be okay.',
        duration: 6000,
      });

      // Hide insight after 10 seconds
      setTimeout(() => {
        setShowInsight(false);
      }, 10000);
    } catch (err: any) {
      console.error('Failed to submit entry:', err);
      toast.error('Failed to submit entry', {
        description: err?.message || 'Please try again. If the problem persists, contact support.',
        duration: 5000,
      });
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

      {/* Mood insight callout */}
      {showInsight && currentInsight && (
        <MoodInsightCallout
          category={currentInsight.category}
          categoryLabel={currentInsight.categoryLabel}
          reassuranceMessage={currentInsight.reassuranceMessage}
        />
      )}

      {/* Entry form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="key" className="text-sm font-medium">
            Key
          </Label>
          <Input
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g., mood, feeling, stress-level"
            className="bg-secondary/30 border-border/50 focus:border-accent/50"
            disabled={submitEntry.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value" className="text-sm font-medium">
            Value
          </Label>
          <Textarea
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe your current state..."
            className="min-h-[100px] resize-none bg-secondary/30 border-border/50 focus:border-accent/50"
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
      </form>

      {/* Entries list */}
      <div className="flex-1 space-y-2">
        <h4 className="text-sm font-medium text-foreground">Your Entries</h4>
        
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
              <p className="text-muted-foreground">No entries yet. Start tracking your mood!</p>
            </div>
          )}

          {!isLoading && !error && entries.length > 0 && (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div
                  key={`${entry.timestamp}-${index}`}
                  className={cn(
                    'p-3 rounded-lg backdrop-blur-sm',
                    'bg-secondary/50 border border-border/30'
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-accent">
                      {entry.key}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground break-words">
                    {entry.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <CrisisSupportModal
        isOpen={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
      />
    </div>
  );
}
