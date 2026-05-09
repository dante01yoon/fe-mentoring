/**
 * TODO(student):
 * - 검색 input을 URL state(query)와 양방향 바인딩하세요.
 * - 채널/상태/담당자/unreadOnly 필터를 추가하세요.
 * - 정렬 옵션을 노출하세요.
 * - debounce 정책을 결정하세요.
 */
export function InboxToolbar() {
  return (
    <div className="toolbar" role="toolbar" aria-label="Inbox toolbar">
      <input
        type="search"
        className="toolbar__search"
        placeholder="검색 (TODO: URL state 연결)"
        aria-label="Search threads"
      />
      <div className="toolbar__filters">
        <span className="toolbar__hint">필터 placeholder — TODO(student)</span>
      </div>
    </div>
  );
}
