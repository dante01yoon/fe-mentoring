import { http, HttpResponse, delay } from 'msw';
import {
  bootstrapData,
  categoryLabel,
  enrichDetail,
  getLargeCatalog,
  productCatalog,
  TAG_VALUES,
  tagLabel,
} from './data';
import { getScenario } from './scenario';
import type {
  Category,
  CreateSavedViewRequest,
  FacetCount,
  FacetsResponse,
  ListSavedViewsResponse,
  ProductSearchItem,
  RankingVersion,
  SavedView,
  SearchResponse,
  SortOption,
} from './types';

// ─── 내부 상태 ────────────────────────────────────────────────────

/**
 * out-of-order 시나리오에서 응답 순서를 뒤섞기 위한 카운터.
 * 짝수 번째 요청은 길게 지연되어, 이후의 홀수 번째 요청보다 늦게 도착합니다.
 */
let searchRequestSeq = 0;

const savedViewStore: SavedView[] = [];
let savedViewSeq = 0;

// ─── Handlers ─────────────────────────────────────────────────────

export const handlers = [
  // ── GET /api/search/bootstrap ─────────────────────────────────
  http.get('/api/search/bootstrap', async () => {
    await delay(150);
    return HttpResponse.json(bootstrapData);
  }),

  // ── GET /api/products/search ──────────────────────────────────
  http.get('/api/products/search', async ({ request }) => {
    const scenario = getScenario();
    searchRequestSeq++;
    const seq = searchRequestSeq;

    if (scenario === 'slow') {
      await delay(2_000);
    } else if (scenario === 'out-of-order') {
      // 짝수 번째 요청을 길게 지연하여 홀수 번째 요청이 먼저 도착하도록 함
      await delay(seq % 2 === 0 ? 1_500 : 100);
    } else {
      await delay(200);
    }

    if (scenario === 'search-error') {
      return HttpResponse.json(
        { message: '검색 요청에 실패했습니다.' },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const params = parseSearchParams(url);
    const catalog =
      scenario === 'large-dataset' ? getLargeCatalog() : productCatalog;
    const filtered =
      scenario === 'empty' ? [] : applyFilters(catalog, params);
    const sorted = sortItems(filtered, params.sort);

    const totalCount = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / params.pageSize));
    const safePage = Math.min(Math.max(1, params.page), totalPages);
    const offset = (safePage - 1) * params.pageSize;
    const slice = sorted.slice(offset, offset + params.pageSize);

    const items: ProductSearchItem[] = slice.map((item, idx) => ({
      ...item,
      rank: offset + idx + 1,
    }));

    const response: SearchResponse = {
      items,
      page: safePage,
      pageSize: params.pageSize,
      totalCount,
      totalPages,
      queryId: `q_${seq.toString(36)}_${Date.now().toString(36)}`,
    };
    return HttpResponse.json(response);
  }),

  // ── GET /api/products/facets ──────────────────────────────────
  http.get('/api/products/facets', async ({ request }) => {
    const scenario = getScenario();
    await delay(scenario === 'slow' ? 2_000 : 150);

    if (scenario === 'facets-error') {
      return HttpResponse.json(
        { message: '필터 정보를 불러오지 못했습니다.' },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const params = parseSearchParams(url);
    // facets는 카테고리 자체를 필터링하지 않습니다 (선택 가능 후보를 보여주기 위함).
    const baseCatalog =
      scenario === 'large-dataset' ? getLargeCatalog() : productCatalog;
    const items = applyFilters(baseCatalog, { ...params, category: undefined });

    const categoryCounts = new Map<Category, number>();
    const tagCounts = new Map<string, number>();
    let min = Number.POSITIVE_INFINITY;
    let max = 0;

    for (const item of items) {
      categoryCounts.set(
        item.category,
        (categoryCounts.get(item.category) ?? 0) + 1,
      );
      for (const tag of item.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
      if (item.price < min) min = item.price;
      if (item.price > max) max = item.price;
    }

    const categories: FacetCount[] = (
      ['electronics', 'home', 'fashion', 'food'] as Category[]
    ).map((value) => ({
      value,
      label: categoryLabel(value),
      count: categoryCounts.get(value) ?? 0,
    }));

    const tags: FacetCount[] = TAG_VALUES.map((value) => ({
      value,
      label: tagLabel(value),
      count: tagCounts.get(value) ?? 0,
    }));

    const response: FacetsResponse = {
      categories,
      tags,
      priceRange: {
        min: Number.isFinite(min) ? min : 0,
        max: max || 0,
      },
    };
    return HttpResponse.json(response);
  }),

  // ── GET /api/products/:id ─────────────────────────────────────
  http.get('/api/products/:id', async ({ params, request }) => {
    const scenario = getScenario();
    await delay(scenario === 'slow' ? 1_500 : 200);

    if (scenario === 'detail-error') {
      return HttpResponse.json(
        { message: '상세 정보를 불러오지 못했습니다.' },
        { status: 500 },
      );
    }

    const id = params.id as string;
    const catalog =
      scenario === 'large-dataset' ? getLargeCatalog() : productCatalog;
    const item = catalog.find((p) => p.id === id);
    if (!item) {
      return HttpResponse.json(
        { message: '상품을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }
    const url = new URL(request.url);
    const q = url.searchParams.get('q') ?? undefined;
    return HttpResponse.json(enrichDetail(item, q));
  }),

  // ── GET /api/search/saved-views ───────────────────────────────
  http.get('/api/search/saved-views', async () => {
    const scenario = getScenario();
    await delay(150);
    if (scenario === 'saved-view-error') {
      return HttpResponse.json(
        { message: '저장된 뷰를 불러오지 못했습니다.' },
        { status: 500 },
      );
    }
    const response: ListSavedViewsResponse = { items: savedViewStore };
    return HttpResponse.json(response);
  }),

  // ── POST /api/search/saved-views ──────────────────────────────
  http.post('/api/search/saved-views', async ({ request }) => {
    const scenario = getScenario();
    await delay(200);

    if (scenario === 'saved-view-error') {
      return HttpResponse.json(
        { message: '저장에 실패했습니다. 다시 시도해주세요.' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as CreateSavedViewRequest;
    savedViewSeq++;
    const view: SavedView = {
      id: `view_${String(savedViewSeq).padStart(3, '0')}`,
      name: body.name,
      state: body.state,
      createdAt: new Date().toISOString(),
    };
    savedViewStore.push(view);
    return HttpResponse.json(view);
  }),
];

// ─── Helpers ──────────────────────────────────────────────────────

interface ParsedSearchParams {
  q?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean | 'all';
  tags?: string[];
  sort: SortOption;
  page: number;
  pageSize: 10 | 20 | 50;
  version: RankingVersion;
}

const SORT_VALUES: ReadonlySet<SortOption> = new Set<SortOption>([
  'relevance',
  'price_asc',
  'price_desc',
  'rating_desc',
  'created_desc',
]);

const VALID_PAGE_SIZES = new Set<number>([10, 20, 50]);

function parseSearchParams(url: URL): ParsedSearchParams {
  const sp = url.searchParams;
  const q = sp.get('q')?.trim() || undefined;
  const categoryRaw = sp.get('category');
  const category =
    categoryRaw &&
    ['electronics', 'home', 'fashion', 'food'].includes(categoryRaw)
      ? (categoryRaw as Category)
      : undefined;
  const minPrice = numberOrUndefined(sp.get('minPrice'));
  const maxPrice = numberOrUndefined(sp.get('maxPrice'));
  const inStockRaw = sp.get('inStock');
  const inStock =
    inStockRaw === 'true'
      ? true
      : inStockRaw === 'false'
        ? false
        : inStockRaw === 'all'
          ? 'all'
          : undefined;
  const tags =
    sp
      .get('tags')
      ?.split(',')
      .map((t) => t.trim())
      .filter(Boolean) ?? undefined;

  const sortRaw = sp.get('sort') as SortOption | null;
  const sort = sortRaw && SORT_VALUES.has(sortRaw) ? sortRaw : 'relevance';

  const pageNumber = Number(sp.get('page') ?? '1');
  const page = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const pageSizeNumber = Number(sp.get('pageSize') ?? '20');
  const pageSize = (
    VALID_PAGE_SIZES.has(pageSizeNumber) ? pageSizeNumber : 20
  ) as 10 | 20 | 50;

  const versionRaw = sp.get('version');
  const version: RankingVersion = versionRaw === 'v2' ? 'v2' : 'v1';

  return {
    q,
    category,
    minPrice,
    maxPrice,
    inStock,
    tags,
    sort,
    page,
    pageSize,
    version,
  };
}

function numberOrUndefined(v: string | null): number | undefined {
  if (v === null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function applyFilters(
  items: ProductSearchItem[],
  params: ParsedSearchParams,
): ProductSearchItem[] {
  return items.filter((item) => {
    if (params.q) {
      const q = params.q.toLowerCase();
      if (!item.title.toLowerCase().includes(q)) return false;
    }
    if (params.category && item.category !== params.category) return false;
    if (params.minPrice !== undefined && item.price < params.minPrice)
      return false;
    if (params.maxPrice !== undefined && item.price > params.maxPrice)
      return false;
    if (params.inStock === true && !item.inStock) return false;
    if (params.inStock === false && item.inStock) return false;
    if (params.tags && params.tags.length > 0) {
      const has = params.tags.every((tag) => item.tags.includes(tag));
      if (!has) return false;
    }
    return true;
  });
}

function sortItems(
  items: ProductSearchItem[],
  sort: SortOption,
): ProductSearchItem[] {
  const arr = [...items];
  switch (sort) {
    case 'price_asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'rating_desc':
      return arr.sort((a, b) => b.rating - a.rating);
    case 'created_desc':
      // 데모용: rank 역순을 “최신순”으로 가정합니다.
      return arr.sort((a, b) => b.rank - a.rank);
    case 'relevance':
    default:
      return arr.sort((a, b) => b.score - a.score);
  }
}
