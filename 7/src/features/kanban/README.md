# Kanban Feature Notes

이 폴더는 7회차 과제의 핵심 feature 영역입니다.

주의: 이 폴더는 완성 feature가 아닙니다. 기본 렌더링과 타입 연결만 제공하며, DnD/URL/mutation 핵심 로직은 멘티 구현 영역입니다.

## 폴더 책임

| 폴더 | 책임 |
| --- | --- |
| `api/` | fetch wrapper, query key |
| `components/` | 화면 컴포넌트 |
| `dnd/` | @dnd-kit adapter와 drag 전용 컴포넌트 |
| `hooks/` | board query, mutation, URL helper |
| `model/` | 도메인 타입과 상수 |
| `utils/` | 순수 함수. 특히 ordering 계산은 여기서 테스트 |

## 구현 원칙

- drag event 처리와 board ordering 계산을 분리합니다.
- 서버 상태는 TanStack Query cache를 source of truth로 둡니다.
- URL로 복원 가능한 상태만 search params에 넣습니다.
- 실패/충돌 scenario를 먼저 수동으로 재현한 뒤 테스트를 작성합니다.
