import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRequestSession } from "@/hooks/useQueries";
import { getCategoryLabel } from "@/lib/moodPresets";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MoodCategory } from "../../backend";

interface SessionRequestFormProps {
  category: MoodCategory;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SessionRequestForm({
  category,
  onSuccess,
  onCancel,
}: SessionRequestFormProps) {
  const [message, setMessage] = useState("");
  const requestSession = useRequestSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      await requestSession.mutateAsync({ category, message });
      toast.success("Session request submitted successfully");
      onSuccess();
    } catch (err) {
      console.error("Failed to submit session request:", err);
      toast.error("Failed to submit request. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label
          htmlFor="category"
          className="text-lg font-semibold popup-text-high-contrast"
        >
          Detected Category
        </Label>
        <div className="px-5 py-4 bg-secondary/50 border-2 border-border/50 rounded-lg text-lg popup-text-high-contrast font-medium shadow-sm">
          {getCategoryLabel(category)}
        </div>
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="message"
          className="text-lg font-semibold popup-text-high-contrast"
        >
          Tell us more about what you're experiencing
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share what's on your mind... This will help the therapist understand how to best support you."
          className="min-h-[160px] resize-none text-base p-4"
          disabled={requestSession.isPending}
        />
        <p className="text-base popup-text-high-contrast opacity-80 leading-relaxed">
          Your message will be reviewed by a licensed therapist who will reach
          out to you.
        </p>
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={requestSession.isPending}
          className="text-base py-5 px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!message.trim() || requestSession.isPending}
          className="gap-2 text-base py-5 px-6"
        >
          {requestSession.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Request
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
