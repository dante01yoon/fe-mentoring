# 3회차 — Product Search Admin Console (스캐폴드)

상품 카탈로그를 검색/필터/정렬/페이징하고 상세를 확인할 수 있는 관리자 콘솔입니다.
이 디렉터리는 **멘티가 바로 작업을 시작할 수 있도록 준비된 스캐폴드**입니다.

> 과제 명세서는 [`03-product-search-admin-console.md`](./03-product-search-admin-console.md) 입니다.
> 이 README는 **무엇이 이미 만들어져 있고 / 무엇을 멘티가 채워야 하는지**만 정리합니다.

---

## 1. 실행

```bash
pnpm install
pnpm dev
```

- 개발 서버는 [http://localhost:5173](http://localhost:5173) 에서 열립니다.
- MSW가 자동으로 시작되며, `public/mockServiceWorker.js` 가 등록됩니다.
- 모든 API는 mock 입니다. 백엔드 없이 동작합니다.

빌드 확인:

```bash
pnpm build
```

---

## 2. 디렉터리 구조

```
3/
├── 03-product-search-admin-console.md  ← 과제 명세
├── README.md                            ← 이 문서
├── state-model.md                       ← 상태 설계 메모 (멘티가 채움)
├── api-contract.md                      ← API 계약 메모 (스켈레톤 제공)
├── edge-cases.md                        ← 엣지 케이스 메모 (체크리스트 제공)
├── public/
│   └── mockServiceWorker.js             ← MSW worker (자동 생성된 표준 파일)
└── src/
    ├── main.tsx                         ← MSW bootstrap + React mount
    ├── App.tsx                          ← Router (단일 라우트 /search)
    ├── pages/
    │   └── SearchPage.tsx               ← 검색 페이지 컨테이너 (배치만)
    ├── components/
    │   ├── Layout.tsx                   ← 헤더 + Outlet
    │   ├── SearchBar.tsx                ← 검색 입력
    │   ├── SavedViewBar.tsx             ← Saved View dropdown + 저장 버튼
    │   ├── FilterPanel.tsx              ← Category/Price/Stock/Tags 필터
    │   ├── ResultToolbar.tsx            ← Sort + PageSize + 결과 요약
    │   ├── ResultTable.tsx              ← 결과 테이블
    │   ├── Pagination.tsx               ← 페이지 이동
    │   └── DetailDrawer.tsx             ← 상세 우측 Drawer
    ├── lib/
    │   ├── api.ts                       ← fetch wrapper (완성)
    │   ├── searchParams.ts              ← URL 파서/직렬화 (멘티 구현)
    │   ├── queryKeys.ts                 ← 서버 상태 cache key (완성)
    │   └── storage.ts                   ← localStorage 헬퍼 (완성)
    └── mocks/
        ├── browser.ts                   ← MSW worker setup
        ├── handlers.ts                  ← API 핸들러 (전체 시나리오 구현)
        ├── scenario.ts                  ← 시나리오 스위치 (URL/localStorage)
        ├── data.ts                      ← 카탈로그 / 라벨
        └── types.ts                     ← 도메인 타입
```

---

## 3. 무엇이 이미 만들어져 있나요?

이 영역은 **건드리지 않아도 됩니다.** (필요하면 수정해도 됩니다.)

### 3.1 Mock 서버

스펙 §8의 모든 엔드포인트가 구현되어 있습니다.

| 엔드포인트 | 메서드 | 핸들러 위치 |
|---|---|---|
| `/api/search/bootstrap` | GET | [src/mocks/handlers.ts](./src/mocks/handlers.ts) |
| `/api/products/search` | GET | 동일 |
| `/api/products/facets` | GET | 동일 |
| `/api/products/:id` | GET | 동일 |
| `/api/search/saved-views` | GET | 동일 |
| `/api/search/saved-views` | POST | 동일 |

### 3.2 시나리오

스펙 §9의 모든 시나리오가 동작합니다.

| 시나리오 | 동작 |
|---|---|
| `default` | 정상 응답 |
| `slow` | search/facet/detail 모두 1.5–2s 지연 |
| `empty` | 검색 결과 0건 |
| `search-error` | search 500 |
| `facets-error` | facet만 500 (search/detail은 정상) |
| `detail-error` | detail만 500 |
| `saved-view-error` | saved view GET/POST 500 |
| `out-of-order` | 짝수 번째 search 요청을 1.5s 지연시켜 응답 순서를 뒤섞음 |
| `large-dataset` | 5,000건 카탈로그 |

시나리오 변경 방법:

- URL: `/search?scenario=facets-error` (한 번 적용 후 새로고침해도 유지됨)
- localStorage: 직접 `product-search:scenario` 키를 세팅
- 코드에서: `import { setScenario } from './mocks/scenario'`

### 3.3 API 클라이언트

[src/lib/api.ts](./src/lib/api.ts) 의 `api` 인스턴스를 그대로 쓰면 됩니다.
모든 메서드는 `AbortSignal`을 받습니다. TanStack Query를 도입하면 `queryFn` 내부에서 그대로 호출하면 됩니다.

### 3.4 서버 상태 cache key

[src/lib/queryKeys.ts](./src/lib/queryKeys.ts) 에 정리되어 있습니다.
search/facets/detail/savedViews 를 쓰면 됩니다.

---

## 4. 무엇을 채워야 하나요?

### 4.1 URL 상태 (필수)

[src/lib/searchParams.ts](./src/lib/searchParams.ts) 의 두 함수가 비어 있습니다.

- `parseSearchParams(URLSearchParams) → SearchUrlState`
- `serializeSearchState(SearchUrlState) → URLSearchParams`
- `mergeAndResetPage(prev, patch) → SearchUrlState`
- `clampPage(page, totalPages) → number`

규칙:
- 잘못된 값(예: `page=-1`, `sort=wrong`, `pageSize=999`, `version=v999`)은 기본값으로 보정
- 기본값과 동일한 값은 직렬화하지 않음 (URL을 깔끔하게 유지)
- 검색어/필터/정렬 변경 시 page=1로 초기화 (`mergeAndResetPage` 활용)

### 4.2 페이지 / 컴포넌트 (필수)

[src/pages/SearchPage.tsx](./src/pages/SearchPage.tsx) 와 [src/components/](./src/components/) 의 각 파일에
주석으로 TODO와 요구사항을 정리해 두었습니다. 컴포넌트별로:

| 파일 | 주요 작업 |
|---|---|
| `SearchBar.tsx` | input 분리(방식 A 권장), Enter 시 q 갱신 + page=1 |
| `FilterPanel.tsx` | facet 결과 렌더, 필터 변경 시 URL 갱신 + page=1, **facet 실패는 자체 영역에만 표시** |
| `ResultToolbar.tsx` | sort/pageSize select, 변경 시 page=1 |
| `ResultTable.tsx` | loading/empty/error/success 4상태, row 클릭 → URL itemId |
| `Pagination.tsx` | totalPages 보정, prev/next 비활성화 |
| `DetailDrawer.tsx` | itemId 있을 때만 fetch + 표시, 닫기 시 URL에서 itemId 제거 |
| `SavedViewBar.tsx` | 저장(localStorage 또는 mock API) / 불러오기 / 적용 |

### 4.3 비동기 정합성 (필수)

스펙 §7.8 준수. 다음 중 하나 이상 선택:

- TanStack Query (queryKey + 자동 cancel)
- 직접 fetch + `AbortController`
- request sequence id (counter ref)
- debounce + 키 기반 비교

선택한 전략을 README의 “요청 취소 / stale response 방지 전략” 절에 적어주세요.

### 4.4 부분 실패 (필수)

- search 성공 + facet 실패 → FilterPanel만 error UI, 결과 테이블은 유지
- search 성공 + detail 실패 → Drawer 내부만 error
- Saved View 저장 실패 → 화면 상태 유지 + toast/inline error

### 4.5 테스트 (최소 5개)

스펙 §12의 필수 테스트 5개를 우선 구현하세요. Vitest + Testing Library 권장이지만 자유입니다.
테스트 러너는 미리 설치되어 있지 않습니다 — 선택한 도구를 추가하면서 README에 이유를 적어주세요.

### 4.6 문서 (필수)

- `state-model.md` — URL/server state/localStorage/component state 분리
- `api-contract.md` — 사용 API + mock scenario + 백엔드 교체 경계
- `edge-cases.md` — 빠른 입력/out-of-order/부분 실패 등 엣지 케이스 처리

각 문서는 스켈레톤만 있으니 멘티가 채우면 됩니다.

---

## 5. README에 포함해야 할 항목 (제출 시)

스펙 §13 README 필수 항목입니다. 아래 슬롯을 채워주세요.

### 프로젝트 개요
> (예: 검색 조건이 URL에 동기화되는 상품 검색 콘솔.)

### 실행 방법
> (위 §1 참고 — 멘티가 추가/수정한 명령이 있으면 반영)

### 테스트 방법
> (선택한 테스트 러너 명령 기재)

### 주요 기능
> (스펙 3.1 기준 동작하는 기능 체크)

### URL state 설계
> (어떤 상태를 URL에 두었는지, 왜 그런지)

### API mock 설계
> (실제 백엔드가 생기면 어떤 파일만 교체하면 되는지)

### 요청 취소 / stale response 방지 전략
> (AbortController / queryKey / sequence id / debounce 중 어떤 것을 썼는지)

### Partial failure 처리 방식
> (search/facet/detail 실패 분리, retry 단위)

### Saved View 저장 방식
> (localStorage vs mock API, 선택 이유)

### 구현 범위 / 미구현 범위
> (스펙 §4 기준)

### Trade-off
> (시간 부족으로 포기한 것, 알지만 의도적으로 미루는 것)

### Known limitations
> (예: 빠른 검색 중 brief flicker, large-dataset에서 virtualization 미구현 등)
