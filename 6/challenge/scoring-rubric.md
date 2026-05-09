# Scoring Rubric

총 100점 기준 멘토 채점 가이드.

| 항목                       | 배점 |
| -------------------------- | ---- |
| Public API 설계            | 20   |
| Lifecycle 안전성           | 20   |
| Isolation 전략             | 20   |
| DOM/Event 기본기           | 15   |
| Cleanup / 메모리 누수 방지 | 10   |
| 테스트 품질                | 10   |
| 문서화                     | 5    |

## 항목별 세부 기준

### Public API 설계 (20)

- `window.SupportWidget` 외 추가 전역이 노출되지 않음
- boot config 의 필수/선택 필드 검증이 일관됨
- 타입이 외부에서 그대로 사용 가능한 형태로 export 됨

### Lifecycle 안전성 (20)

- boot / shutdown 의 idempotency
- 잘못된 호출 순서에 대한 정책이 README 에 명시되어 있음
- 같은 SDK 가 두 번 로드되었을 때 안전

### Isolation 전략 (20)

- Shadow DOM 또는 iframe 중 하나를 선택해 실제로 적용
- host CSS (`button { all: unset }`, `div { border: 10px solid hotpink }`) 가 위젯을 깨뜨리지 않음
- 위젯 CSS 가 host 페이지 다른 요소에 새지 않음

### DOM/Event 기본기 (15)

- 라이브러리 없이 안전한 DOM 조작
- 이벤트 위임 / removeEventListener 누락 없음
- accessibility 기본 (aria, focus) 고려

### Cleanup / 메모리 누수 방지 (10)

- shutdown 후 DOM / listener / timer / storage subscription 흔적이 없음
- Performance Memory snapshot 으로 검증해도 누수가 없음

### 테스트 품질 (10)

- 핵심 lifecycle / isolation 시나리오에 대한 vitest
- 최소 1개 이상의 e2e 시나리오 통과

### 문서화 (5)

- README 의 트레이드오프 / 한계 / 미구현 범위가 명확
- challenge/review-checklist.md 의 모든 질문에 답변
