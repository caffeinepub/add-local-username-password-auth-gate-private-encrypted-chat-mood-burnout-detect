import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRespondToMessage } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

interface InboxReplyFormProps {
  threadId: bigint;
  recipientPrincipal: string;
  replyToMessageId: bigint;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function InboxReplyForm({
  threadId,
  recipientPrincipal,
  replyToMessageId,
  onCancel,
  onSuccess,
}: InboxReplyFormProps) {
  const [message, setMessage] = useState('');
  const respondToMessage = useRespondToMessage();

  const maxLength = 1000;
  const remainingChars = maxLength - message.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (message.length > maxLength) {
      toast.error(`Message exceeds ${maxLength} character limit`);
      return;
    }

    try {
      const recipient = Principal.fromText(recipientPrincipal);
      await respondToMessage.mutateAsync({
        target: recipient,
        text: message.trim(),
        threadId,
        replyTo: replyToMessageId,
      });

      toast.success('Reply sent successfully');
      setMessage('');
      onSuccess();
    } catch (error: any) {
      console.error('Failed to send reply:', error);
      toast.error(error.message || 'Failed to send reply');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Reply to client</label>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your reply here..."
        className="min-h-[120px] resize-none"
        disabled={respondToMessage.isPending}
      />

      <div className="flex items-center justify-between">
        <span className={`text-xs ${remainingChars < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
          {remainingChars} characters remaining
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={respondToMessage.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || message.length > maxLength || respondToMessage.isPending}
            className="gap-2"
          >
            {respondToMessage.isPending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Reply
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
