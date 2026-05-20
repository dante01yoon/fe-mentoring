# Scoring Rubric

총점 100점입니다.

| 항목 | 점수 | 평가 기준 |
| --- | ---: | --- |
| Drag-and-drop 정확도 | 25 | 같은 column reorder, cross-column move, 빈 column drop, active/overlay 상태가 안정적으로 동작 |
| Optimistic update / rollback | 25 | 즉시 UI 반영, 실패 rollback, stale-version conflict 안내, 서버 응답 기준 정규화 |
| 상태 분리와 URL 동기화 | 20 | server/URL/drag/mutation/derived state가 섞이지 않고 새로고침/뒤로가기/공유 링크가 동작 |
| Edge case 처리 | 15 | WIP limit, slow/empty/error/large-board scenario에서 화면이 무너지지 않음 |
| 접근성과 UX 완성도 | 10 | keyboard drag 또는 대체 조작, focus 관리, 명확한 저장/실패 피드백 |
| 테스트 품질 | 5 | 순수 함수 단위 테스트와 최소 E2E가 의미 있는 회귀를 막음 |

## 감점 기준

| 감점 | 사유 |
| ---: | --- |
| -20 | drag 결과가 서버 저장 후 재조회에서 유지되지 않음 |
| -15 | move 실패 시 잘못된 위치가 남아 있음 |
| -15 | 409 conflict를 조용히 무시함 |
| -10 | URL 직접 접근 시 drawer/필터가 복원되지 않음 |
| -10 | pointer drag만 가능하고 keyboard/대체 조작이 없음 |
| -10 | 테스트가 smoke test뿐임 |
