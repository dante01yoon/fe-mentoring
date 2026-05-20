export type ColumnId =
  | 'backlog'
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'done';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type CardType = 'feature' | 'bug' | 'chore' | 'research';

export type Member = {
  id: string;
  name: string;
  role: 'pm' | 'designer' | 'frontend' | 'backend' | 'qa';
  avatarUrl?: string;
};

export type BoardLabel = {
  id: string;
  name: string;
  color: string;
};

export type KanbanCard = {
  id: string;
  title: string;
  description: string;
  type: CardType;
  columnId: ColumnId;
  assigneeId?: string;
  labelIds: string[];
  priority: Priority;
  dueDate?: string;
  position: number;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type KanbanColumn = {
  id: ColumnId;
  title: string;
  description: string;
  wipLimit?: number;
};

export type Board = {
  id: string;
  name: string;
  description: string;
  columns: KanbanColumn[];
  revision: string;
  updatedAt: string;
};

export type BoardFilters = {
  query?: string;
  assigneeId?: string;
  labelId?: string;
  priority?: Priority;
  due?: 'overdue' | 'today' | 'week';
};

export type BootstrapResponse = {
  me: Member;
  members: Member[];
  labels: BoardLabel[];
  priorities: Priority[];
  cardTypes: CardType[];
};

export type BoardResponse = {
  board: Board;
  cards: KanbanCard[];
  members: Member[];
  labels: BoardLabel[];
  serverTime: string;
};

export type MoveCardRequest = {
  cardId: string;
  fromColumnId: ColumnId;
  toColumnId: ColumnId;
  beforeCardId?: string | null;
  afterCardId?: string | null;
  expectedVersion: number;
  clientMutationId: string;
};

export type MoveCardResponse = {
  card: KanbanCard;
  boardRevision: string;
};

export type CreateCardRequest = {
  title: string;
  description?: string;
  columnId: ColumnId;
  assigneeId?: string;
  labelIds?: string[];
  priority?: Priority;
  type?: CardType;
  dueDate?: string;
};

export type CreateCardResponse = {
  card: KanbanCard;
  boardRevision: string;
};

export type ApiErrorResponse = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};
