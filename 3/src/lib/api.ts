import type {
  ApiError,
  BootstrapResponse,
  CreateSavedViewRequest,
  FacetsResponse,
  ListSavedViewsResponse,
  ProductDetail,
  SavedView,
  SearchRequestParams,
  SearchResponse,
} from '../mocks/types';

/**
 * 얇은 fetch wrapper.
 *
 * 멘티 안내:
 *   - 이 클래스는 mock 서버와의 경계선입니다. 실제 백엔드가 생기면
 *     baseUrl만 바꾸거나, 인스턴스만 교체하면 됩니다.
 *   - signal을 받도록 설계되어 있으니 AbortController 기반 취소를 그대로 사용할 수 있습니다.
 *   - 서버 상태 라이브러리(예: TanStack Query)를 도입하면 queryFn 내부에서 이 메서드를 호출하면 됩니다.
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const body: ApiError = await response.json().catch(() => ({
        message: '알 수 없는 오류가 발생했습니다.',
      }));
      const error = new Error(body.message);
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }

    return response.json();
  }

  /** 카테고리 / 정렬 옵션 / 랭킹 버전 등 초기 설정값 */
  getBootstrap(signal?: AbortSignal) {
    return this.request<BootstrapResponse>('/api/search/bootstrap', { signal });
  }

  /**
   * 검색 결과를 가져옵니다.
   *
   * 멘티 안내:
   *   - signal을 사용해 이전 요청을 cancel하거나, queryKey 기반으로 React Query에 위임할 수 있습니다.
   */
  getSearch(params: SearchRequestParams, signal?: AbortSignal) {
    const query = serializeSearchParams(params);
    return this.request<SearchResponse>(
      `/api/products/search?${query.toString()}`,
      { signal },
    );
  }

  /** facet 정보 (카테고리/태그/가격 범위) */
  getFacets(params: SearchRequestParams, signal?: AbortSignal) {
    const query = serializeSearchParams(params);
    return this.request<FacetsResponse>(
      `/api/products/facets?${query.toString()}`,
      { signal },
    );
  }

  /** 상세 정보 */
  getProductDetail(id: string, q: string | undefined, signal?: AbortSignal) {
    const query = new URLSearchParams();
    if (q) query.set('q', q);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return this.request<ProductDetail>(
      `/api/products/${encodeURIComponent(id)}${suffix}`,
      { signal },
    );
  }

  /** Saved View 목록 */
  listSavedViews(signal?: AbortSignal) {
    return this.request<ListSavedViewsResponse>('/api/search/saved-views', {
      signal,
    });
  }

  /** Saved View 생성 */
  createSavedView(body: CreateSavedViewRequest, signal?: AbortSignal) {
    return this.request<SavedView>('/api/search/saved-views', {
      method: 'POST',
      body: JSON.stringify(body),
      signal,
    });
  }
}

export const api = new ApiClient();

// ─── Helpers ──────────────────────────────────────────────────────

/**
 * SearchRequestParams를 URLSearchParams로 직렬화합니다.
 *
 * 멘티 안내:
 *   - URL 동기화에 사용할 직렬화는 lib/searchParams.ts에서 별도로 다룹니다.
 *   - 여기 있는 직렬화는 “API 요청용”입니다. 두 직렬화의 일관성을 유지하면 디버깅이 편합니다.
 */
export function serializeSearchParams(
  params: SearchRequestParams,
): URLSearchParams {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  if (params.category) sp.set('category', params.category);
  if (params.minPrice !== undefined) sp.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) sp.set('maxPrice', String(params.maxPrice));
  if (params.inStock !== undefined) sp.set('inStock', String(params.inStock));
  if (params.tags && params.tags.length > 0)
    sp.set('tags', params.tags.join(','));
  sp.set('sort', params.sort);
  sp.set('page', String(params.page));
  sp.set('pageSize', String(params.pageSize));
  sp.set('version', params.version);
  return sp;
}
