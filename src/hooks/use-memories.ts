"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Memory {
	id: string;
	org_id: string;
	user_id: string;
	title: string | null;
	content: string;
	content_html: string;
	color: string;
	tags: string[];
	status: "draft" | "published";
	is_pinned: boolean;
	is_archived: boolean;
	created_at: string;
	updated_at: string;
	published_at: string | null;
}

// Query keys for caching
export const memoryKeys = {
	all: ["memories"] as const,
	lists: () => [...memoryKeys.all, "list"] as const,
	list: (orgId: string, filters?: { status?: string; archived?: boolean; tag?: string }) =>
		[...memoryKeys.lists(), orgId, filters] as const,
	details: () => [...memoryKeys.all, "detail"] as const,
	detail: (id: string) => [...memoryKeys.details(), id] as const,
	tags: (orgId: string) => [...memoryKeys.all, "tags", orgId] as const,
};

// Fetch memories with optional filters
export function useMemories(
	orgId: string,
	options?: {
		status?: string;
		archived?: boolean;
		tag?: string;
		color?: string;
		enabled?: boolean;
	}
) {
	return useQuery({
		queryKey: memoryKeys.list(orgId, {
			status: options?.status,
			archived: options?.archived,
			tag: options?.tag,
		}),
		queryFn: async () => {
			const response = await api.listMemories({
				org_id: orgId,
				status: options?.status,
				is_archived: options?.archived,
				tag: options?.tag,
				color: options?.color,
			});
			return response.data as Memory[];
		},
		enabled: options?.enabled !== false && !!orgId,
		staleTime: 30 * 1000, // 30 seconds
		gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
	});
}

// Fetch single memory
export function useMemory(id: string, enabled = true) {
	return useQuery({
		queryKey: memoryKeys.detail(id),
		queryFn: async () => {
			const response = await api.getMemory(id);
			return response.data as Memory;
		},
		enabled: enabled && !!id,
		staleTime: 30 * 1000,
	});
}

// Fetch user's tags
export function useMemoryTags(orgId: string) {
	return useQuery({
		queryKey: memoryKeys.tags(orgId),
		queryFn: async () => {
			const response = await api.getMemoryTags(orgId);
			return response.data as string[];
		},
		enabled: !!orgId,
		staleTime: 60 * 1000, // 1 minute
	});
}

// Create memory mutation
export function useCreateMemory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			org_id: string;
			title?: string;
			content: string;
			content_html?: string;
			color?: string;
			tags?: string[];
		}) => {
			const response = await api.createMemory(data);
			return response.data as Memory;
		},
		onSuccess: (data) => {
			// Invalidate all memory lists for this org
			queryClient.invalidateQueries({
				queryKey: memoryKeys.lists(),
			});
			// Invalidate tags
			queryClient.invalidateQueries({
				queryKey: memoryKeys.tags(data.org_id),
			});
		},
	});
}

// Update memory mutation
export function useUpdateMemory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			...data
		}: {
			id: string;
			title?: string;
			content?: string;
			content_html?: string;
			color?: string;
			tags?: string[];
			is_pinned?: boolean;
			is_archived?: boolean;
		}) => {
			const response = await api.updateMemory(id, data);
			return response.data as Memory;
		},
		onSuccess: (data) => {
			// Update the specific memory in cache
			queryClient.setQueryData(memoryKeys.detail(data.id), data);
			// Invalidate lists
			queryClient.invalidateQueries({
				queryKey: memoryKeys.lists(),
			});
			// Invalidate tags if tags changed
			queryClient.invalidateQueries({
				queryKey: memoryKeys.tags(data.org_id),
			});
		},
	});
}

// Delete memory mutation
export function useDeleteMemory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await api.deleteMemory(id);
			return id;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: memoryKeys.lists(),
			});
		},
	});
}

// Publish memory mutation
export function usePublishMemory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await api.publishMemory(id);
			return response.data as Memory;
		},
		onSuccess: (data) => {
			queryClient.setQueryData(memoryKeys.detail(data.id), data);
			queryClient.invalidateQueries({
				queryKey: memoryKeys.lists(),
			});
		},
	});
}

// Unpublish memory mutation
export function useUnpublishMemory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await api.unpublishMemory(id);
			return response.data as Memory;
		},
		onSuccess: (data) => {
			queryClient.setQueryData(memoryKeys.detail(data.id), data);
			queryClient.invalidateQueries({
				queryKey: memoryKeys.lists(),
			});
		},
	});
}
