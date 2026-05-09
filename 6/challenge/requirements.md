# Requirements

멘티가 충족해야 할 기능 요구사항.

## 필수

- script 한 줄로 삽입 가능한 SDK 형태
- window.SupportWidget namespace 하나만 노출
- boot / shutdown / show / hide / track 구현
- anonymous/member boot 분기
- custom launcher 지원
- unread badge 표시
- popup notification 표시
- 내부 route: Home / FAQ / Messages
- Shadow DOM 또는 iframe 기반 isolation 중 택1
- host page CSS 충돌 방지
- shutdown cleanup
- SPA host route 변경 후 상태 유지

## 비기능

- 외부 라이브러리(React/Vue/Lit/jQuery 등) 금지
- 빌드: `pnpm build` 통과
- 타입체크: `pnpm typecheck` 통과
- 단위 테스트: 핵심 lifecycle 시나리오 1개 이상 통과
- e2e: boot/show 시나리오 1개 이상 통과

## 의도적으로 자유롭게 두는 부분

- isolation 전략의 구체적 선택 (Shadow DOM / iframe)
- duplicate boot 정책 (덮어쓰기 / 무시 / throw)
- host route 변경 감지 방식 (popstate / history monkey-patch)
- storage backend 선택 (localStorage / sessionStorage / in-memory)
- track 실패 시 정책 (silent / console.warn / retry)

각 선택의 이유는 README 트레이드오프 섹션에 명시할 것.
