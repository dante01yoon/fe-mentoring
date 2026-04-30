import type { SearchUrlState } from './searchParams';

/**
 * 서버 상태(검색/팩셋/상세)에 일관된 cache key를 부여하기 위한 헬퍼.
 *
 * 멘티 안내:
 *   - TanStack Query를 사용한다면 그대로 queryKey로 넘길 수 있습니다.
 *   - 직접 fetch + AbortController + state로 구현해도 OK. 그 경우엔
 *     “현재 어떤 key의 응답을 기다리는 중인가”를 ref로 들고 있다가
 *     latest token만 commit하면 stale response를 막을 수 있습니다.
 *   - itemId는 검색 key에 포함하지 마세요. 상세 fetch는 별도 key로 다룹니다.
 */
export const queryKeys = {
  bootstrap: () => ['search', 'bootstrap'] as const,

  search: (state: SearchUrlState) =>
    [
      'products',
      'search',
      {
        q: state.q,
        category: state.category,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        inStock: state.inStock,
        tags: state.tags,
        sort: state.sort,
        page: state.page,
        pageSize: state.pageSize,
        version: state.version,
      },
    ] as const,

  facets: (state: SearchUrlState) =>
    [
      'products',
      'facets',
      {
        q: state.q,
        category: state.category,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        inStock: state.inStock,
        tags: state.tags,
        version: state.version,
      },
    ] as const,

  productDetail: (id: string) =>
    ['products', 'detail', id] as const,

  savedViews: () => ['search', 'saved-views'] as const,
} as const;
