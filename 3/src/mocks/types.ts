// ─── Domain Types ────────────────────────────────────────────────

export type Category = 'electronics' | 'home' | 'fashion' | 'food';

export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'created_desc';

export type RankingVersion = 'v1' | 'v2';

export type PageSizeOption = 10 | 20 | 50;

// ─── Search Item / Detail ────────────────────────────────────────

export interface ProductSearchItem {
  id: string;
  title: string;
  category: Category;
  price: number;
  rating: number;
  inStock: boolean;
  tags: string[];
  rank: number;
  score: number;
  thumbnailUrl?: string;
}

export interface ProductDetail extends ProductSearchItem {
  description: string;
  matchedKeywords: string[];
  rankingReasons: string[];
  updatedAt: string;
}

// ─── Bootstrap ───────────────────────────────────────────────────

export interface CategoryOption {
  value: Category;
  label: string;
}

export interface SortOptionConfig {
  value: SortOption;
  label: string;
}

export interface BootstrapResponse {
  categories: CategoryOption[];
  sortOptions: SortOptionConfig[];
  rankingVersions: RankingVersion[];
  pageSizeOptions: PageSizeOption[];
}

// ─── Search ──────────────────────────────────────────────────────

export interface SearchRequestParams {
  q?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean | 'all';
  tags?: string[];
  sort: SortOption;
  page: number;
  pageSize: PageSizeOption;
  version: RankingVersion;
}

export interface SearchResponse {
  items: ProductSearchItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  queryId: string;
}

// ─── Facets ──────────────────────────────────────────────────────

export interface FacetCount {
  value: string;
  label: string;
  count: number;
}

export interface FacetsResponse {
  categories: FacetCount[];
  tags: FacetCount[];
  priceRange: {
    min: number;
    max: number;
  };
}

// ─── Saved View ──────────────────────────────────────────────────

/**
 * Saved View로 저장하는 검색 조건. `page`는 의도적으로 제외합니다.
 * Saved View는 “조건”을 저장하는 것이지 “n페이지”를 저장하는 기능이 아니기 때문입니다.
 */
export interface SavedViewState {
  q?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean | 'all';
  tags?: string[];
  sort: SortOption;
  pageSize: PageSizeOption;
  version: RankingVersion;
}

export interface SavedView {
  id: string;
  name: string;
  state: SavedViewState;
  createdAt: string;
}

export interface CreateSavedViewRequest {
  name: string;
  state: SavedViewState;
}

export interface ListSavedViewsResponse {
  items: SavedView[];
}

// ─── Shared ──────────────────────────────────────────────────────

export interface ApiError {
  message: string;
}

// ─── Scenario ────────────────────────────────────────────────────

export type ProductSearchScenario =
  | 'default'
  | 'slow'
  | 'empty'
  | 'search-error'
  | 'facets-error'
  | 'detail-error'
  | 'saved-view-error'
  | 'out-of-order'
  | 'large-dataset';
