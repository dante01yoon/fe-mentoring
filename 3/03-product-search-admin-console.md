# 3회차 과제 명세서 — Product Search Admin Console

> 핵심은 “검색 알고리즘 구현”이 아니라, **검색/필터/정렬/페이지네이션이 있는 데이터 탐색형 관리자 콘솔을 안정적으로 구현하는 능력**을 확인하는 것입니다.

---

## 0. 과제 한 줄 요약

상품 카탈로그를 검색하고, 필터링하고, 정렬하고, 상세 정보를 확인할 수 있는 **관리자용 검색 콘솔**을 구현하세요.

이 과제는 실제 백엔드 없이 진행합니다.  
제공된 mock API 계약을 기반으로 MSW 또는 유사한 mock layer를 구성해, 실제 서버가 있는 것처럼 프론트엔드 앱을 구현하면 됩니다.

---

## 1. 과제 목적

이번 과제는 단순히 검색창과 테이블을 만드는 과제가 아닙니다.

실무에서 자주 등장하는 검색/목록/상세 화면을 구현하면서, 프론트엔드 개발자가 다음 문제를 어떻게 다루는지 확인하기 위한 과제입니다.

- 검색 조건을 URL query string과 동기화할 수 있는가
- 새로고침/뒤로가기/공유 링크에서도 같은 화면을 복구할 수 있는가
- 빠르게 바뀌는 검색 요청에서 오래된 응답이 최신 화면을 덮어쓰지 않게 할 수 있는가
- 검색 결과, 필터 정보, 상세 조회 중 일부만 실패했을 때 화면 전체를 망가뜨리지 않을 수 있는가
- 목록과 상세 Drawer의 상태를 일관되게 유지할 수 있는가
- 서버 상태와 클라이언트 상태를 구분해서 설계할 수 있는가
- 요구사항을 적절히 자르고, 시간 안에 제출 가능한 범위를 관리할 수 있는가

---

## 2. 이 과제에서 검증하려는 역량

| 검증 항목 | 구체적으로 보는 것 |
|---|---|
| URL 상태 설계 | 검색어, 필터, 정렬, 페이지, 상세 Drawer 상태를 URL과 동기화하는 방식 |
| 서버 상태 관리 | 검색 결과, facet, 상세 데이터, saved view를 fetch/cache/refetch 하는 방식 |
| 비동기 정합성 | 빠른 검색어 변경, 이전 요청 지연, stale response 방지 |
| 부분 실패 처리 | 검색 결과는 성공했지만 facet만 실패하는 등 실패 범위 분리 |
| 목록 UI 기본기 | loading/empty/error/success, pagination, item selection, detail drawer |
| 실무형 UX | 새로고침 복구, 뒤로가기/앞으로가기, 공유 가능한 링크, 사용자 설정 저장 |
| 문서화 | 왜 이 구조를 선택했는지 설명할 수 있는가 |
| 테스트 선택 | happy path가 아니라 위험한 흐름을 테스트하는가 |

---

## 3. 무엇을 만들어야 하나요?

### 3.1 최종 결과물

아래 기능을 가진 **상품 검색 관리자 콘솔**을 만듭니다.

관리자는 다음 일을 할 수 있어야 합니다.

1. 검색어로 상품을 검색한다.
2. 카테고리, 가격, 재고 여부, 태그로 결과를 필터링한다.
3. 정렬 기준을 변경한다.
4. 페이지를 이동한다.
5. 검색 조건이 URL에 반영되어 새로고침 후에도 같은 화면으로 복구된다.
6. 상품을 클릭하면 상세 Drawer가 열린다.
7. Drawer가 열린 상태도 URL에 반영되어 공유/새로고침이 가능하다.
8. 자주 쓰는 검색 조건을 Saved View로 저장하고 다시 불러올 수 있다.
9. 일부 API가 실패해도 가능한 영역은 계속 사용할 수 있다.
10. 빠르게 검색어를 바꿔도 오래된 응답이 최신 화면을 덮어쓰지 않는다.

### 3.2 화면 예시

정확한 디자인은 자유입니다. 다만 정보 구조는 아래와 유사해야 합니다.

```text
┌──────────────────────────────────────────────────────────────┐
│ Product Search Admin Console                                 │
├──────────────────────────────────────────────────────────────┤
│ Search: [ iphone                          ]  [Search]         │
│ Saved Views: [인기 전자기기 ▼] [Save current view]             │
├───────────────┬──────────────────────────────────────────────┤
│ Filters       │ Result Summary                                │
│               │ "iphone" 검색 결과 128건                       │
│ Category      │ Sort: [Relevance ▼] PageSize: [20 ▼]           │
│ - Electronics │                                              │
│ - Fashion     │ ┌────┬─────────────┬─────────┬───────┬──────┐ │
│               │ │Rank│ Title       │ Category│ Price │Score │ │
│ Price         │ ├────┼─────────────┼─────────┼───────┼──────┤ │
│ min / max     │ │ 1  │ iPhone 15   │ ...     │ 999   │.982  │ │
│               │ │ 2  │ iPhone Case │ ...     │  29   │.812  │ │
│ Tags          │ └────┴─────────────┴─────────┴───────┴──────┘ │
│ - Popular     │ Pagination: < 1 2 3 ... >                      │
│ - Discount    │                                              │
└───────────────┴──────────────────────────────────────────────┘

상품 클릭 시 우측 Drawer:
┌─────────────────────────────┐
│ iPhone 15 Pro               │
│ matchedKeywords             │
│ rankingReasons              │
│ updatedAt                   │
│ [Close]                     │
└─────────────────────────────┘
```

---

## 4. 과제 범위

### 4.1 필수 구현 범위

아래는 반드시 구현해야 합니다.

- 검색어 입력
- 필터
  - 카테고리
  - 가격 범위
  - 재고 여부
  - 태그
- 정렬
- 페이지네이션
- URL query string 동기화
- 검색 결과 목록
- 상품 상세 Drawer
- Drawer 상태 URL 동기화
- Saved View 저장/불러오기
- loading / empty / error / success 상태
- 부분 실패 처리
- 오래된 응답이 최신 결과를 덮어쓰지 않도록 방지
- 테스트 최소 5개
- README 작성

### 4.2 선택 구현 범위

시간이 남으면 아래 중 일부를 구현할 수 있습니다.

- 랭킹 버전 비교 모드
- 최근 검색어
- visible column 설정 저장
- 키보드 shortcut
- 대용량 리스트 virtualization
- facet count 애니메이션
- query debug panel
- 검색 결과 CSV export

### 4.3 명시적 제외 범위

아래는 구현하지 않아도 됩니다.

- 실제 검색 알고리즘
- 실제 DB
- 실제 인증/권한
- 실제 이미지 업로드
- 실제 서버 배포
- 완성도 높은 디자인 시스템
- 복잡한 차트
- 백엔드 구현

---

## 5. 권장 기술 스택

권장 스택은 아래입니다.

- React
- TypeScript
- TanStack Query 또는 동등한 서버 상태 관리 방식
- React Router 또는 동등한 라우팅 방식
- MSW 또는 동등한 mock API 방식
- Vitest
- Playwright 또는 Testing Library

단, 라이브러리 선택은 자유입니다.  
다만 새로운 라이브러리를 추가했다면 README에 이유를 적어야 합니다.

---

## 6. 라우트 요구사항

최소 라우트는 하나면 충분합니다.

```text
/search
```

단, URL query string은 적극적으로 사용해야 합니다.

예시:

```text
/search?q=iphone&category=electronics&minPrice=100&maxPrice=1000&inStock=true&tags=popular,discount&sort=relevance&page=2&pageSize=20&version=v1&itemId=p_001
```

### 6.1 URL에 포함해야 하는 상태

| 상태 | query key 예시 | 설명 |
|---|---|---|
| 검색어 | `q` | 상품 검색어 |
| 카테고리 | `category` | 단일 선택 또는 전체 |
| 최소 가격 | `minPrice` | 숫자 |
| 최대 가격 | `maxPrice` | 숫자 |
| 재고 여부 | `inStock` | true/false/all |
| 태그 | `tags` | comma-separated string |
| 정렬 | `sort` | relevance, price_asc 등 |
| 페이지 | `page` | 1부터 시작 |
| 페이지 크기 | `pageSize` | 10, 20, 50 |
| 랭킹 버전 | `version` | v1, v2 |
| 상세 아이템 | `itemId` | Drawer open 상태 |

---

## 7. 기능 요구사항 상세

## 7.1 검색 입력

### 요구사항

- 검색어를 입력할 수 있어야 합니다.
- Enter를 누르면 즉시 검색해야 합니다.
- 검색어 변경 후 검색이 실행되면 `page`는 1로 초기화합니다.
- 검색어는 URL의 `q`와 동기화되어야 합니다.
- 새로고침 후에도 같은 검색어가 입력창에 복구되어야 합니다.

### 구현 가이드

검색어 입력값은 다음 두 가지 중 하나로 설계할 수 있습니다.

#### 방식 A: 입력값과 URL 상태를 분리

```text
inputValue: 사용자가 타이핑 중인 값
q: 실제 검색에 사용되는 URL query 값
```

장점:
- debounce나 Enter 검색을 구현하기 좋음
- 타이핑 중 매번 URL이 바뀌지 않게 할 수 있음

단점:
- inputValue와 q의 동기화 규칙이 필요함

#### 방식 B: 입력값을 바로 URL과 동기화

장점:
- 구조가 단순함

단점:
- 빠른 타이핑 시 URL 변경과 요청이 과도하게 발생할 수 있음

둘 중 어느 방식을 선택해도 되지만, README에 선택 이유를 적어야 합니다.

---

## 7.2 필터

### 필수 필터

- 카테고리
- 가격 범위
- 재고 여부
- 태그

### 요구사항

- 필터 변경 시 URL query string이 갱신되어야 합니다.
- 필터 변경 시 `page`는 1로 초기화해야 합니다.
- facet API가 실패해도 검색 결과는 유지되어야 합니다.
- facet 영역만 별도 error UI를 보여야 합니다.
- 잘못된 query string이 들어온 경우 안전하게 기본값으로 보정해야 합니다.

예:

```text
/search?page=-1&sort=wrong
```

위와 같은 URL로 접근해도 앱이 깨지지 않아야 합니다.

---

## 7.3 정렬

### 정렬 옵션

```text
relevance
price_asc
price_desc
rating_desc
created_desc
```

### 요구사항

- 정렬 변경 시 URL의 `sort`가 갱신되어야 합니다.
- 정렬 변경 시 `page`는 1로 초기화해야 합니다.
- 잘못된 sort 값은 기본값 `relevance`로 보정합니다.

---

## 7.4 페이지네이션

### 요구사항

- `page`
- `pageSize`
- `totalCount`
- `totalPages`

를 사용해 페이지네이션을 구현합니다.

필터 변경 후 현재 page가 더 이상 유효하지 않은 경우가 있습니다.

예:

```text
필터 변경 전: totalPages = 10, currentPage = 8
필터 변경 후: totalPages = 2, currentPage = 8
```

이 경우 page를 1 또는 마지막 유효 page로 보정해야 합니다.  
선택한 정책은 README에 적어야 합니다.

---

## 7.5 검색 결과 목록

### 목록 아이템 타입

```ts
export type ProductSearchItem = {
  id: string;
  title: string;
  category: 'electronics' | 'home' | 'fashion' | 'food';
  price: number;
  rating: number;
  inStock: boolean;
  tags: string[];
  rank: number;
  score: number;
  thumbnailUrl?: string;
};
```

### 표시해야 할 정보

- rank
- title
- category
- price
- rating
- inStock
- tags
- score

### 요구사항

- loading 상태
- empty 상태
- error 상태
- success 상태를 모두 구분해야 합니다.
- 검색 결과가 없는 경우 “검색 결과가 없습니다”를 표시합니다.
- 검색 API가 실패한 경우 결과 영역에서 error UI를 표시합니다.
- 이전 성공 결과를 유지할지 비울지는 자유입니다. 단, README에 정책을 적어야 합니다.

---

## 7.6 상세 Drawer

### 상세 타입

```ts
export type ProductDetail = ProductSearchItem & {
  description: string;
  matchedKeywords: string[];
  rankingReasons: string[];
  updatedAt: string;
};
```

### 요구사항

- 목록에서 상품을 클릭하면 상세 Drawer를 엽니다.
- Drawer open 상태는 URL의 `itemId`와 동기화합니다.
- `/search?itemId=p_001`로 직접 접근하면 Drawer가 열린 상태로 복구되어야 합니다.
- 상세 API가 실패해도 전체 검색 화면은 유지되어야 합니다.
- 상세 실패는 Drawer 내부에서만 표시합니다.
- Drawer를 닫으면 URL에서 `itemId`를 제거합니다.

---

## 7.7 Saved View

Saved View는 사용자가 현재 검색 조건을 저장해두고 나중에 다시 불러오는 기능입니다.

### 저장 대상

아래 상태를 저장합니다.

```ts
export type SavedViewState = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean | 'all';
  tags?: string[];
  sort: string;
  pageSize: number;
  version: string;
};
```

`page`는 저장하지 않는 것을 권장합니다.  
Saved View는 “조건”을 저장하는 것이지 “n페이지”를 저장하는 기능은 아니기 때문입니다.  
다르게 판단했다면 README에 이유를 적으세요.

### 구현 방식

둘 중 하나를 선택할 수 있습니다.

#### 방식 A: localStorage

장점:
- 구현이 단순함
- 실제 백엔드 없이도 자연스러움

단점:
- 여러 기기 간 동기화 불가

#### 방식 B: mock API

장점:
- 실제 서버 기반 기능처럼 구현 가능
- TanStack Query mutation/invalidation을 연습하기 좋음

단점:
- 구현량 증가

둘 중 하나를 선택하고 README에 이유를 적으세요.

---

## 7.8 오래된 응답 방지

### 문제 상황

사용자가 빠르게 검색어를 바꿉니다.

```text
i → ip → iph → ipho → iphone
```

네트워크 응답은 순서대로 오지 않을 수 있습니다.

```text
1. iphone 요청 응답 도착
2. 그 뒤에 iph 요청 응답 도착
```

이때 오래된 `iph` 결과가 최신 `iphone` 결과를 덮어쓰면 안 됩니다.

### 요구사항

다음 중 하나 이상의 전략을 사용해 stale response를 방지하세요.

- AbortController
- queryKey 기반 서버 상태 관리
- request sequence id
- debounce
- stale response ignore
- latest request token

README에 어떤 전략을 선택했는지 적어야 합니다.

---

## 7.9 부분 실패 처리

### 필수 부분 실패 시나리오

아래 케이스를 처리해야 합니다.

#### 1. 검색 결과 성공 + facet 실패

- 검색 결과는 정상 표시
- 필터 영역에만 “필터 정보를 불러오지 못했습니다” 표시
- retry 버튼 제공 권장

#### 2. 검색 결과 성공 + 상세 조회 실패

- 검색 결과는 정상 유지
- Drawer 내부에만 상세 조회 실패 표시
- Drawer를 닫을 수 있어야 함

#### 3. Saved View 저장 실패

- 현재 검색 결과는 유지
- 저장 실패 toast 또는 inline error 표시
- 다시 시도 가능해야 함

---

## 8. Mock API 계약

실제 백엔드는 없습니다.  
아래 계약에 맞춰 mock API를 구현하세요.

MSW를 사용하는 것을 권장하지만, 직접 fake client를 만들어도 됩니다.  
단, 실제 서버가 생겼을 때 교체하기 쉬운 경계를 두어야 합니다.

---

## 8.1 Bootstrap API

```http
GET /api/search/bootstrap
```

### Response

```json
{
  "categories": [
    { "value": "electronics", "label": "전자기기" },
    { "value": "home", "label": "생활용품" },
    { "value": "fashion", "label": "패션" },
    { "value": "food", "label": "식품" }
  ],
  "sortOptions": [
    { "value": "relevance", "label": "관련도순" },
    { "value": "price_asc", "label": "가격 낮은순" },
    { "value": "price_desc", "label": "가격 높은순" },
    { "value": "rating_desc", "label": "평점 높은순" },
    { "value": "created_desc", "label": "최신순" }
  ],
  "rankingVersions": ["v1", "v2"],
  "pageSizeOptions": [10, 20, 50]
}
```

---

## 8.2 Search API

```http
GET /api/products/search?q=iphone&category=electronics&minPrice=100&maxPrice=1000&inStock=true&tags=popular,discount&sort=relevance&page=1&pageSize=20&version=v1
```

### Response

```json
{
  "items": [
    {
      "id": "p_001",
      "title": "iPhone 15 Pro",
      "category": "electronics",
      "price": 999,
      "rating": 4.8,
      "inStock": true,
      "tags": ["popular", "discount"],
      "rank": 1,
      "score": 0.982,
      "thumbnailUrl": "/images/p_001.png"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 128,
  "totalPages": 7,
  "queryId": "q_abc123"
}
```

---

## 8.3 Facets API

```http
GET /api/products/facets?q=iphone&category=electronics&version=v1
```

### Response

```json
{
  "categories": [
    { "value": "electronics", "label": "전자기기", "count": 128 },
    { "value": "fashion", "label": "패션", "count": 12 },
    { "value": "home", "label": "생활용품", "count": 8 },
    { "value": "food", "label": "식품", "count": 3 }
  ],
  "tags": [
    { "value": "popular", "label": "인기", "count": 80 },
    { "value": "discount", "label": "할인중", "count": 35 },
    { "value": "new", "label": "신규", "count": 22 },
    { "value": "free-shipping", "label": "무료배송", "count": 44 }
  ],
  "priceRange": {
    "min": 10,
    "max": 2000
  }
}
```

---

## 8.4 Product Detail API

```http
GET /api/products/:id
```

### Response

```json
{
  "id": "p_001",
  "title": "iPhone 15 Pro",
  "category": "electronics",
  "price": 999,
  "rating": 4.8,
  "inStock": true,
  "tags": ["popular", "discount"],
  "rank": 1,
  "score": 0.982,
  "thumbnailUrl": "/images/p_001.png",
  "description": "High-end smartphone for professional users.",
  "matchedKeywords": ["iphone", "pro"],
  "rankingReasons": [
    "검색어와 제목이 정확히 매칭됨",
    "최근 클릭률이 높음",
    "재고가 있음"
  ],
  "updatedAt": "2026-04-30T10:00:00.000Z"
}
```

---

## 8.5 Saved View API

Saved View를 mock API로 구현하는 경우 아래 계약을 사용하세요.

```http
GET /api/search/saved-views
```

```http
POST /api/search/saved-views
```

### POST Request

```json
{
  "name": "인기 전자기기",
  "state": {
    "q": "iphone",
    "category": "electronics",
    "minPrice": 100,
    "maxPrice": 1000,
    "inStock": true,
    "tags": ["popular"],
    "sort": "rating_desc",
    "pageSize": 20,
    "version": "v1"
  }
}
```

### POST Response

```json
{
  "id": "view_001",
  "name": "인기 전자기기",
  "state": {
    "q": "iphone",
    "category": "electronics",
    "minPrice": 100,
    "maxPrice": 1000,
    "inStock": true,
    "tags": ["popular"],
    "sort": "rating_desc",
    "pageSize": 20,
    "version": "v1"
  },
  "createdAt": "2026-04-30T10:00:00.000Z"
}
```

---

## 9. Mock Scenario

아래 시나리오를 지원하면 좋습니다.  
모두 구현하지 않아도 되지만, 최소 `default`, `slow`, `empty`, `facets-error`, `detail-error`, `out-of-order`는 구현해야 합니다.

```ts
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
```

### 시나리오 설명

| 시나리오 | 설명 | 검증 목적 |
|---|---|---|
| `default` | 정상 응답 | 기본 동작 |
| `slow` | 검색 응답 지연 | loading 처리 |
| `empty` | 검색 결과 0건 | empty state |
| `search-error` | 검색 API 실패 | 결과 영역 error |
| `facets-error` | facet만 실패 | 부분 실패 |
| `detail-error` | 상세 조회 실패 | Drawer 내부 error |
| `saved-view-error` | 저장 실패 | 저장 실패 복구 |
| `out-of-order` | 이전 요청이 늦게 도착 | stale response 방지 |
| `large-dataset` | 5,000건 이상 데이터 | pagination/virtualization |

---

## 10. 상태 저장 권장안

아래는 권장안입니다. 반드시 똑같이 따를 필요는 없지만, 다르게 설계했다면 README에 이유를 적으세요.

| 상태 | 권장 저장 위치 |
|---|---|
| 검색어 `q` | URL query string |
| category | URL query string |
| minPrice/maxPrice | URL query string |
| inStock | URL query string |
| tags | URL query string |
| sort | URL query string |
| page/pageSize | URL query string |
| version | URL query string |
| itemId | URL query string |
| 검색 결과 | server state cache |
| facet | server state cache |
| detail | server state cache |
| saved views | localStorage 또는 server state cache |
| drawer animation state | component state |
| visible columns | localStorage |
| temporary input value | component state |
| loading/error | query state 또는 local async state |

---

## 11. 구현 가이드

### 11.1 Query Key 예시

TanStack Query를 사용한다면 query key는 검색 조건을 충분히 포함해야 합니다.

```ts
const productSearchQueryKey = [
  'products',
  'search',
  {
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
  },
];
```

### 11.2 URL Parsing 예시

URL query string은 문자열입니다.  
따라서 숫자, boolean, enum 값을 안전하게 parsing해야 합니다.

예:

```ts
type SearchParams = {
  q: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean | 'all';
  tags: string[];
  sort: 'relevance' | 'price_asc' | 'price_desc' | 'rating_desc' | 'created_desc';
  page: number;
  pageSize: 10 | 20 | 50;
  version: 'v1' | 'v2';
  itemId?: string;
};
```

### 11.3 잘못된 URL 보정

아래 같은 URL도 앱을 깨뜨리면 안 됩니다.

```text
/search?page=-10&pageSize=999&sort=invalid&version=v999
```

권장 보정:

```text
page: 1
pageSize: 20
sort: relevance
version: v1
```

---

## 12. 테스트 요구사항

테스트는 최소 5개입니다.  
가능하면 다음 테스트를 우선 구현하세요.

### 필수 테스트

1. 검색어 변경 시 page가 1로 초기화된다.
2. 필터와 정렬 상태가 URL에 반영된다.
3. facet API만 실패해도 검색 결과는 유지된다.
4. URL에 itemId가 있으면 Drawer가 열린다.
5. 이전 검색 요청이 늦게 도착해도 최신 결과를 덮어쓰지 않는다.

### 권장 테스트

6. Saved View 클릭 시 URL state가 복원된다.
7. detail API 실패 시 Drawer 내부 error가 표시된다.
8. empty state가 정상 표시된다.
9. 잘못된 URL query 값이 기본값으로 보정된다.
10. page가 totalPages보다 클 때 유효한 page로 보정된다.

---

## 13. 제출물

아래 파일과 결과물을 제출하세요.

```text
1. Git 저장소
2. README.md
3. state-model.md
4. api-contract.md
5. edge-cases.md
6. 테스트 결과
7. 3분 데모 스크립트 또는 데모 영상
```

### README 필수 항목

```text
- 프로젝트 개요
- 실행 방법
- 테스트 방법
- 주요 기능
- URL state 설계
- API mock 설계
- 요청 취소 / stale response 방지 전략
- partial failure 처리 방식
- saved view 저장 방식
- 구현 범위
- 미구현 범위
- trade-off
- known limitations
```

### state-model.md 필수 항목

```text
- URL에 저장한 상태
- query cache에 저장한 상태
- localStorage에 저장한 상태
- component state로 둔 상태
- 각 선택의 이유
```

### edge-cases.md 필수 항목

```text
- 빠른 검색어 변경
- out-of-order response
- facet만 실패
- detail만 실패
- saved view 저장 실패
- 잘못된 URL query
- page 보정
- Drawer URL 복구
```

### 셀프 리뷰
셀프 리뷰 문서를 만들어주세요

---

## 14. 채점 기준

총점 100점 기준입니다.

| 항목 | 배점 | 설명 |
|---|---:|---|
| 요구사항 충족도 | 25 | 필수 기능이 제대로 동작하는가 |
| URL/state 설계 | 20 | URL, server state, UI state를 구분했는가 |
| 비동기 요청 정합성 | 20 | stale response, 요청 취소, 빠른 입력을 처리했는가 |
| 부분 실패 처리 | 15 | 실패 범위를 적절히 분리했는가 |
| 목록/상세 UX | 10 | loading/empty/error/success, drawer UX가 자연스러운가 |
| 테스트 품질 | 5 | 위험한 흐름을 테스트했는가 |
| 문서화 | 5 | 설계 의도가 설명되는가 |

---

## 15. 큰 감점 또는 실격 포인트

아래는 큰 감점 대상입니다.

- URL state 없이 내부 state로만 검색 조건을 관리함
- 새로고침하면 검색 조건이 사라짐
- 뒤로가기/앞으로가기가 비정상 동작함
- 필터 변경 후 page 보정이 없음
- loading/error/empty 상태가 부실함
- 오래된 요청 결과가 최신 검색 결과를 덮어씀
- facet 실패 시 전체 화면을 error로 덮음
- detail 실패 시 전체 페이지가 깨짐
- Saved View가 단순 버튼만 있고 상태 복구가 안 됨
- README에 상태 설계 설명이 없음
- 테스트가 happy path만 있음

---

## 16. 멘토가 리뷰할 때 주로 볼 내용

멘토는 코드의 예쁨보다 아래를 우선 봅니다.

### 16.1 상태 분리

질문 예시:

- 왜 이 상태는 URL에 두었나요?
- 왜 이 상태는 localStorage에 두었나요?
- detail drawer open 상태는 UI state인가요, URL state인가요?
- saved view에 page를 저장하지 않은 이유는 무엇인가요?

### 16.2 비동기 정합성

질문 예시:

- 빠르게 검색어를 바꾸면 이전 요청은 어떻게 되나요?
- 응답이 순서대로 오지 않으면 어떻게 막았나요?
- debounce와 Enter 검색을 함께 쓰면 어떤 문제가 생길 수 있나요?

### 16.3 부분 실패

질문 예시:

- facet만 실패했을 때 왜 전체 화면을 막지 않았나요?
- detail API 실패는 어디에서 처리하나요?
- retry는 어떤 단위로 제공하나요?

### 16.4 UX 복구

질문 예시:

- `/search?itemId=p_001`로 직접 들어오면 어떤 순서로 데이터를 가져오나요?
- 잘못된 URL query는 어떻게 보정하나요?
- 새로고침 후 saved view 목록은 어디에서 복구하나요?

### 16.5 문서화

질문 예시:

- 실제 백엔드가 생긴다면 어떤 파일만 교체하면 되나요?
- 지금 구조의 가장 큰 trade-off는 무엇인가요?
- 시간이 2시간 더 있었다면 무엇을 보완하겠나요?

---

## 17. API가 없는데 어떻게 하나요?

이 과제는 실제 API가 없어도 충분히 구현할 수 있습니다.

이유는 다음과 같습니다.

1. 이 과제는 백엔드 역량을 보려는 과제가 아닙니다.
2. 검증 대상은 “프론트엔드가 API 계약을 기준으로 화면 상태를 안정적으로 다루는가”입니다.
3. mock API는 실제 서버처럼 지연, 실패, 빈 결과, 순서 꼬임을 재현할 수 있습니다.
4. MSW를 사용하면 브라우저와 테스트 환경 모두에서 동일한 API 계약을 사용할 수 있습니다.
5. 나중에 실제 API가 생기면 mock handler를 실제 fetch client로 교체하면 됩니다.

따라서 이 과제에서 중요한 것은 **진짜 서버의 존재**가 아니라,  
**서버가 있다고 가정했을 때 프론트엔드 경계를 어떻게 설계하는지**입니다.

---

## 18. 완료 기준 체크리스트

제출 전 아래를 확인하세요.

### 기능

- [ ] 검색어 입력이 동작한다.
- [ ] 필터가 동작한다.
- [ ] 정렬이 동작한다.
- [ ] 페이지네이션이 동작한다.
- [ ] 검색 조건이 URL에 반영된다.
- [ ] 새로고침 후 같은 검색 조건이 복구된다.
- [ ] 목록 아이템 클릭 시 Drawer가 열린다.
- [ ] Drawer 상태가 URL에 반영된다.
- [ ] Saved View를 저장하고 불러올 수 있다.

### 상태/비동기

- [ ] 필터 변경 시 page가 보정된다.
- [ ] 잘못된 URL query가 안전하게 보정된다.
- [ ] 오래된 응답이 최신 결과를 덮어쓰지 않는다.
- [ ] facet 실패 시 검색 결과는 유지된다.
- [ ] detail 실패 시 Drawer 내부에서만 error가 표시된다.

### 품질

- [ ] loading/empty/error/success 상태가 구분되어 있다.
- [ ] 테스트가 최소 5개 이상 있다.
- [ ] README에 설계 의도가 있다.
- [ ] state-model.md가 있다.
- [ ] api-contract.md가 있다.
- [ ] edge-cases.md가 있다.

---

## 19. 권장 시간 배분

총 6~8시간 기준입니다.

| 시간 | 작업 |
|---:|---|
| 30분 | 요구사항 읽기, state-model.md 초안 작성 |
| 40분 | mock API / fixture 구성 |
| 60분 | URL state parser / serializer 구현 |
| 90분 | 검색/필터/정렬/페이지네이션 구현 |
| 60분 | Drawer / detail API 구현 |
| 40분 | Saved View 구현 |
| 60분 | 부분 실패 / stale response 처리 |
| 60분 | 테스트 작성 |
| 40분 | README / 문서 정리 |

---

## 20. 멘티에게 남기는 안내

이 과제는 검색 알고리즘을 잘 만드는 과제가 아닙니다.

검색 결과는 mock data여도 됩니다.  
디자인이 화려하지 않아도 됩니다.  
대신 다음이 중요합니다.

- URL을 보고 현재 화면 상태를 설명할 수 있어야 합니다.
- 서버 상태와 UI 상태가 뒤섞이지 않아야 합니다.
- 실패한 영역만 실패해야 합니다.
- 빠른 사용자 입력에도 화면이 최신 상태를 유지해야 합니다.
- README만 읽어도 왜 이렇게 설계했는지 이해되어야 합니다.

완성도 높은 검색 콘솔을 만드는 것보다,  
**복잡한 상태를 안정적으로 다루는 프론트엔드 사고방식**을 보여주는 것이 더 중요합니다.
