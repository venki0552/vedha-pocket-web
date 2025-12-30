import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    return {
      'Authorization': `Bearer ${session.access_token}`,
    };
  }
  
  return {};
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  let url = `${API_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  
  const authHeaders = await getAuthHeaders();
  
  // Only set Content-Type to application/json if there's a body
  const headers: Record<string, string> = {
    ...authHeaders,
    ...fetchOptions.headers as Record<string, string>,
  };
  
  if (fetchOptions.body) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

// API methods
export const api = {
  // Auth
  getMe: () => apiFetch<{ id: string; email: string }>('/auth/me'),
  
  // Orgs
  listOrgs: () => apiFetch<{ data: any[] }>('/orgs'),
  createOrg: (name: string) => apiFetch<{ data: any }>('/orgs', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),
  
  // Pockets
  listPockets: (orgId?: string) => apiFetch<{ data: any[] }>('/pockets', {
    params: orgId ? { org_id: orgId } : undefined,
  }),
  createPocket: (orgId: string, name: string) => apiFetch<{ data: any }>('/pockets', {
    method: 'POST',
    body: JSON.stringify({ org_id: orgId, name }),
  }),
  getPocket: (id: string) => apiFetch<{ data: any }>(`/pockets/${id}`),
  updatePocket: (id: string, data: { name?: string; description?: string }) =>
    apiFetch<{ data: any }>(`/pockets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deletePocket: (id: string) =>
    apiFetch<void>(`/pockets/${id}`, { method: 'DELETE' }),
  
  // Sources
  listSources: (pocketId: string) => apiFetch<{ data: any[] }>('/sources', {
    params: { pocket_id: pocketId },
  }),
  initUpload: (pocketId: string, filename: string, mimeType: string, sizeBytes: number) =>
    apiFetch<{ data: { source: any; uploadUrl: string; token: string } }>('/sources/upload/init', {
      method: 'POST',
      body: JSON.stringify({ pocket_id: pocketId, filename, mime_type: mimeType, size_bytes: sizeBytes }),
    }),
  completeUpload: (sourceId: string) =>
    apiFetch<{ data: any }>(`/sources/upload/${sourceId}/complete`, { method: 'POST' }),
  saveUrl: (pocketId: string, url: string, title?: string) =>
    apiFetch<{ data: any }>('/sources/url', {
      method: 'POST',
      body: JSON.stringify({ pocket_id: pocketId, url, title }),
    }),
  reprocessSource: (sourceId: string) =>
    apiFetch<{ data: any }>(`/sources/${sourceId}/reprocess`, { method: 'POST' }),
  getDownloadUrl: (sourceId: string) =>
    apiFetch<{ data: { url: string } }>(`/sources/${sourceId}/download`),
  deleteSource: (sourceId: string) =>
    apiFetch<void>(`/sources/${sourceId}`, { method: 'DELETE' }),
  uploadFile: async (pocketId: string, file: File) => {
    // Init upload to get signed URL
    const initResult = await apiFetch<{ data: { source: any; uploadUrl: string; token: string } }>('/sources/upload/init', {
      method: 'POST',
      body: JSON.stringify({ 
        pocket_id: pocketId, 
        filename: file.name, 
        mime_type: file.type, 
        size_bytes: file.size 
      }),
    });
    
    // Upload to Supabase Storage
    const uploadResponse = await fetch(initResult.data.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'Authorization': `Bearer ${initResult.data.token}`,
      },
      body: file,
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file');
    }
    
    // Complete upload to trigger processing
    return apiFetch<{ data: any }>(`/sources/upload/${initResult.data.source.id}/complete`, { method: 'POST' });
  },
  
  // Search & Ask
  search: (pocketId: string, query: string) =>
    apiFetch<{ data: any[] }>('/search', {
      method: 'POST',
      body: JSON.stringify({ pocket_id: pocketId, query }),
    }),
  ask: (pocketId: string, query: string, conversationId?: string) =>
    apiFetch<{ data: { answer: string; citations: any[]; conversation_id: string; message_id: string } }>('/ask', {
      method: 'POST',
      body: JSON.stringify({ pocket_id: pocketId, query, conversation_id: conversationId }),
    }),
  // Streaming ask endpoint - returns EventSource-like response
  askStream: async (
    pocketId: string, 
    query: string, 
    conversationId?: string,
    onEvent?: (event: { type: string; payload: any }) => void
  ): Promise<{ answer: string; citations: any[]; conversation_id: string; message_id?: string }> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(`${API_URL}/ask/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ pocket_id: pocketId, query, conversation_id: conversationId }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Failed to start streaming');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let result: any = {};

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';

      for (const part of parts) {
        if (!part.startsWith('data:')) continue;
        const data = part.replace('data:', '').trim();
        if (!data) continue;

        try {
          const event = JSON.parse(data);
          if (onEvent) onEvent(event);
          
          if (event.type === 'done') {
            result = event.payload;
          }
        } catch {
          continue;
        }
      }
    }

    return result;
  },
  getMessages: (conversationId: string) =>
    apiFetch<{ data: any[] }>(`/ask/${conversationId}/messages`),
  // Stats
  getStats: (pocketId: string) =>
    apiFetch<{ data: { documents: number; chunks: number } }>(`/stats/${pocketId}`),
  
  // Tasks
  listTasks: (params?: { pocket_id?: string; status?: string; overdue?: boolean }) =>
    apiFetch<{ data: any[] }>('/tasks', {
      params: params as Record<string, string>,
    }),
  createTask: (pocketId: string, data: { title: string; description?: string; priority?: string; due_at?: string }) =>
    apiFetch<{ data: any }>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ pocket_id: pocketId, ...data }),
    }),
  updateTask: (taskId: string, data: Record<string, any>) =>
    apiFetch<{ data: any }>(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTask: (taskId: string) =>
    apiFetch<void>(`/tasks/${taskId}`, { method: 'DELETE' }),
  retryTask: (taskId: string) =>
    apiFetch<{ data: any }>(`/tasks/${taskId}/retry`, { method: 'POST' }),
  
  // Analytics
  getAnalytics: (pocketId?: string, orgId?: string) =>
    apiFetch<{ data: any }>('/analytics', {
      params: pocketId ? { pocket_id: pocketId } : orgId ? { org_id: orgId } : undefined,
    }),
  
  // Settings
  getSettings: () => apiFetch<{ data: any }>('/settings'),
  updateSettings: (data: { org_id_default?: string; openrouter_api_key?: string }) =>
    apiFetch<{ data: any }>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  setOpenRouterKey: (apiKey: string) =>
    apiFetch<{ data: { success: boolean } }>('/settings/openrouter-key', {
      method: 'POST',
      body: JSON.stringify({ api_key: apiKey }),
    }),
  deleteOpenRouterKey: () =>
    apiFetch<{ data: { success: boolean } }>('/settings/openrouter-key', { method: 'DELETE' }),

  // Memories
  listMemories: (params: { org_id: string; status?: string; tag?: string; color?: string; is_archived?: boolean }) => {
    const queryParams: Record<string, string> = { org_id: params.org_id };
    if (params.status) queryParams.status = params.status;
    if (params.tag) queryParams.tag = params.tag;
    if (params.color) queryParams.color = params.color;
    if (params.is_archived !== undefined) queryParams.archived = String(params.is_archived);
    return apiFetch<{ data: any[] }>('/memories', { params: queryParams });
  },
  createMemory: (data: { org_id: string; title?: string; content: string; content_html?: string; color?: string; tags?: string[] }) =>
    apiFetch<{ data: any }>('/memories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMemory: (id: string) => apiFetch<{ data: any }>(`/memories/${id}`),
  updateMemory: (id: string, data: { title?: string; content?: string; content_html?: string; color?: string; tags?: string[]; is_pinned?: boolean; is_archived?: boolean }) =>
    apiFetch<{ data: any }>(`/memories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteMemory: (id: string) => apiFetch<void>(`/memories/${id}`, { method: 'DELETE' }),
  publishMemory: (id: string) => apiFetch<{ data: any }>(`/memories/${id}/publish`, { method: 'POST' }),
  unpublishMemory: (id: string) => apiFetch<{ data: any }>(`/memories/${id}/unpublish`, { method: 'POST' }),
  getMemoryTags: (orgId: string) => apiFetch<{ data: string[] }>('/memories/tags', { params: { org_id: orgId } }),
  getSharedWithMe: () => apiFetch<{ data: any[] }>('/memories/shared/with-me'),

  // Memory Shares
  shareMemory: (memoryId: string, email: string, permission: 'view' | 'comment') =>
    apiFetch<{ data: any }>('/memory-shares', {
      method: 'POST',
      body: JSON.stringify({ memory_id: memoryId, email, permission }),
    }),
  listMemoryShares: (memoryId: string) =>
    apiFetch<{ data: any[] }>('/memory-shares', { params: { memory_id: memoryId } }),
  removeMemoryShare: (shareId: string) =>
    apiFetch<void>(`/memory-shares/${shareId}`, { method: 'DELETE' }),

  // Memory Comments
  listMemoryComments: (memoryId: string) =>
    apiFetch<{ data: any[] }>('/memory-comments', { params: { memory_id: memoryId } }),
  addMemoryComment: (memoryId: string, content: string, positionStart?: number, positionEnd?: number, parentCommentId?: string) =>
    apiFetch<{ data: any }>('/memory-comments', {
      method: 'POST',
      body: JSON.stringify({ memory_id: memoryId, content, position_start: positionStart, position_end: positionEnd, parent_comment_id: parentCommentId }),
    }),
  deleteMemoryComment: (commentId: string) =>
    apiFetch<void>(`/memory-comments/${commentId}`, { method: 'DELETE' }),

  // General Chat (memories RAG)
  listGeneralConversations: (orgId: string) =>
    apiFetch<{ data: any[] }>('/general-chat/conversations', { params: { org_id: orgId } }),
  getGeneralConversation: (conversationId: string) =>
    apiFetch<{ data: any[] }>(`/general-chat/conversations/${conversationId}/messages`),
  deleteGeneralConversation: (conversationId: string) =>
    apiFetch<void>(`/general-chat/conversations/${conversationId}`, { method: 'DELETE' }),
  askGeneralChat: async (
    orgId: string,
    question: string,
    conversationId?: string,
    onEvent?: (event: { type: string; payload: any }) => void
  ): Promise<{ answer: string; citations: any[]; conversation_id: string }> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(`${API_URL}/general-chat/ask/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ org_id: orgId, question, conversation_id: conversationId }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Failed to start streaming');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let result: any = {};

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';

      for (const part of parts) {
        if (!part.startsWith('data:')) continue;
        const data = part.replace('data:', '').trim();
        if (!data) continue;

        try {
          const event = JSON.parse(data);
          if (onEvent) onEvent(event);

          if (event.type === 'done') {
            result = event.payload;
          }
        } catch {
          continue;
        }
      }
    }

    return result;
  },
};
