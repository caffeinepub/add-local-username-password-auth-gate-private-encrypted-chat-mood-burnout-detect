import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Message, DataEntry } from '../backend';

// Chat hooks
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
