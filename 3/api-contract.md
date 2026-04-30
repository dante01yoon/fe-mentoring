# API Contract

이 프로젝트는 실제 백엔드 없이 **MSW** 기반 mock 서버를 사용합니다.
계약은 [src/mocks/handlers.ts](./src/mocks/handlers.ts) 와 [src/mocks/types.ts](./src/mocks/types.ts) 가 단일 진실 원천(SSOT)입니다.

---

## 1. 사용한 API 목록

| Method | Path | Description |
|---|---|---|
| GET | `/api/search/bootstrap` | 카테고리/정렬 옵션/랭킹 버전/페이지 크기 옵션 |
| GET | `/api/products/search` | 검색 결과 + 페이지네이션 |
| GET | `/api/products/facets` | facet count (카테고리/태그/가격 범위) |
| GET | `/api/products/:id` | 상세 정보 |
| GET | `/api/search/saved-views` | Saved View 목록 |
| POST | `/api/search/saved-views` | Saved View 생성 |

---

## 2. Request / Response 예시

### GET `/api/products/search`

```
GET /api/products/search?q=iphone&category=electronics&sort=relevance&page=1&pageSize=20&version=v1
```

```json
{
  "items": [
    {
      "id": "p_001",
      "title": "iPhone 15 Pro",
      "category": "electronics",
      "price": 999000,
      "rating": 4.8,
      "inStock": true,
      "tags": ["popular", "discount"],
      "rank": 1,
      "score": 0.982
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 1,
  "totalPages": 1,
  "queryId": "q_1_lzx9"
}
```

스펙 §8.2 참고. 다른 엔드포인트 예시는 스펙 명세에 정리되어 있습니다.

---

## 3. Mock Scenario 목록

mock 서버는 다음 시나리오를 지원합니다 (스펙 §9).

| 시나리오 | 적용 방법 |
|---|---|
| `default` | (없음) |
| `slow` | `?scenario=slow` |
| `empty` | `?scenario=empty` |
| `search-error` | `?scenario=search-error` |
| `facets-error` | `?scenario=facets-error` |
| `detail-error` | `?scenario=detail-error` |
| `saved-view-error` | `?scenario=saved-view-error` |
| `out-of-order` | `?scenario=out-of-order` |
| `large-dataset` | `?scenario=large-dataset` |

시나리오는 URL → localStorage → 'default' 순으로 결정됩니다 ([src/mocks/scenario.ts](./src/mocks/scenario.ts)).

---

## 4. 실제 백엔드가 생기면 교체해야 할 경계

> 멘티가 자신의 구조에 맞춰 작성하세요. 출발점:

1. **`src/mocks/`** 는 더 이상 필요 없으므로 제거하거나 dev/test 전용으로 격리합니다.
2. **`src/main.tsx`** 의 MSW 부트스트랩 분기를 제거합니다.
3. **`src/lib/api.ts`** 의 `baseUrl` 만 실서버로 바꾸면 됩니다.
   - request/response 타입은 그대로 사용 가능하도록 [src/mocks/types.ts](./src/mocks/types.ts) 의 타입을
     `src/lib/types.ts`로 이동시켜 두면 mock 폴더 의존성을 끊을 수 있습니다.
4. **테스트** 는 MSW handler를 그대로 재사용하면 됩니다 (`server.use(...)`).
