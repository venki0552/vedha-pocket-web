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
  getMessages: (conversationId: string) =>
    apiFetch<{ data: any[] }>(`/ask/${conversationId}/messages`),
  
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
};
