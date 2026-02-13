import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, MessageCircle, Bot, CheckCircle } from 'lucide-react';
import { useGetRecentMessages, usePostMessage } from '@/hooks/useQueries';
import { useEncryptionKey } from '@/hooks/useLocalAuth';
import { encryptMessage, decryptMessage, parseEncryptedMessage, serializeEncryptedMessage } from '@/lib/crypto/e2ee';
import { classifyMoodAndBurnout } from '@/lib/classifier/moodBurnoutRules';
import { cn } from '@/lib/utils';
import TherapistPromptModal from './TherapistPromptModal';

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
  const [therapistConnected, setTherapistConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: messages = [], isLoading, error } = useGetRecentMessages(50);
  const postMessage = usePostMessage();
  const encryptionKey = useEncryptionKey();

  // Decrypt and process messages
  useEffect(() => {
    const processMessages = async () => {
      if (!encryptionKey) {
        setDisplayMessages([]);
        return;
      }

      const processed: DisplayMessage[] = [];

      for (const msg of messages) {
        const encrypted = parseEncryptedMessage(msg.text);
        
        if (encrypted) {
          const decrypted = await decryptMessage(encrypted, encryptionKey);
          processed.push({
            timestamp: msg.timestamp,
            author: msg.author.toString(),
            text: decrypted || '[Message encrypted - unable to decrypt]',
            isEncrypted: !decrypted,
          });
        } else {
          // Legacy unencrypted message
          processed.push({
            timestamp: msg.timestamp,
            author: msg.author.toString(),
            text: msg.text,
          });
        }
      }

      setDisplayMessages(processed);
    };

    processMessages();
  }, [messages, encryptionKey]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !encryptionKey) return;
    
    try {
      // Classify mood and burnout before encrypting
      const classification = classifyMoodAndBurnout(message);

      // Encrypt the message
      const encrypted = await encryptMessage(message, encryptionKey);
      const encryptedText = serializeEncryptedMessage(encrypted);

      // Post encrypted message
      await postMessage.mutateAsync(encryptedText);
      setMessage('');

      // Add system response after a short delay
      setTimeout(async () => {
        const systemEncrypted = await encryptMessage(classification.supportiveResponse, encryptionKey);
        const systemEncryptedText = serializeEncryptedMessage(systemEncrypted);
        
        await postMessage.mutateAsync(systemEncryptedText);

        // Show therapist prompt if burnout risk is medium or high
        if (classification.burnoutRisk === 'medium' || classification.burnoutRisk === 'high') {
          setTimeout(() => {
            setShowTherapistPrompt(true);
          }, 1000);
        }
      }, 500);
    } catch (err) {
      console.error('Failed to post message:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTherapistProceed = () => {
    setShowTherapistPrompt(false);
    setTherapistConnected(true);
  };

  const handleTherapistDecline = () => {
    setShowTherapistPrompt(false);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <MessageCircle className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Anonymous Chat</h3>
        {therapistConnected && (
          <div className="ml-auto flex items-center gap-1 text-xs text-accent">
            <CheckCircle className="w-4 h-4" />
            <span>Therapist connection confirmed</span>
          </div>
        )}
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 h-[400px] pr-4" ref={scrollRef}>
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
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <MessageCircle className="w-12 h-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No messages yet. Be the first to share!</p>
            <p className="text-xs text-muted-foreground">Your messages are encrypted end-to-end</p>
          </div>
        )}

        {!isLoading && !error && displayMessages.length > 0 && (
          <div className="space-y-3">
            {displayMessages.map((msg, index) => {
              const isSystemMessage = msg.text.includes('hear that you') || 
                                     msg.text.includes('Thank you for sharing') ||
                                     msg.text.includes('wonderful to hear');
              
              return (
                <div
                  key={`${msg.timestamp}-${index}`}
                  className={cn(
                    'p-3 rounded-2xl backdrop-blur-sm',
                    isSystemMessage
                      ? 'bg-accent/10 border border-accent/30'
                      : 'bg-secondary/50 border border-border/30',
                    msg.isEncrypted && 'opacity-50'
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className={cn(
                      'text-xs font-medium flex items-center gap-1',
                      isSystemMessage ? 'text-accent' : 'text-accent'
                    )}>
                      {isSystemMessage && <Bot className="w-3 h-3" />}
                      {isSystemMessage ? 'MindVault Assistant' : msg.author.slice(0, 8) + '...'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground break-words whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          className="min-h-[80px] resize-none bg-secondary/30 border-border/50 focus:border-accent/50"
          maxLength={280}
          disabled={postMessage.isPending || !encryptionKey}
        />
        
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-xs',
            message.length > 250 ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {message.length}/280
          </span>
          
          <Button
            type="submit"
            disabled={!message.trim() || postMessage.isPending || !encryptionKey}
            className="gap-2"
          >
            {postMessage.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send
              </>
            )}
          </Button>
        </div>

        {postMessage.isError && (
          <p className="text-xs text-destructive">
            {postMessage.error instanceof Error ? postMessage.error.message : 'Failed to send message'}
          </p>
        )}
      </form>

      <TherapistPromptModal
        open={showTherapistPrompt}
        onProceed={handleTherapistProceed}
        onDecline={handleTherapistDecline}
      />
    </div>
  );
}
