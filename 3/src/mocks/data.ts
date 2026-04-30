import type {
  BootstrapResponse,
  Category,
  ProductDetail,
  ProductSearchItem,
} from './types';

export const bootstrapData: BootstrapResponse = {
  categories: [
    { value: 'electronics', label: '전자기기' },
    { value: 'home', label: '생활용품' },
    { value: 'fashion', label: '패션' },
    { value: 'food', label: '식품' },
  ],
  sortOptions: [
    { value: 'relevance', label: '관련도순' },
    { value: 'price_asc', label: '가격 낮은순' },
    { value: 'price_desc', label: '가격 높은순' },
    { value: 'rating_desc', label: '평점 높은순' },
    { value: 'created_desc', label: '최신순' },
  ],
  rankingVersions: ['v1', 'v2'],
  pageSizeOptions: [10, 20, 50],
};

const TAG_LABEL: Record<string, string> = {
  popular: '인기',
  discount: '할인중',
  new: '신규',
  'free-shipping': '무료배송',
  imported: '수입',
  premium: '프리미엄',
};

export const TAG_VALUES = Object.keys(TAG_LABEL);

export function tagLabel(tag: string): string {
  return TAG_LABEL[tag] ?? tag;
}

const CATEGORY_LABEL: Record<Category, string> = {
  electronics: '전자기기',
  home: '생활용품',
  fashion: '패션',
  food: '식품',
};

export function categoryLabel(category: Category): string {
  return CATEGORY_LABEL[category];
}

// ─── Catalog Generation ──────────────────────────────────────────

const TITLES_BY_CATEGORY: Record<Category, string[]> = {
  electronics: [
    'iPhone 15 Pro',
    'iPhone Case Premium',
    'iPad Air 11"',
    'MacBook Pro 14"',
    'AirPods Pro 2',
    'Galaxy S24 Ultra',
    'Sony WH-1000XM5',
    'LG OLED 55"',
    'Dell XPS 15',
    'Logitech MX Master 3S',
  ],
  home: [
    'Dyson V15 Detect',
    'Philips Hue Starter Kit',
    '캠핑용 의자 스탠다드',
    '북유럽 식기세트',
    '러그 200x300',
    '주방용 칼블럭 세트',
    '대형 빨래 바구니',
    '메모리폼 매트리스 토퍼',
    '사이드 테이블',
    '무드등 LED',
  ],
  fashion: [
    '캐시미어 니트 풀오버',
    '발마칸 코트',
    '클래식 트렌치코트',
    '데님 셔츠 슬림핏',
    '러닝화 라이트',
    '데일리 백팩',
    '레더 토트백',
    '오버사이즈 셔츠',
    '와이드 슬랙스',
    '체크 셔츠',
  ],
  food: [
    '제주 한라봉 5kg',
    '아메리카노 원두 1kg',
    '유기농 그래놀라',
    '훈제 연어 슬라이스',
    '프리미엄 한우 등심',
    '아보카도 6입',
    '제주 흑돼지 오겹살',
    '꿀 500g 국내산',
    '오트밀 그래놀라',
    '냉동 블루베리 1kg',
  ],
};

const RANDOM_TAGS: string[][] = [
  ['popular', 'discount'],
  ['popular'],
  ['discount', 'free-shipping'],
  ['new'],
  ['popular', 'free-shipping'],
  ['discount'],
  ['premium'],
  ['imported', 'free-shipping'],
  [],
  ['new', 'discount'],
];

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateProducts(): ProductSearchItem[] {
  const items: ProductSearchItem[] = [];
  let counter = 0;

  (Object.keys(TITLES_BY_CATEGORY) as Category[]).forEach((category) => {
    const titles = TITLES_BY_CATEGORY[category];
    titles.forEach((title, idx) => {
      counter++;
      const r1 = pseudoRandom(counter);
      const r2 = pseudoRandom(counter * 7);
      const r3 = pseudoRandom(counter * 13);

      const basePrice =
        category === 'electronics'
          ? 200_000 + Math.floor(r1 * 1_500_000)
          : category === 'home'
            ? 20_000 + Math.floor(r1 * 300_000)
            : category === 'fashion'
              ? 30_000 + Math.floor(r1 * 200_000)
              : 5_000 + Math.floor(r1 * 70_000);

      items.push({
        id: `p_${String(counter).padStart(3, '0')}`,
        title,
        category,
        price: basePrice,
        rating: Math.round((3 + r2 * 2) * 10) / 10,
        inStock: r3 > 0.15,
        tags: RANDOM_TAGS[(counter + idx) % RANDOM_TAGS.length],
        rank: counter,
        score: Math.round((0.5 + r1 * 0.5) * 1000) / 1000,
      });
    });
  });

  return items;
}

/**
 * 기본 카탈로그 — default 시나리오에서 사용됩니다.
 * 총 40건 정도. large-dataset 시나리오에서는 별도로 5,000건을 생성합니다.
 */
export const productCatalog: ProductSearchItem[] = generateProducts();

// ─── Large dataset (lazy) ────────────────────────────────────────

let largeCatalogCache: ProductSearchItem[] | null = null;

export function getLargeCatalog(): ProductSearchItem[] {
  if (largeCatalogCache) return largeCatalogCache;
  const items: ProductSearchItem[] = [];
  for (let i = 0; i < 5_000; i++) {
    const base = productCatalog[i % productCatalog.length];
    const r = pseudoRandom(i + 1);
    items.push({
      ...base,
      id: `p_large_${String(i + 1).padStart(5, '0')}`,
      title: `${base.title} #${i + 1}`,
      rank: i + 1,
      score: Math.round((0.3 + r * 0.7) * 1000) / 1000,
    });
  }
  largeCatalogCache = items;
  return items;
}

// ─── Detail enrichment ───────────────────────────────────────────

export function enrichDetail(
  item: ProductSearchItem,
  q: string | undefined,
): ProductDetail {
  const matchedKeywords = q
    ? Array.from(new Set(q.toLowerCase().split(/\s+/).filter(Boolean)))
    : [];

  return {
    ...item,
    description: `${item.title} — 데모용 상세 설명입니다. 카테고리: ${categoryLabel(item.category)}.`,
    matchedKeywords,
    rankingReasons: [
      '검색어와 제목이 정확히 매칭됨',
      '최근 클릭률이 높음',
      item.inStock ? '재고가 있음' : '재고가 없으나 유사 상품으로 노출됨',
    ],
    updatedAt: new Date('2026-04-30T10:00:00.000Z').toISOString(),
  };
}
