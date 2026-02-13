import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';
import { useRequestSession } from '@/hooks/useQueries';
import { MoodCategory } from '../../backend';
import { getCategoryLabel } from '@/lib/moodPresets';
import { toast } from 'sonner';

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
  const [message, setMessage] = useState('');
  const requestSession = useRequestSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await requestSession.mutateAsync({ category, message });
      toast.success('Session request submitted successfully');
      onSuccess();
    } catch (err) {
      console.error('Failed to submit session request:', err);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium popup-text-high-contrast">
          Detected Category
        </Label>
        <div className="px-3 py-2 bg-secondary/50 border border-border/50 rounded-md text-sm popup-text-high-contrast">
          {getCategoryLabel(category)}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium popup-text-high-contrast">
          Tell us more about what you're experiencing
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share what's on your mind... This will help the therapist understand how to best support you."
          className="min-h-[120px] resize-none"
          disabled={requestSession.isPending}
        />
        <p className="text-xs popup-text-high-contrast opacity-80">
          Your message will be reviewed by a licensed therapist who will reach out to you.
        </p>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={requestSession.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!message.trim() || requestSession.isPending}
          className="gap-2"
        >
          {requestSession.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Request
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
