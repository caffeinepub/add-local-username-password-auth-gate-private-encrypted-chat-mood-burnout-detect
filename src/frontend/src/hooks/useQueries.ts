import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Message, DataEntry, EncryptedMessage, MoodCategory, SessionRequest } from '../backend';

// Chat hooks (authenticated)
export function useGetRecentMessages(limit: number = 50) {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', limit],
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
      if (!actor) throw new Error('Backend actor not available');
      if (!text.trim()) throw new Error('Message cannot be empty');
      if (text.length > 280) throw new Error('Message exceeds 280 character limit');
      
      await actor.postMessage(text);
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

// Encrypted chat hooks (anonymous-safe)
export function useGetRecentEncryptedMessages(limit: number = 50) {
  const { actor, isFetching } = useActor();

  return useQuery<EncryptedMessage[]>({
    queryKey: ['encryptedMessages', limit],
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
      if (!actor) throw new Error('Backend actor not available');
      if (!encryptedPayload || encryptedPayload.length === 0) {
        throw new Error('Encrypted payload cannot be empty');
      }
      if (encryptedPayload.length > 1000) {
        throw new Error('Encrypted payload exceeds 1000 byte limit');
      }
      
      await actor.postEncryptedMessage(encryptedPayload);
    },
    onSuccess: () => {
      // Invalidate and refetch encrypted messages
      queryClient.invalidateQueries({ queryKey: ['encryptedMessages'] });
    },
  });
}

// Data entry hooks
export function useListEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<DataEntry[]>({
    queryKey: ['entries'],
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
      if (!actor) throw new Error('Backend actor not available');
      if (!key.trim() || !value.trim()) throw new Error('Key and value cannot be empty');
      
      await actor.submitEntry(key, value);
    },
    onSuccess: () => {
      // Invalidate and refetch entries
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
  });
}

// Mood analysis preset hooks
export function useGetTemplatesForCategory(category: MoodCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['templates', category],
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
    mutationFn: async ({ category, message }: { category: MoodCategory; message: string }) => {
      if (!actor) throw new Error('Backend actor not available');
      if (!message.trim()) throw new Error('Message cannot be empty');
      
      await actor.requestSession(category, message);
    },
    onSuccess: () => {
      // Invalidate session request queries
      queryClient.invalidateQueries({ queryKey: ['sessionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['mySessionRequests'] });
    },
  });
}

export function useGetMySessionRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<SessionRequest[]>({
    queryKey: ['mySessionRequests'],
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
    queryKey: ['sessionRequests'],
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
    queryKey: ['sessionRequests', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSessionRequestsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

// User role hooks
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['callerRole'],
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
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
