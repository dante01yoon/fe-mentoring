# Submission Checklist

## 기능

- [ ] `/board` 기본 렌더링
- [ ] 검색 필터 URL 동기화
- [ ] 담당자 필터 URL 동기화
- [ ] 라벨 필터 URL 동기화
- [ ] priority 필터 URL 동기화
- [ ] card detail drawer URL 동기화
- [ ] 같은 column reorder
- [ ] 다른 column으로 카드 이동
- [ ] 빈 column으로 카드 이동
- [ ] WIP limit 정책 구현
- [ ] optimistic update
- [ ] move-failure rollback
- [ ] stale-version conflict 안내
- [ ] large-board 성능 확인

## 테스트

- [ ] `pnpm typecheck`
- [ ] `pnpm build`
- [ ] `pnpm test`
- [ ] `pnpm test:e2e`
- [ ] board ordering 단위 테스트
- [ ] rollback 단위/통합 테스트
- [ ] URL state 테스트
- [ ] 최소 1개 실제 drag E2E

## 제출 메모에 포함할 것

- 선택한 WIP limit 정책
- optimistic update/rollback 설계 요약
- 409 conflict 복구 방식
- 처리한 edge case 목록
- 남은 known issue
