/**
 * TODO(student):
 * - realtime client connection status를 연결하세요.
 * - reconnect 후 backfill 진행 상태를 사용자에게 보여주세요.
 * - disconnected 상태가 너무 길어질 때 사용자가 수동 retry할 수 있도록 하세요.
 */
export function ConnectionStatusBanner() {
  // 현재는 idle 상태 placeholder만 표시합니다.
  return (
    <div className="connection-banner connection-banner--idle" role="status">
      Realtime: idle (TODO: useInboxRealtime 연결)
    </div>
  );
}
