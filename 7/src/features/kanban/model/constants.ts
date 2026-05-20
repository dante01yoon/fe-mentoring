import type { CardType, ColumnId, Priority } from './types';

export const COLUMN_IDS: ColumnId[] = [
  'backlog',
  'todo',
  'in_progress',
  'review',
  'done',
];

export const PRIORITY_VALUES: Priority[] = ['low', 'medium', 'high', 'urgent'];

export const CARD_TYPE_VALUES: CardType[] = [
  'feature',
  'bug',
  'chore',
  'research',
];

export const COLUMN_TITLES: Record<ColumnId, string> = {
  backlog: 'Backlog',
  todo: 'Todo',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};
