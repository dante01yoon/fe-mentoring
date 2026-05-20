import { delay, http, HttpResponse } from 'msw';
import { CARD_TYPE_VALUES, PRIORITY_VALUES } from '../features/kanban/model/constants';
import type {
  BoardFilters,
  BoardResponse,
  BootstrapResponse,
  CreateCardRequest,
  KanbanCard,
  MoveCardRequest,
} from '../features/kanban/model/types';
import { BASE_CARDS, BOARD, generateLargeCards } from './fixtures/board';
import { LABELS } from './fixtures/labels';
import { ME, MEMBERS } from './fixtures/members';
import { getScenario, type KanbanScenario } from './scenarios';

let activeScenario: KanbanScenario | null = null;
let cardStore: KanbanCard[] = [];
let revisionCounter = 1;

function cloneCards(cards: KanbanCard[]): KanbanCard[] {
  return cards.map((card) => ({ ...card, labelIds: [...card.labelIds] }));
}

function ensureStore(): KanbanCard[] {
  const scenario = getScenario();
  if (activeScenario !== scenario) {
    activeScenario = scenario;
    cardStore = cloneCards(scenario === 'large-board' ? generateLargeCards() : BASE_CARDS);
    revisionCounter = 1;
  }
  return cardStore;
}

function nextRevision(): string {
  revisionCounter += 1;
  return `rev_${String(revisionCounter).padStart(3, '0')}`;
}

async function delayForScenario() {
  if (getScenario() === 'slow') {
    await delay(1_500);
    return;
  }
  await delay(180);
}

function applyFilters(cards: KanbanCard[], filters: BoardFilters): KanbanCard[] {
  return cards.filter((card) => {
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesText =
        card.title.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query);
      if (!matchesText) return false;
    }
    if (filters.assigneeId && card.assigneeId !== filters.assigneeId) return false;
    if (filters.labelId && !card.labelIds.includes(filters.labelId)) return false;
    if (filters.priority && card.priority !== filters.priority) return false;
    return true;
  });
}

function parseFilters(url: URL): BoardFilters {
  const sp = url.searchParams;
  const priority = sp.get('priority');
  const due = sp.get('due');
  return {
    query: sp.get('query') || undefined,
    assigneeId: sp.get('assigneeId') || undefined,
    labelId: sp.get('labelId') || undefined,
    priority:
      priority === 'low' ||
      priority === 'medium' ||
      priority === 'high' ||
      priority === 'urgent'
        ? priority
        : undefined,
    due:
      due === 'overdue' ||
      due === 'today' ||
      due === 'week'
        ? due
        : undefined,
  };
}

export const handlers = [
  http.get('/api/kanban/bootstrap', async () => {
    await delayForScenario();
    const res: BootstrapResponse = {
      me: ME,
      members: MEMBERS,
      labels: LABELS,
      priorities: PRIORITY_VALUES,
      cardTypes: CARD_TYPE_VALUES,
    };
    return HttpResponse.json(res);
  }),

  http.get('/api/kanban/board', async ({ request }) => {
    await delayForScenario();

    const scenario = getScenario();
    if (scenario === 'board-error') {
      return HttpResponse.json(
        { message: '보드 데이터를 불러오지 못했습니다.', code: 'BOARD_UNAVAILABLE' },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const cards = scenario === 'empty' ? [] : ensureStore();
    const filteredCards = applyFilters(cards, parseFilters(url));
    const res: BoardResponse = {
      board: {
        ...BOARD,
        revision: `rev_${String(revisionCounter).padStart(3, '0')}`,
        updatedAt: new Date().toISOString(),
      },
      cards: cloneCards(filteredCards),
      members: MEMBERS,
      labels: LABELS,
      serverTime: new Date().toISOString(),
    };
    return HttpResponse.json(res);
  }),

  http.patch('/api/kanban/cards/:cardId/move', async ({ params, request }) => {
    await delayForScenario();

    const scenario = getScenario();
    if (scenario === 'move-failure') {
      return HttpResponse.json(
        { message: '카드 이동 저장에 실패했습니다.', code: 'MOVE_FAILED' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as MoveCardRequest;
    const cards = ensureStore();
    const cardIndex = cards.findIndex((card) => card.id === params.cardId);

    if (cardIndex < 0) {
      return HttpResponse.json(
        { message: '카드를 찾을 수 없습니다.', code: 'CARD_NOT_FOUND' },
        { status: 404 },
      );
    }

    const current = cards[cardIndex];
    if (scenario === 'stale-version' || current.version !== body.expectedVersion) {
      return HttpResponse.json(
        {
          message: '카드가 다른 사용자에 의해 먼저 변경되었습니다.',
          code: 'STALE_CARD_VERSION',
          details: { serverCard: current },
        },
        { status: 409 },
      );
    }

    const updated: KanbanCard = {
      ...current,
      columnId: body.toColumnId,
      position: Date.now(),
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
    };

    cards[cardIndex] = updated;

    return HttpResponse.json({
      card: updated,
      boardRevision: nextRevision(),
    });
  }),

  http.post('/api/kanban/cards', async ({ request }) => {
    await delayForScenario();

    const body = (await request.json()) as CreateCardRequest;
    const cards = ensureStore();
    const now = new Date().toISOString();
    const card: KanbanCard = {
      id: `card_${Date.now().toString(36)}`,
      title: body.title,
      description: body.description ?? '',
      type: body.type ?? 'feature',
      columnId: body.columnId,
      assigneeId: body.assigneeId,
      labelIds: body.labelIds ?? [],
      priority: body.priority ?? 'medium',
      dueDate: body.dueDate,
      position: Date.now(),
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    cards.push(card);

    return HttpResponse.json({
      card,
      boardRevision: nextRevision(),
    });
  }),
];
