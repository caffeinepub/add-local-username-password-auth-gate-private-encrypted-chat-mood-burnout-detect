import { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ClientSessionSummaryView,
  DataEntry,
  EncryptedMessage,
  InboxMessage,
  Message,
  MoodCategory,
  Notification,
  SessionNote,
  SessionRequest,
} from "../backend";
import { useActor } from "./useActor";

// Chat hooks (authenticated)
export function useGetRecentMessages(limit = 50) {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ["messages", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentMessages(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Refresh every 5 seconds for near-real-time updates
  });
}

export function usePostMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("Backend actor not available");
      if (!text.trim()) throw new Error("Message cannot be empty");
      if (text.length > 280)
        throw new Error("Message exceeds 280 character limit");

      await actor.postMessage(text);
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

// Encrypted chat hooks (anonymous-safe)
export function useGetRecentEncryptedMessages(limit = 50) {
  const { actor, isFetching } = useActor();

  return useQuery<EncryptedMessage[]>({
    queryKey: ["encryptedMessages", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentEncryptedMessages(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

export function usePostEncryptedMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (encryptedPayload: Uint8Array) => {
      if (!actor) throw new Error("Backend actor not available");
      if (!encryptedPayload || encryptedPayload.length === 0) {
        throw new Error("Encrypted payload cannot be empty");
      }
      if (encryptedPayload.length > 1000) {
        throw new Error("Encrypted payload exceeds 1000 byte limit");
      }

      await actor.postEncryptedMessage(encryptedPayload);
    },
    onSuccess: () => {
      // Invalidate and refetch encrypted messages
      queryClient.invalidateQueries({ queryKey: ["encryptedMessages"] });
    },
  });
}

// Data entry hooks
export function useListEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<DataEntry[]>({
    queryKey: ["entries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      if (!actor) throw new Error("Backend actor not available");
      if (!key.trim() || !value.trim())
        throw new Error("Key and value cannot be empty");

      await actor.submitEntry(key, value);
    },
    onSuccess: () => {
      // Invalidate and refetch entries and unread count
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["unreadEntriesCount"] });
      queryClient.invalidateQueries({ queryKey: ["allEntries"] });
    },
  });
}

// Admin hooks for therapist inbox
export function useGetAllEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[any, DataEntry[]]>>({
    queryKey: ["allEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUnreadEntriesCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ["unreadEntriesCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getUnreadEntriesCount();
    },
    enabled: !!actor && !isFetching,
  });
}

// Mood analysis preset hooks
export function useGetTemplatesForCategory(category: MoodCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ["templates", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplatesForCategory(category);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 60, // Templates are stable, cache for 1 hour
  });
}

// Session request hooks
export function useRequestSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      category,
      message,
    }: { category: MoodCategory; message: string }) => {
      if (!actor) throw new Error("Backend actor not available");
      if (!message.trim()) throw new Error("Message cannot be empty");

      await actor.requestSession(category, message);
    },
    onSuccess: () => {
      // Invalidate session request queries
      queryClient.invalidateQueries({ queryKey: ["sessionRequests"] });
      queryClient.invalidateQueries({ queryKey: ["mySessionRequests"] });
    },
  });
}

export function useGetMySessionRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<SessionRequest[]>({
    queryKey: ["mySessionRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySessionRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSessionRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<SessionRequest[]>({
    queryKey: ["sessionRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSessionRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSessionRequestsByCategory(category: MoodCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<SessionRequest[]>({
    queryKey: ["sessionRequests", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSessionRequestsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

// Therapist statistics hooks
export function useGetAllClientSummaries() {
  const { actor, isFetching } = useActor();

  return useQuery<ClientSessionSummaryView[]>({
    queryKey: ["allClientSummaries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClientSummaries();
    },
    enabled: !!actor && !isFetching,
  });
}

// Inbox message hooks
export function useGetInboxMessages(userPrincipal: string) {
  const { actor, isFetching } = useActor();

  return useQuery<InboxMessage[]>({
    queryKey: ["inboxMessages", userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      const principal = Principal.fromText(userPrincipal);
      return actor.getInboxMessagesForUser(principal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

export function useMarkMessageAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error("Backend actor not available");
      await actor.markMessageAsRead(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inboxMessages"] });
    },
  });
}

export function useRespondToMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      target,
      text,
      threadId,
      replyTo,
    }: {
      target: Principal;
      text: string;
      threadId: bigint;
      replyTo: bigint;
    }) => {
      if (!actor) throw new Error("Backend actor not available");
      if (!text.trim()) throw new Error("Message cannot be empty");

      return actor.respondToMessage(target, text, threadId, replyTo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inboxMessages"] });
    },
  });
}

// Notification hooks
export function useGetNotifications(userPrincipal: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ["notifications", userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      const principal = Principal.fromText(userPrincipal);
      return actor.getNotificationsForUser(principal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
    refetchInterval: 15000, // Poll every 15 seconds
  });
}

export function useMarkNotificationAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: bigint) => {
      if (!actor) throw new Error("Backend actor not available");
      await actor.markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Session notes hooks
export function useGetAllSessionNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<SessionNote[]>({
    queryKey: ["allSessionNotes"],
    queryFn: async () => {
      if (!actor) return [];
      // Get all clients from summaries and fetch their notes
      const summaries = await actor.getAllClientSummaries();
      const allNotes: SessionNote[] = [];

      for (const summary of summaries) {
        const notes = await actor.getSessionNotesForClient(summary.client);
        allNotes.push(...notes);
      }

      return allNotes;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSessionNotesForClient(clientPrincipal: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SessionNote[]>({
    queryKey: ["sessionNotes", clientPrincipal],
    queryFn: async () => {
      if (!actor || !clientPrincipal) return [];
      const principal = Principal.fromText(clientPrincipal);
      return actor.getSessionNotesForClient(principal);
    },
    enabled: !!actor && !isFetching && !!clientPrincipal,
  });
}

// User role hooks
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
