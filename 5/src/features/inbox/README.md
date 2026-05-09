# features/inbox

Inbox 도메인의 모든 코드가 모이는 폴더입니다. scaffold는 각 영역의 “자리”만 잡아두고, 핵심 로직은 모두 `TODO(student)` 주석으로 비워 두었습니다.

## 폴더 구조

```text
features/inbox/
├─ components/   # 화면 컴포넌트 (각 panel + toolbar + composer)
├─ api/          # REST wrapper + queryKey factory
├─ realtime/     # MockRealtimeClient + RealtimeClient interface
├─ hooks/        # useThreads, useThreadMessages, useInboxRealtime, ...
├─ model/        # types / constants / scenario alias
├─ utils/        # eventDedupe, urlState, storageKeys, messageId
└─ __tests__/    # Vitest stub (it.todo)
```

## 멘티가 직접 채워야 하는 핵심 영역

| 위치                         | 무엇을                              |
| ---------------------------- | ----------------------------------- |
| `hooks/useInboxRealtime.ts`  | event → query cache 머지            |
| `utils/eventDedupe.ts`       | duplicate eventId 무시              |
| `components/MessagePanel.tsx`| optimistic update / retry           |
| `components/MessageComposer.tsx` | sending → sent / failed UI flow |
| `utils/urlState.ts`          | URL ↔ InboxFilters 직렬화/파싱      |
| `hooks/useSavedViews.ts`     | saved view CRUD + URL 복원          |

## scaffold가 미리 제공하는 것

- REST API 호출 wrapper (`api/inboxApi.ts`)
- queryKey factory (`api/queryKeys.ts`)
- MockRealtimeClient 가짜 이벤트 emitter
- 도메인 type
- 기본 styling (3-column shell)

상세 챌린지 가이드는 루트의 `challenge/` 디렉터리를 참고하세요.
