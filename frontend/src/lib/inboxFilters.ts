import type { InboxMessage } from '@/backend';

export interface MessageThread {
  threadId: bigint;
  messages: InboxMessage[];
}

export function filterByClient(messages: InboxMessage[], clientPrincipal: string): InboxMessage[] {
  return messages.filter(msg => msg.sender.toString() === clientPrincipal);
}

export function filterByReadStatus(messages: InboxMessage[], isRead: boolean): InboxMessage[] {
  const targetStatus = isRead ? 'read' : 'unread';
  return messages.filter(msg => msg.status === targetStatus);
}

export function sortByDate(messages: InboxMessage[], newestFirst: boolean): InboxMessage[] {
  return [...messages].sort((a, b) => {
    const aTime = Number(a.timestamp);
    const bTime = Number(b.timestamp);
    return newestFirst ? bTime - aTime : aTime - bTime;
  });
}

export function groupByThread(messages: InboxMessage[]): MessageThread[] {
  const threadMap = new Map<string, InboxMessage[]>();

  messages.forEach(msg => {
    const threadKey = msg.threadId.toString();
    if (!threadMap.has(threadKey)) {
      threadMap.set(threadKey, []);
    }
    threadMap.get(threadKey)!.push(msg);
  });

  return Array.from(threadMap.entries()).map(([threadId, msgs]) => ({
    threadId: BigInt(threadId),
    messages: msgs,
  }));
}
