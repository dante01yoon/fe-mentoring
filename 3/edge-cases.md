# Edge Cases

스펙 §13의 `edge-cases.md` 슬롯입니다. 멘티가 자신이 처리한 방식을 적어주세요.
아래는 스펙에서 명시적으로 언급한 케이스들의 체크리스트입니다.

---

## 1. 빠른 검색어 변경

> 시나리오: 사용자가 `i → ip → iph → ipho → iphone` 빠르게 타이핑.

- [ ] 입력값과 URL의 `q`를 분리했나요?
- [ ] Enter / 버튼 / debounce 중 어떤 시점에 q를 갱신하나요?
- [ ] 매 키 입력마다 URL이 바뀌면 history가 폭발합니다 — `replace` 또는 debounce를 사용하나요?

---

## 2. Out-of-order response

> `?scenario=out-of-order` 로 재현 가능. mock 서버는 짝수 번째 search 요청을 1.5s 지연시킵니다.

- [ ] 어떤 전략으로 stale response를 막았나요?
  - AbortController?
  - queryKey 기반 (TanStack Query)?
  - sequence id?
  - latest token?
- [ ] facet/detail에도 같은 전략이 적용되나요?

---

## 3. facet API만 실패

> `?scenario=facets-error`. search는 성공.

- [ ] 결과 테이블은 정상 표시되나요?
- [ ] FilterPanel만 error UI를 보여주나요?
- [ ] retry 버튼이 있나요?

---

## 4. detail API만 실패

> `?scenario=detail-error`.

- [ ] 검색 결과/필터는 영향받지 않나요?
- [ ] Drawer 내부에만 error가 표시되나요?
- [ ] Drawer를 닫을 수 있나요? (ESC / 닫기 버튼 / URL itemId 제거)

---

## 5. Saved View 저장 실패

> `?scenario=saved-view-error`.

- [ ] 현재 검색 결과가 유지되나요?
- [ ] 저장 실패 toast/inline error가 표시되나요?
- [ ] 사용자가 다시 시도할 수 있나요?

---

## 6. 잘못된 URL query

> 예: `/search?page=-1&sort=wrong&pageSize=999&version=v999`.

- [ ] 앱이 깨지지 않나요?
- [ ] 각 값이 기본값으로 보정되나요? (page=1, sort=relevance, pageSize=20, version=v1)
- [ ] tags에 공백 / 빈 문자열이 섞여 있어도 안전한가요?

---

## 7. page 보정

> 시나리오: totalPages=10, currentPage=8 인 상태에서 필터 적용 후 totalPages=2가 됨.

- [ ] 어떤 정책을 선택했나요?
  - (A) 마지막 유효 page로 보정 (page = totalPages)
  - (B) page=1로 초기화
- [ ] 보정 시 useEffect로 처리하나요? 아니면 fetch 시점에 가드하나요?

---

## 8. Drawer URL 복구

> `/search?itemId=p_001` 로 직접 진입.

- [ ] Drawer가 열린 상태로 복구되나요?
- [ ] 검색 결과와 동시에 detail fetch가 시작되나요? (직렬? 병렬?)
- [ ] 만약 itemId가 현재 검색 결과에 없는 경우 어떻게 처리하나요?
