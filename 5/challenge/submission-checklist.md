# 제출 체크리스트

PR을 올리기 전에 한 번씩 직접 확인하세요.

## 빌드 / 타입 / 테스트

- [ ] `pnpm install` 성공
- [ ] `pnpm typecheck` 성공
- [ ] `pnpm build` 성공
- [ ] `pnpm test` 성공 (최소 절반은 실제 테스트로 채움)
- [ ] `pnpm test:e2e` smoke 통과

## 화면 동작

- [ ] `/inbox` 진입 시 3-column 화면이 보인다
- [ ] thread를 클릭하면 messages가 로드된다
- [ ] customer 정보 패널이 채워진다
- [ ] 메시지를 입력하고 보내면 sending → sent로 전환된다
- [ ] saved view를 클릭하면 URL/state가 복원된다

## scenario별 확인

각 scenario를 직접 실행해보고 화면이 깨지지 않는지 확인하세요.

- [ ] `default`
- [ ] `slow`
- [ ] `empty`
- [ ] `threads-error`
- [ ] `messages-error`
- [ ] `customer-error`
- [ ] `send-failure`
- [ ] `connection-lost`
- [ ] `reconnect-backfill`
- [ ] `duplicate-events`
- [ ] `out-of-order-events`
- [ ] `large-dataset` (스크롤이 멈추지 않을 정도면 ok)

## 문서

- [ ] README의 “주요 구현 TODO”를 본인 구현으로 업데이트
- [ ] PR 본문에 상태 모델 결정 사항을 정리
- [ ] saved view를 localStorage / mock API 중 어느 쪽으로 두었는지와 그 이유 명시

## 마무리

- [ ] `TODO(student)` 주석이 모두 처리되었거나, 의도적으로 남긴 것은 PR 본문에 사유를 적었다
- [ ] console.log 디버그 출력이 남아 있지 않다
- [ ] 큰 fixture가 commit되지 않았다 (large-dataset은 generator로)
