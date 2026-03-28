import type { InboxMessage } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { useMarkMessageAsRead } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { CheckCheck, Clock, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import InboxReplyForm from "./InboxReplyForm";

interface InboxMessageThreadProps {
  messages: InboxMessage[];
}

export default function InboxMessageThread({
  messages,
}: InboxMessageThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const markAsRead = useMarkMessageAsRead();

  if (messages.length === 0) return null;

  const threadId = messages[0].threadId;
  const sortedMessages = [...messages].sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp),
  );
  const latestMessage = sortedMessages[sortedMessages.length - 1];
  const hasUnread = messages.some((m) => m.status === "unread");

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 12) return principal;
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
  };

  const handleMarkAsRead = async (messageId: bigint) => {
    try {
      await markAsRead.mutateAsync(messageId);
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-secondary/30 border border-border/30 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-foreground">
            Thread #{threadId.toString()}
          </span>
          {hasUnread && (
            <Badge variant="destructive" className="text-xs">
              Unread
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </Badge>
      </div>

      <div className="space-y-3">
        {sortedMessages.map((message) => {
          const isSent =
            message.sender.toString() !== latestMessage.recipient.toString();

          return (
            <div
              key={message.id.toString()}
              className={cn(
                "p-3 rounded-lg space-y-2",
                isSent
                  ? "bg-accent/10 border border-accent/30 ml-8"
                  : "bg-secondary/50 border border-border/30 mr-8",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>
                    {isSent
                      ? "You"
                      : formatPrincipal(message.sender.toString())}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(message.timestamp)}
                  </div>
                  {message.status === "read" && (
                    <CheckCheck className="w-4 h-4 text-accent" />
                  )}
                </div>
              </div>

              <p className="text-sm text-foreground whitespace-pre-wrap">
                {message.content}
              </p>

              {message.status === "unread" && !isSent && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(message.id)}
                  disabled={markAsRead.isPending}
                  className="text-xs text-accent hover:underline disabled:opacity-50"
                >
                  Mark as read
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!showReplyForm && (
        <button
          type="button"
          onClick={() => setShowReplyForm(true)}
          className="w-full py-2 px-4 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/30 text-sm font-medium text-accent transition-colors"
        >
          Reply to thread
        </button>
      )}

      {showReplyForm && (
        <InboxReplyForm
          threadId={threadId}
          recipientPrincipal={latestMessage.sender.toString()}
          replyToMessageId={latestMessage.id}
          onCancel={() => setShowReplyForm(false)}
          onSuccess={() => setShowReplyForm(false)}
        />
      )}
    </div>
  );
}
