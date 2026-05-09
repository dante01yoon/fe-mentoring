# Review Checklist

멘토가 멘티에게 묻는 질문 목록.
멘티는 PR description / README 에서 이 질문에 직접 답할 수 있어야 합니다.

- global namespace 를 하나만 쓰도록 보장했나요?
- boot 이전 show 호출을 어떻게 처리했나요?
- duplicate boot 호출 시 정책은 무엇인가요?
- shutdown 시 어떤 DOM과 listener 를 정리했나요?
- Shadow DOM과 iframe 중 무엇을 선택했고 이유는 무엇인가요?
- host CSS 가 위젯을 깨뜨리지 못하게 어떻게 막았나요?
- custom launcher 가 제거되면 어떻게 되나요?
- SPA route 변경 후 state 를 어떻게 유지했나요?
- anonymous user 와 member user 의 boot 흐름은 어떻게 다른가요?
- track 이 실패해도 사용자 경험에 영향을 주지 않나요?

## 추가로 확인할 만한 것

- 같은 SDK 가 두 번 로드되었을 때 어떤 일이 일어나나요?
- localStorage 가 차단된 환경에서 boot 가 깨지지 않나요?
- 에러 발생 시 host 페이지의 onerror / window error 를 오염시키지 않나요?
- timer / interval 이 shutdown 이후에도 살아 있지 않나요?
