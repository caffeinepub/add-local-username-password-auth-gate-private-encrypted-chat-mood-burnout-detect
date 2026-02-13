import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Database, Plus } from 'lucide-react';
import { useListEntries, useSubmitEntry, useGetTemplatesForCategory } from '@/hooks/useQueries';
import { classifyFromEntry } from '@/lib/classifier/moodBurnoutRules';
import { generateMoodInsight } from '@/lib/moodInsight';
import { selectMoodTemplates } from '@/lib/moodInsight';
import { getCategoryLabel } from '@/lib/moodPresets';
import MoodInsightCallout from './MoodInsightCallout';
import MoodPresetTemplatesCallout from './MoodPresetTemplatesCallout';
import { MoodCategory } from '../../backend';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DataEntryPanel() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [showInsight, setShowInsight] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<{
    category: any;
    categoryLabel: string;
    reassuranceMessage: string;
  } | null>(null);
  
  // Mood preset selector state
  const [selectedMoodPreset, setSelectedMoodPreset] = useState<MoodCategory | null>(null);

  const { data: entries = [], isLoading, error } = useListEntries();
  const submitEntry = useSubmitEntry();
  
  // Fetch templates for selected mood preset
  const { data: presetTemplates, isLoading: templatesLoading } = useGetTemplatesForCategory(selectedMoodPreset);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim() || !value.trim()) return;
    
    try {
      // Classify the entry
      const classification = classifyFromEntry(key, value);

      await submitEntry.mutateAsync({ key, value });
      setKey('');
      setValue('');

      // Generate and show insight
      const insight = generateMoodInsight(classification.category, null);
      setCurrentInsight(insight);
      setShowInsight(true);

      // Hide insight after 10 seconds
      setTimeout(() => {
        setShowInsight(false);
      }, 10000);
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

  // Generate preset templates display
  const presetTemplatesDisplay = selectedMoodPreset ? (
    templatesLoading ? (
      <div className="flex items-center justify-center p-4 popup-surface rounded-lg">
        <Loader2 className="w-5 h-5 animate-spin text-accent" />
      </div>
    ) : (
      (() => {
        const templates = selectMoodTemplates(selectedMoodPreset, presetTemplates ?? null);
        return (
          <MoodPresetTemplatesCallout
            category={selectedMoodPreset}
            categoryLabel={getCategoryLabel(selectedMoodPreset)}
            reassurance={templates.reassurance}
            insight={templates.insight}
          />
        );
      })()
    )
  ) : null;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <Database className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Data Entry</h3>
      </div>

      {/* Mood insight callout (after submission) */}
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
            placeholder="Describe your thoughts or rate your mood (1-10)"
            className="min-h-[80px] resize-none bg-secondary/30 border-border/50 focus:border-accent/50"
            disabled={submitEntry.isPending}
          />
        </div>

        {/* Mood Preset Selector */}
        <div className="space-y-2">
          <Label htmlFor="mood-preset" className="text-sm font-medium">
            Mood Preset (Optional)
          </Label>
          <Select
            value={selectedMoodPreset || ''}
            onValueChange={(value) => setSelectedMoodPreset(value as MoodCategory)}
          >
            <SelectTrigger id="mood-preset" className="bg-secondary/30 border-border/50">
              <SelectValue placeholder="Select a mood to see guidance..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MoodCategory.anxiety}>Anxiety</SelectItem>
              <SelectItem value={MoodCategory.depression}>Depression</SelectItem>
              <SelectItem value={MoodCategory.stress}>Stress</SelectItem>
              <SelectItem value={MoodCategory.neutral}>Neutral</SelectItem>
              <SelectItem value={MoodCategory.positive}>Positive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mood Preset Templates Display */}
        {presetTemplatesDisplay}

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
              Add Entry
            </>
          )}
        </Button>
      </form>

      {/* Entries list */}
      <div className="flex-1 space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Your Entries</h4>
        
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
              <p className="text-muted-foreground">No entries yet. Add your first entry above!</p>
            </div>
          )}

          {!isLoading && !error && entries.length > 0 && (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div
                  key={`${entry.timestamp}-${index}`}
                  className="p-3 rounded-lg bg-secondary/50 border border-border/30 space-y-1"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-accent">{entry.key}</span>
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
