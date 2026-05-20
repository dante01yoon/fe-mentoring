export const KANBAN_SCENARIOS = [
  'default',
  'slow',
  'empty',
  'board-error',
  'move-failure',
  'stale-version',
  'large-board',
] as const;

export type KanbanScenario = (typeof KANBAN_SCENARIOS)[number];

export function getScenario(): KanbanScenario {
  const raw = import.meta.env.VITE_KANBAN_SCENARIO;
  if ((KANBAN_SCENARIOS as readonly string[]).includes(raw)) {
    return raw as KanbanScenario;
  }
  return 'default';
}
