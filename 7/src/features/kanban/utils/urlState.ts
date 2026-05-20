import { PRIORITY_VALUES } from '../model/constants';
import type { BoardFilters, Priority } from '../model/types';

function isPriority(value: string | null): value is Priority {
  return !!value && (PRIORITY_VALUES as readonly string[]).includes(value);
}

export function parseBoardFilters(searchParams: URLSearchParams): BoardFilters {
  const priority = searchParams.get('priority');
  const due = searchParams.get('due');

  return {
    query: searchParams.get('query') || undefined,
    assigneeId: searchParams.get('assigneeId') || undefined,
    labelId: searchParams.get('labelId') || undefined,
    priority: isPriority(priority) ? priority : undefined,
    due:
      due === 'overdue' || due === 'today' || due === 'week'
        ? due
        : undefined,
  };
}

export function serializeBoardFilters(filters: BoardFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.query) sp.set('query', filters.query);
  if (filters.assigneeId) sp.set('assigneeId', filters.assigneeId);
  if (filters.labelId) sp.set('labelId', filters.labelId);
  if (filters.priority) sp.set('priority', filters.priority);
  if (filters.due) sp.set('due', filters.due);
  return sp;
}

// TODO(student):
// filter 변경 시 cardId를 유지할지 제거할지 정책을 정합니다.
// 운영 도구에서는 "필터 변경 후 선택 카드가 결과에서 사라지는 상황"이 자주 발생합니다.
