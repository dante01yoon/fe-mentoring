import type {
  BoardFilters,
  BoardResponse,
  BootstrapResponse,
  CreateCardRequest,
  CreateCardResponse,
  MoveCardRequest,
  MoveCardResponse,
} from '../model/types';

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const message = await safeMessage(res);
    throw new Error(message ?? `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

async function safeMessage(res: Response): Promise<string | undefined> {
  try {
    const data = (await res.clone().json()) as { message?: string };
    return data?.message;
  } catch {
    return undefined;
  }
}

function buildBoardQuery(filters: BoardFilters): string {
  const sp = new URLSearchParams();
  if (filters.query) sp.set('query', filters.query);
  if (filters.assigneeId) sp.set('assigneeId', filters.assigneeId);
  if (filters.labelId) sp.set('labelId', filters.labelId);
  if (filters.priority) sp.set('priority', filters.priority);
  if (filters.due) sp.set('due', filters.due);
  return sp.toString();
}

export const kanbanApi = {
  bootstrap(): Promise<BootstrapResponse> {
    return getJson<BootstrapResponse>('/api/kanban/bootstrap');
  },

  getBoard(filters: BoardFilters): Promise<BoardResponse> {
    const qs = buildBoardQuery(filters);
    return getJson<BoardResponse>(`/api/kanban/board${qs ? `?${qs}` : ''}`);
  },

  moveCard(request: MoveCardRequest): Promise<MoveCardResponse> {
    return getJson<MoveCardResponse>(
      `/api/kanban/cards/${encodeURIComponent(request.cardId)}/move`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      },
    );
  },

  createCard(request: CreateCardRequest): Promise<CreateCardResponse> {
    return getJson<CreateCardResponse>('/api/kanban/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  },
};
