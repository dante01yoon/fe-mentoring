# API 계약

모든 응답은 JSON. base prefix는 `/api/inbox`.

## GET /api/inbox/bootstrap

```json
{
  "me": { "id": "agent_001", "name": "Mentor Agent", "role": "operator" },
  "channels": ["web", "kakao", "email", "app"],
  "statuses": ["open", "pending", "closed"],
  "sortOptions": ["latest", "unread", "oldest"]
}
```

## GET /api/inbox/threads

Query: `query`, `status`, `channel`, `assignee`, `unreadOnly`, `sort`, `page`, `pageSize`.

```json
{
  "items": [
    {
      "id": "t_001",
      "customerId": "c_001",
      "customerName": "Customer 1",
      "channel": "web",
      "status": "open",
      "assigneeId": "agent_002",
      "lastMessage": "환불 절차가 어떻게 되나요?",
      "lastMessageAt": "2026-05-07T10:00:00.000Z",
      "unreadCount": 3,
      "tags": ["refund"]
    }
  ],
  "page": 1,
  "pageSize": 30,
  "totalCount": 30,
  "totalPages": 1,
  "serverTime": "2026-05-07T10:00:00.000Z"
}
```

## GET /api/inbox/threads/:threadId/messages

```json
{
  "threadId": "t_001",
  "items": [
    {
      "id": "t_001_m_001",
      "threadId": "t_001",
      "sender": "customer",
      "body": "안녕하세요. 환불 가능한가요?",
      "createdAt": "2026-05-07T09:55:00.000Z",
      "status": "sent"
    }
  ],
  "cursor": null
}
```

## POST /api/inbox/threads/:threadId/messages

Request:

```json
{ "clientId": "client_123", "body": "확인 후 안내드리겠습니다." }
```

Response:

```json
{
  "message": {
    "id": "m_999",
    "clientId": "client_123",
    "threadId": "t_001",
    "sender": "agent",
    "body": "확인 후 안내드리겠습니다.",
    "createdAt": "2026-05-07T10:00:00.000Z",
    "status": "sent"
  }
}
```

`send-failure` scenario에서는 500을 반환합니다.

## GET /api/inbox/customers/:customerId

```json
{
  "id": "c_001",
  "name": "김민준",
  "email": "c_001@example.com",
  "phone": "010-1234-1000",
  "tags": ["vip"],
  "memo": "재방문 고객",
  "createdAt": "2025-01-01T09:00:00.000Z"
}
```

`customer-error` scenario에서는 500을 반환합니다.

## GET /api/inbox/events?after=evt_001

```json
{
  "events": [],
  "latestEventId": "evt_010"
}
```

`reconnect-backfill` scenario에서만 실제 이벤트를 반환합니다. 그 외 scenario에서는 빈 배열을 반환합니다.

## GET /api/inbox/saved-views / POST / DELETE

```json
{
  "items": [
    {
      "id": "view_001",
      "name": "내 미답변",
      "state": { "assignee": "me", "status": "open", "unreadOnly": true, "sort": "latest" },
      "createdAt": "2026-05-01T09:00:00.000Z"
    }
  ]
}
```

POST 본문:

```json
{ "name": "내 VIP", "state": { "query": "vip" } }
```

DELETE: `/api/inbox/saved-views/:id`.

## 에러 응답 모양

```json
{ "message": "메시지 전송에 실패했습니다." }
```
