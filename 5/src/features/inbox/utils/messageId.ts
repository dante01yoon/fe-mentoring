// optimistic message용 client id 생성기.
// scaffold에서는 단순한 구현을 제공하지만 멘티가 충돌 가능성을 검토해도 좋습니다.

let _counter = 0;

export function createClientMessageId(): string {
  _counter += 1;
  const seq = _counter.toString(36);
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `client_${ts}_${seq}_${rand}`;
}
