# Overview

이 과제는 채팅 UI를 예쁘게 만드는 과제가 아닙니다.
외부 웹페이지에 삽입되는 SDK의 public API, lifecycle, isolation, cleanup을 설계할 수 있는지 보는 과제입니다.

---

## 멘티가 만드는 것

- script 한 줄로 host 페이지에 삽입되는 고객지원 위젯 SDK
- 진입점은 `window.SupportWidget` 하나
- 외부에 노출되는 메서드: `boot / shutdown / show / hide / track`

## 멘티가 검증해야 하는 것

- host 페이지의 글로벌 CSS / JS 환경에서도 위젯이 깨지지 않는가?
- boot 와 shutdown 이 host 페이지를 오염시키지 않는가?
- anonymous / member / 다양한 실패 시나리오에서 위젯이 안전하게 동작하는가?
- SPA host 가 라우트를 바꿔도 위젯 상태가 유지되거나 적절히 재동기화되는가?
- 같은 위젯을 다시 boot 했을 때 idempotent 한가?

## 평가 우선순위

```
SDK 표면 설계      ★★★★★
lifecycle 안전성   ★★★★★
host 환경 격리     ★★★★★
DOM/Event 기본기   ★★★★
cleanup            ★★★★
테스트 가능성      ★★★
문서화             ★★
```
