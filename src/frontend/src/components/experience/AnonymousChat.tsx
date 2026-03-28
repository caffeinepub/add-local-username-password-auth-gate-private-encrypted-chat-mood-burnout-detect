import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import {
  useGetRecentEncryptedMessages,
  useGetTemplatesForCategory,
  usePostEncryptedMessage,
} from "@/hooks/useQueries";
import { classifyMoodAndBurnout } from "@/lib/classifier/moodBurnoutRules";
import { detectCrisisKeywords } from "@/lib/crisisDetection";
import {
  bytesToEncryptedMessage,
  decryptMessage,
  encryptMessage,
  encryptedMessageToBytes,
} from "@/lib/crypto/e2ee";
import { generateMoodInsight } from "@/lib/moodInsight";
import { cn } from "@/lib/utils";
import { Bot, Loader2, Lock, MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MoodCategory } from "../../backend";
import CrisisSupportModal from "./CrisisSupportModal";
import TherapistPromptModal from "./TherapistPromptModal";

interface DisplayMessage {
  timestamp: bigint;
  author: string;
  text: string;
  isSystem?: boolean;
  isEncrypted?: boolean;
}

export default function AnonymousChat() {
  const [message, setMessage] = useState("");
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [showTherapistPrompt, setShowTherapistPrompt] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<MoodCategory>(
    MoodCategory.neutral,
  );
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data: encryptedMessages = [],
    isLoading,
    error,
  } = useGetRecentEncryptedMessages(50);
  const postEncryptedMessage = usePostEncryptedMessage();
  const { encryptionKey } = useLocalAuth();
  const { actor } = useActor();

  // Decrypt and process messages
  useEffect(() => {
    const processMessages = async () => {
      if (!encryptionKey) {
        setDisplayMessages([]);
        return;
      }

      const processed: DisplayMessage[] = [];

      for (const msg of encryptedMessages) {
        const encrypted = bytesToEncryptedMessage(msg.encryptedText);

        if (encrypted) {
          const decrypted = await decryptMessage(encrypted, encryptionKey);
          processed.push({
            timestamp: msg.timestamp,
            author: msg.author?.toString() || "anonymous",
            text: decrypted || "[Message encrypted - unable to decrypt]",
            isEncrypted: !decrypted,
          });
        } else {
          processed.push({
            timestamp: msg.timestamp,
            author: msg.author?.toString() || "anonymous",
            text: "[Message encrypted - unable to decrypt]",
            isEncrypted: true,
          });
        }
      }

      setDisplayMessages(processed);
    };

    processMessages();
  }, [encryptedMessages, encryptionKey]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !encryptionKey) return;

    try {
      // Check for crisis keywords before anything else
      if (detectCrisisKeywords(message)) {
        setShowCrisisModal(true);
      }

      // Classify mood and burnout before encrypting
      const classification = classifyMoodAndBurnout(message);
      setDetectedCategory(classification.category);

      // Encrypt the message
      const encrypted = await encryptMessage(message, encryptionKey);
      const encryptedBytes = encryptedMessageToBytes(encrypted);

      // Post encrypted message
      await postEncryptedMessage.mutateAsync(encryptedBytes);
      setMessage("");

      // Fetch templates for the detected category and generate insight
      setTimeout(async () => {
        try {
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

          const insight = generateMoodInsight(
            classification.category,
            templates,
          );
          const systemMessage = `**${insight.categoryLabel}**\n\n${insight.reassuranceMessage}`;

          const systemEncrypted = await encryptMessage(
            systemMessage,
            encryptionKey,
          );
          const systemEncryptedBytes = encryptedMessageToBytes(systemEncrypted);

          await postEncryptedMessage.mutateAsync(systemEncryptedBytes);

          // Show therapist prompt if needed
          if (classification.shouldPromptTherapist) {
            setTimeout(() => {
              setShowTherapistPrompt(true);
            }, 1000);
          }
        } catch (err) {
          console.error("Failed to generate insight:", err);
        }
      }, 500);
    } catch (err) {
      console.error("Failed to post message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleTherapistProceed = () => {
    setShowTherapistPrompt(false);
  };

  const handleTherapistDecline = () => {
    setShowTherapistPrompt(false);
  };

  // Show locked state if no encryption key
  if (!encryptionKey) {
    return (
      <div className="flex flex-col h-full items-center justify-center space-y-4 text-center p-6">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-accent" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Encryption Key Required
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Please sign in to generate a session encryption key. Your messages
            will be encrypted end-to-end.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <MessageCircle className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">
          Anonymous Chat
        </h3>
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
            <p className="text-destructive text-sm">
              Failed to load messages. Please try again.
            </p>
          </div>
        )}

        {!isLoading && !error && displayMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <MessageCircle className="w-12 h-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              No messages yet. Be the first to share!
            </p>
            <p className="text-xs text-muted-foreground">
              Your messages are encrypted end-to-end
            </p>
          </div>
        )}

        {!isLoading && !error && displayMessages.length > 0 && (
          <div className="space-y-3">
            {displayMessages.map((msg, index) => {
              const isSystemMessage =
                msg.text.includes("**") ||
                msg.text.includes("hear that you") ||
                msg.text.includes("Thank you for sharing") ||
                msg.text.includes("wonderful to hear");

              return (
                <div
                  key={`${msg.timestamp}-${index}`}
                  className={cn(
                    "p-3 rounded-2xl backdrop-blur-sm",
                    isSystemMessage
                      ? "bg-accent/10 border border-accent/30"
                      : "bg-secondary/50 border border-border/30",
                    msg.isEncrypted && "opacity-50",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span
                      className={cn(
                        "text-xs font-medium flex items-center gap-1",
                        isSystemMessage ? "text-accent" : "text-accent",
                      )}
                    >
                      {isSystemMessage && <Bot className="w-3 h-3" />}
                      {isSystemMessage
                        ? "MindVault Assistant"
                        : `${msg.author.slice(0, 8)}...`}
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
          disabled={postEncryptedMessage.isPending || !encryptionKey}
        />

        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-xs",
              message.length > 250
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {message.length}/280
          </span>

          <Button
            type="submit"
            disabled={
              !message.trim() ||
              postEncryptedMessage.isPending ||
              !encryptionKey
            }
            className="gap-2"
          >
            {postEncryptedMessage.isPending ? (
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
      </form>

      <TherapistPromptModal
        open={showTherapistPrompt}
        onProceed={handleTherapistProceed}
        onDecline={handleTherapistDecline}
        detectedCategory={detectedCategory}
      />

      <CrisisSupportModal
        isOpen={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
      />
    </div>
  );
}
