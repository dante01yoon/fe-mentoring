import type { ConnectionStatus, InboxEvent } from '../model/types';

export type RealtimeUnsubscribe = () => void;

export type RealtimeClient = {
  connect(): void;
  disconnect(): void;
  getStatus(): ConnectionStatus;
  subscribe(callback: (event: InboxEvent) => void): RealtimeUnsubscribe;
};
