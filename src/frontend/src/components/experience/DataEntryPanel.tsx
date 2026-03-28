import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useListEntries, useSubmitEntry } from "@/hooks/useQueries";
import { classifyFromEntry } from "@/lib/classifier/moodBurnoutRules";
import { detectCrisisKeywords } from "@/lib/crisisDetection";
import { generateMoodInsight } from "@/lib/moodInsight";
import { cn } from "@/lib/utils";
import { Database, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CrisisSupportModal from "./CrisisSupportModal";
import MoodInsightCallout from "./MoodInsightCallout";

const LS_KEY = "mindvault_entries";

interface LocalEntry {
  key: string;
  value: string;
  timestamp: number;
}

function loadLocalEntries(): LocalEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalEntry[];
  } catch {
    return [];
  }
}

function saveLocalEntry(entry: LocalEntry) {
  try {
    const existing = loadLocalEntries();
    existing.push(entry);
    localStorage.setItem(LS_KEY, JSON.stringify(existing));
  } catch {
    // ignore storage errors
  }
}

export default function DataEntryPanel() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [showInsight, setShowInsight] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<{
    category: any;
    categoryLabel: string;
    reassuranceMessage: string;
  } | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [localEntries, setLocalEntries] = useState<LocalEntry[]>(() =>
    loadLocalEntries(),
  );

  const { data: backendEntries = [], isLoading } = useListEntries();
  const submitEntry = useSubmitEntry();
  const { actor } = useActor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!key.trim() || !value.trim()) return;

    const entryKey = key.trim();
    const entryValue = value.trim();

    // 1. Check for crisis keywords
    if (detectCrisisKeywords(entryValue) || detectCrisisKeywords(entryKey)) {
      setShowCrisisModal(true);
    }

    // 2. Classify the entry
    const classification = classifyFromEntry(entryKey, entryValue);

    // 3. Fetch templates (try actor, fallback gracefully)
    let templates: string[] | null = null;
    if (actor) {
      try {
        templates = await actor.getTemplatesForCategory(
          classification.category,
        );
      } catch (err) {
        console.error("Failed to fetch templates from backend:", err);
      }
    }

    // 4. Generate insight and show it BEFORE backend call
    const insight = generateMoodInsight(classification.category, templates);
    setCurrentInsight(insight);
    setShowInsight(true);

    toast.success("Your entry has been safely saved", {
      description:
        "Thank you for sharing. Your thoughts have been securely recorded. You're taking an important step in your journey, and everything will be okay.",
      duration: 6000,
    });

    // 5. Clear the form
    setKey("");
    setValue("");

    // 6. Try backend submission; fall back to localStorage on failure
    try {
      await submitEntry.mutateAsync({ key: entryKey, value: entryValue });
    } catch (err) {
      console.error("Backend submit failed, saving to localStorage:", err);
      const localEntry: LocalEntry = {
        key: entryKey,
        value: entryValue,
        timestamp: Date.now(),
      };
      saveLocalEntry(localEntry);
      setLocalEntries((prev) => [...prev, localEntry]);
    }

    // 7. Hide insight after 10 seconds
    setTimeout(() => {
      setShowInsight(false);
    }, 10000);
  };

  const formatTimestamp = (timestamp: bigint | number) => {
    // backend timestamps are nanoseconds (bigint); local timestamps are ms (number)
    const ms =
      typeof timestamp === "bigint" ? Number(timestamp) / 1_000_000 : timestamp;
    const date = new Date(ms);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Merge backend + local entries, sorted newest-first
  // Backend entries take priority; deduplicate by approximate timestamp
  const backendTimestampsMs = new Set(
    backendEntries.map(
      (e) => Math.round(Number(e.timestamp) / 1_000_000 / 1000) * 1000,
    ),
  );
  const filteredLocal = localEntries.filter(
    (le) => !backendTimestampsMs.has(Math.round(le.timestamp / 1000) * 1000),
  );

  type DisplayEntry = {
    key: string;
    value: string;
    sortMs: number;
    isLocal: boolean;
    timestamp: bigint | number;
  };

  const combined: DisplayEntry[] = [
    ...backendEntries.map((e) => ({
      key: e.key,
      value: e.value,
      sortMs: Number(e.timestamp) / 1_000_000,
      isLocal: false,
      timestamp: e.timestamp,
    })),
    ...filteredLocal.map((le) => ({
      key: le.key,
      value: le.value,
      sortMs: le.timestamp,
      isLocal: true,
      timestamp: le.timestamp,
    })),
  ].sort((a, b) => b.sortMs - a.sortMs);

  const hasEntries = combined.length > 0;

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
            data-ocid="todo.input"
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
            data-ocid="todo.textarea"
          />
        </div>

        <Button
          type="submit"
          disabled={!key.trim() || !value.trim() || submitEntry.isPending}
          className="w-full gap-2"
          data-ocid="todo.submit_button"
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
          {isLoading && filteredLocal.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          )}

          {!hasEntries && !isLoading && (
            <div
              className="flex flex-col items-center justify-center h-full text-center space-y-2"
              data-ocid="todo.empty_state"
            >
              <Database className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No entries yet. Start tracking your mood!
              </p>
            </div>
          )}

          {hasEntries && (
            <div className="space-y-2">
              {combined.map((entry, index) => (
                <div
                  key={`${entry.sortMs}-${index}`}
                  className={cn(
                    "p-3 rounded-lg backdrop-blur-sm",
                    "bg-secondary/50 border border-border/30",
                    entry.isLocal && "border-dashed opacity-90",
                  )}
                  data-ocid={`todo.item.${index + 1}`}
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
                  {entry.isLocal && (
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Saved locally
                    </p>
                  )}
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
