// Inbox 도메인 타입 정의 모듈
// scaffold 단계에서 멘티가 직접 손대지 않아도 되는 “계약” 영역입니다.
// 다만 필요하면 멘티가 추가 필드를 확장해도 됩니다.

export type Channel = 'web' | 'kakao' | 'email' | 'app';
export type ThreadStatus = 'open' | 'pending' | 'closed';
export type MessageSender = 'customer' | 'agent' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'failed';

export type ConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error';

export type Thread = {
  id: string;
  customerId: string;
  customerName: string;
  channel: Channel;
  status: ThreadStatus;
  assigneeId?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  tags: string[];
};

export type Message = {
  id: string;
  clientId?: string;
  threadId: string;
  sender: MessageSender;
  body: string;
  createdAt: string;
  status?: MessageStatus;
};

export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tags: string[];
  memo?: string;
  createdAt: string;
};

export type Agent = {
  id: string;
  name: string;
  role: 'viewer' | 'operator' | 'admin';
};

export type InboxFilters = {
  query?: string;
  status?: ThreadStatus;
  channel?: Channel;
  assignee?: 'me' | 'unassigned' | string;
  unreadOnly?: boolean;
  sort?: 'latest' | 'unread' | 'oldest';
};

export type SavedView = {
  id: string;
  name: string;
  state: InboxFilters;
  createdAt: string;
};

export type InboxEvent =
  | {
      type: 'message.created';
      eventId: string;
      threadId: string;
      message: Message;
      createdAt: string;
    }
  | {
      type: 'thread.updated';
      eventId: string;
      threadId: string;
      patch: Partial<Thread>;
      createdAt: string;
    }
  | {
      type: 'thread.assigned';
      eventId: string;
      threadId: string;
      assigneeId: string;
      createdAt: string;
    }
  | {
      type: 'connection.lost';
      eventId: string;
      createdAt: string;
    }
  | {
      type: 'connection.restored';
      eventId: string;
      createdAt: string;
    };

// ─── REST 응답 타입 ───────────────────────────────────────────────

export type BootstrapResponse = {
  me: Agent;
  channels: Channel[];
  statuses: ThreadStatus[];
  sortOptions: NonNullable<InboxFilters['sort']>[];
};

export type ListThreadsResponse = {
  items: Thread[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  serverTime: string;
};

export type ListMessagesResponse = {
  threadId: string;
  items: Message[];
  cursor: string | null;
};

export type SendMessageRequest = {
  clientId: string;
  body: string;
};

export type SendMessageResponse = {
  message: Message;
};

export type BackfillEventsResponse = {
  events: InboxEvent[];
  latestEventId: string;
};

export type ListSavedViewsResponse = {
  items: SavedView[];
};

export type CreateSavedViewRequest = {
  name: string;
  state: InboxFilters;
};
