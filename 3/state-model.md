# State Model

스펙 §13의 `state-model.md` 슬롯입니다. 멘티가 자신의 설계를 적어주세요.
스펙 §10 “상태 저장 권장안” 표를 출발점으로 삼으면 됩니다.

---

## 1. URL query string에 보관한 상태

| 상태 | query key | 타입 | 기본값 | 비고 |
|---|---|---|---|---|
| 검색어 | `q` | string | `""` | (예시) |
| 카테고리 | `category` | enum | undefined | |
| 최소 가격 | `minPrice` | number | undefined | |
| 최대 가격 | `maxPrice` | number | undefined | |
| 재고 여부 | `inStock` | `'true' \| 'false' \| 'all'` | undefined | |
| 태그 | `tags` | comma-separated string | `[]` | |
| 정렬 | `sort` | enum | `relevance` | |
| 페이지 | `page` | number | `1` | |
| 페이지 크기 | `pageSize` | `10 \| 20 \| 50` | `20` | |
| 랭킹 버전 | `version` | `'v1' \| 'v2'` | `v1` | |
| 상세 아이템 | `itemId` | string | undefined | Drawer open 상태 |

> 왜 이 상태들을 URL에 두었나요? (새로고침 복구 / 공유 / 뒤로가기 정상 동작)

---

## 2. 서버 상태 cache에 보관한 상태

| 데이터 | 키 | 무효화 시점 |
|---|---|---|
| `bootstrap` | `['search', 'bootstrap']` | 한 번만 |
| `search` | `['products', 'search', { ...params }]` | URL state 변경 시 |
| `facets` | `['products', 'facets', { ...params, page 제외 }]` | facet에 영향 주는 query 변경 시 |
| `detail` | `['products', 'detail', id]` | itemId 변경 시 |
| `savedViews` | `['search', 'saved-views']` | mutation 후 invalidate |

> page 변경은 facet에 영향을 주지 않도록 의도적으로 facet key에서 제외했습니다.
> (멘티가 다르게 설계했다면 그 이유를 적어주세요.)

---

## 3. localStorage에 보관한 상태

| 키 | 용도 |
|---|---|
| `product-search:v1:saved-views` | (방식 A 선택 시) Saved View 목록 |
| `product-search:v1:visible-columns` | (선택 구현) 표시 컬럼 |
| `product-search:scenario` | mock 시나리오 스위치 |

---

## 4. 컴포넌트 state로 둔 것

| 상태 | 위치 |
|---|---|
| 검색어 input value (타이핑 중) | `SearchBar` 내부 |
| Drawer 진입/퇴장 애니메이션 | `DetailDrawer` 내부 (선택) |
| 일시적 toast 메시지 | 상위 컴포넌트의 ephemeral state |

---

## 5. 분리 기준

> 왜 이렇게 나누었는지 한 줄씩 설명해주세요.
>
> - URL: 새로고침/공유/뒤로가기로 복구 가능한 “화면 상태”
> - server cache: 서버에서 받아온 데이터, 키-값으로 키잉 가능한 것
> - localStorage: 새로고침을 넘어 유지되어야 하지만 URL에는 어울리지 않는 사용자 설정
> - component state: 일시적이고 새로고침을 넘어가지 않아도 되는 것
