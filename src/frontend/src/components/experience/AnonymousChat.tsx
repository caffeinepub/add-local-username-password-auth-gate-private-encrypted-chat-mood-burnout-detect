import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, MessageCircle, Bot, Lock } from 'lucide-react';
import { useGetRecentEncryptedMessages, usePostEncryptedMessage, useGetTemplatesForCategory } from '@/hooks/useQueries';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { encryptMessage, decryptMessage, bytesToEncryptedMessage, encryptedMessageToBytes } from '@/lib/crypto/e2ee';
import { classifyMoodAndBurnout } from '@/lib/classifier/moodBurnoutRules';
import { selectMoodTemplates } from '@/lib/moodInsight';
import { cn } from '@/lib/utils';
import TherapistPromptModal from './TherapistPromptModal';
import { MoodCategory } from '../../backend';

interface DisplayMessage {
  timestamp: bigint;
  author: string;
  text: string;
  isSystem?: boolean;
  isEncrypted?: boolean;
}

export default function AnonymousChat() {
  const [message, setMessage] = useState('');
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [showTherapistPrompt, setShowTherapistPrompt] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<MoodCategory>(MoodCategory.neutral);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: encryptedMessages = [], isLoading, error } = useGetRecentEncryptedMessages(50);
  const postEncryptedMessage = usePostEncryptedMessage();
  const { encryptionKey } = useLocalAuth();
  
  // Fetch templates for the detected category
  const { data: templates } = useGetTemplatesForCategory(detectedCategory);

  // Decrypt and process messages
  useEffect(() => {
    const processMessages = async () => {
      if (!encryptionKey) {
        setDisplayMessages([]);
        return;
      }

      const decrypted: DisplayMessage[] = [];
      
      for (const msg of encryptedMessages) {
        try {
          const encryptedPayload = bytesToEncryptedMessage(msg.encryptedText);
          if (!encryptedPayload) continue;
          
          const plaintext = await decryptMessage(encryptedPayload, encryptionKey);
          if (!plaintext) continue;
          
          decrypted.push({
            timestamp: msg.timestamp,
            author: msg.author ? 'You' : 'System',
            text: plaintext,
            isSystem: !msg.author,
            isEncrypted: true,
          });
        } catch (err) {
          console.error('Failed to decrypt message:', err);
        }
      }

      setDisplayMessages(decrypted);
    };

    processMessages();
  }, [encryptedMessages, encryptionKey]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages]);

  const handleSend = async () => {
    if (!message.trim() || !encryptionKey) return;

    try {
      // Classify mood before sending
      const classification = classifyMoodAndBurnout(message);
      setDetectedCategory(classification.category);

      // Encrypt and send user message
      const encryptedPayload = await encryptMessage(message, encryptionKey);
      const encryptedBytes = encryptedMessageToBytes(encryptedPayload);
      
      await postEncryptedMessage.mutateAsync(encryptedBytes);
      setMessage('');

      // Use templates from the hook (already fetched)
      const selectedTemplates = selectMoodTemplates(classification.category, templates || null);

      // Send system reassurance message
      const systemMessage = `💙 ${selectedTemplates.reassurance}`;
      const encryptedSystemPayload = await encryptMessage(systemMessage, encryptionKey);
      const encryptedSystemBytes = encryptedMessageToBytes(encryptedSystemPayload);
      
      await postEncryptedMessage.mutateAsync(encryptedSystemBytes);

      // Show therapist prompt if needed
      if (classification.shouldPromptTherapist) {
        setTimeout(() => {
          setShowTherapistPrompt(true);
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTherapistProceed = () => {
    setShowTherapistPrompt(false);
  };

  const handleTherapistDecline = () => {
    setShowTherapistPrompt(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 pb-3 border-b border-border/50">
        <MessageCircle className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Anonymous Chat</h3>
        <Lock className="w-4 h-4 text-muted-foreground ml-auto" />
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 py-4" ref={scrollRef}>
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-destructive text-sm">Failed to load messages. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && displayMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 px-4">
            <MessageCircle className="w-12 h-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
            <p className="text-xs text-muted-foreground/70">All messages are encrypted end-to-end</p>
          </div>
        )}

        {!isLoading && !error && displayMessages.length > 0 && (
          <div className="space-y-3 px-2">
            {displayMessages.map((msg, index) => (
              <div
                key={`${msg.timestamp}-${index}`}
                className={cn(
                  'flex gap-2',
                  msg.isSystem ? 'justify-start' : 'justify-end'
                )}
              >
                {msg.isSystem && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg px-3 py-2 space-y-1',
                    msg.isSystem
                      ? 'bg-secondary/50 border border-border/30'
                      : 'bg-accent text-accent-foreground'
                  )}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-xs opacity-70">{formatTimestamp(msg.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="pt-3 border-t border-border/50 space-y-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message... (Press Enter to send)"
          className="min-h-[80px] resize-none bg-secondary/30 border-border/50 focus:border-accent/50"
          disabled={postEncryptedMessage.isPending || !encryptionKey}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || postEncryptedMessage.isPending || !encryptionKey}
          className="w-full gap-2"
        >
          {postEncryptedMessage.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </Button>
      </div>

      {/* Therapist prompt modal */}
      <TherapistPromptModal
        open={showTherapistPrompt}
        onProceed={handleTherapistProceed}
        onDecline={handleTherapistDecline}
        detectedCategory={detectedCategory}
      />
    </div>
  );
}
