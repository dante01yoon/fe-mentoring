import type {
  Category,
  PageSizeOption,
  RankingVersion,
  SortOption,
} from '../mocks/types';

/**
 * URL query string 으로 직렬화/역직렬화되는 “화면 상태” 모델.
 *
 * 멘티 안내:
 *   - 검색 조건은 모두 URL에 보관합니다. 여기 정의된 타입이 단일 진실 원천(SSOT)이 됩니다.
 *   - 입력값(타이핑 중인 검색어)와 검색에 실제 사용되는 값(q)을 분리하고 싶다면,
 *     컴포넌트 state로 분리하고 URL에는 q만 두세요. (스펙 7.1 방식 A)
 *   - itemId는 “Drawer open 상태”의 표현입니다. UI 상태가 아니라 URL 상태로 둡니다.
 */
export interface SearchUrlState {
  q: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean | 'all';
  tags: string[];
  sort: SortOption;
  page: number;
  pageSize: PageSizeOption;
  version: RankingVersion;
  itemId?: string;
}

// ─── Defaults ─────────────────────────────────────────────────────

/**
 * 잘못된 query string을 보정할 때 사용하는 기본값.
 * 스펙 11.3 “잘못된 URL 보정” 표를 따릅니다.
 */
export const DEFAULT_SEARCH_STATE: SearchUrlState = {
  q: '',
  category: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  inStock: undefined,
  tags: [],
  sort: 'relevance',
  page: 1,
  pageSize: 20,
  version: 'v1',
  itemId: undefined,
};

// ─── Whitelists ──────────────────────────────────────────────────

export const SORT_VALUES = [
  'relevance',
  'price_asc',
  'price_desc',
  'rating_desc',
  'created_desc',
] as const satisfies readonly SortOption[];

export const PAGE_SIZE_VALUES = [10, 20, 50] as const satisfies readonly PageSizeOption[];

export const RANKING_VERSIONS = ['v1', 'v2'] as const satisfies readonly RankingVersion[];

export const CATEGORY_VALUES = [
  'electronics',
  'home',
  'fashion',
  'food',
] as const satisfies readonly Category[];

// ─── Parser / Serializer (멘티 구현 영역) ────────────────────────

/**
 * URLSearchParams에서 SearchUrlState를 안전하게 복원합니다.
 *
 * 요구사항 (스펙 §7.2, §7.3, §7.4, §11.3):
 *   - 잘못된 값은 기본값으로 보정합니다.
 *     - sort, version, pageSize는 화이트리스트로 검증
 *     - page는 자연수, 음수/NaN은 1로
 *     - minPrice/maxPrice는 숫자, 그 외는 undefined
 *   - tags는 comma-separated string → string[]
 *   - inStock은 'true' | 'false' | 'all' | undefined
 *   - itemId는 undefined 또는 string
 *
 * 멘티 TODO:
 *   1. 각 파라미터를 위 규칙대로 파싱
 *   2. totalPages를 모르는 시점이므로 page 상한 보정은 여기서 하지 않습니다
 *      (검색 응답이 도착한 뒤 별도 effect에서 보정하세요)
 */
export function parseSearchParams(
  _searchParams: URLSearchParams,
): SearchUrlState {
  // TODO: 멘티가 구현
  // 임시로 기본값을 그대로 반환합니다. 모든 query 값을 위 가이드에 맞춰 안전하게 파싱하세요.
  return { ...DEFAULT_SEARCH_STATE };
}

/**
 * SearchUrlState를 URLSearchParams로 직렬화합니다.
 *
 * 요구사항:
 *   - 기본값과 동일한 값은 query에 포함하지 않아 URL을 깔끔하게 유지합니다.
 *     (예: page=1, pageSize=20, sort=relevance, version=v1는 생략 가능)
 *   - 빈 문자열/빈 배열/undefined는 모두 생략
 *   - tags는 join(',')
 *
 * 멘티 TODO:
 *   1. 위 규칙대로 직렬화
 *   2. 호출 측 useSearchParams setter에 그대로 넘길 수 있는 형태로 반환
 */
export function serializeSearchState(_state: SearchUrlState): URLSearchParams {
  // TODO: 멘티가 구현
  return new URLSearchParams();
}

// ─── Mutations (멘티 구현 영역) ──────────────────────────────────

/**
 * 검색 조건이 바뀔 때 page를 1로 리셋한 새 상태를 반환합니다.
 *
 * 사용 예:
 *   const next = mergeAndResetPage(prev, { q: 'iphone' });
 *
 * 멘티 안내:
 *   - 스펙 §7.1, §7.2, §7.3에서 “필터/정렬/검색어 변경 시 page=1로 초기화” 요구.
 *   - itemId는 영향받지 않습니다. (Drawer는 닫지 않음)
 */
export function mergeAndResetPage(
  _prev: SearchUrlState,
  _patch: Partial<SearchUrlState>,
): SearchUrlState {
  // TODO: 멘티가 구현
  return { ..._prev, ..._patch, page: 1 };
}

/**
 * 검색 응답으로 받은 totalPages 기준으로 현재 page를 보정합니다.
 *
 * 스펙 §7.4 시나리오:
 *   필터 변경 후 totalPages가 줄어들어 currentPage가 totalPages를 초과하는 경우.
 *
 * 멘티 안내:
 *   - 1) 마지막 유효 page로 보정 (Math.min(page, totalPages))
 *     2) 또는 1로 보정
 *   - 어느 쪽을 택했는지 README에 적으세요.
 */
export function clampPage(_page: number, _totalPages: number): number {
  // TODO: 멘티가 구현
  return _page;
}
