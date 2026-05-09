import type { ConnectionStatus, InboxEvent } from '../model/types';
import type { RealtimeClient, RealtimeUnsubscribe } from './RealtimeClient';
import {
  DUPLICATE_EVENTS,
  NORMAL_EVENTS,
  OUT_OF_ORDER_EVENTS,
} from '../../../mocks/fixtures/events';
import { getScenario } from '../../../mocks/scenarios';

/**
 * MockRealtimeClient
 *
 * 실제 WebSocket 서버가 없는 가짜 realtime adapter입니다.
 * scenario flag에 따라 NORMAL / DUPLICATE / OUT_OF_ORDER / connection lost / restored 이벤트를 emit합니다.
 *
 * scaffold 단계에서 멘티가 손대야 하는 부분은 “이벤트 → query cache” 병합 로직이며,
 * 이 클래스 자체는 단순히 emit만 합니다.
 */
export class MockRealtimeClient implements RealtimeClient {
  private listeners = new Set<(event: InboxEvent) => void>();
  private status: ConnectionStatus = 'idle';
  private timers: ReturnType<typeof setTimeout>[] = [];

  connect(): void {
    if (this.status === 'connected' || this.status === 'connecting') return;
    this.status = 'connecting';
    const t = setTimeout(() => {
      this.status = 'connected';
      this.runScenario();
    }, 200);
    this.timers.push(t);
  }

  disconnect(): void {
    this.status = 'disconnected';
    for (const t of this.timers) clearTimeout(t);
    this.timers = [];
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  subscribe(callback: (event: InboxEvent) => void): RealtimeUnsubscribe {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // ─── internal ───────────────────────────────────────────────

  private emit(event: InboxEvent): void {
    for (const l of this.listeners) l(event);
  }

  private schedule(delayMs: number, fn: () => void): void {
    const t = setTimeout(fn, delayMs);
    this.timers.push(t);
  }

  private runScenario(): void {
    const scenario = getScenario();

    switch (scenario) {
      case 'duplicate-events': {
        DUPLICATE_EVENTS.forEach((e, i) => {
          this.schedule(500 + i * 400, () => this.emit(e));
        });
        return;
      }
      case 'out-of-order-events': {
        OUT_OF_ORDER_EVENTS.forEach((e, i) => {
          this.schedule(500 + i * 400, () => this.emit(e));
        });
        return;
      }
      case 'connection-lost': {
        this.schedule(800, () => {
          this.status = 'disconnected';
          this.emit({
            type: 'connection.lost',
            eventId: `evt_conn_lost_${Date.now()}`,
            createdAt: new Date().toISOString(),
          });
        });
        return;
      }
      case 'reconnect-backfill': {
        this.schedule(800, () => {
          this.status = 'reconnecting';
          this.emit({
            type: 'connection.lost',
            eventId: `evt_conn_lost_${Date.now()}`,
            createdAt: new Date().toISOString(),
          });
        });
        this.schedule(2_500, () => {
          this.status = 'connected';
          this.emit({
            type: 'connection.restored',
            eventId: `evt_conn_restored_${Date.now()}`,
            createdAt: new Date().toISOString(),
          });
        });
        return;
      }
      case 'default':
      case 'slow':
      default: {
        NORMAL_EVENTS.forEach((e, i) => {
          this.schedule(800 + i * 600, () => this.emit(e));
        });
      }
    }
  }
}
