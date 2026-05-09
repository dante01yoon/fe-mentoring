/**
 * TODO(student):
 * - useMessageDraft(threadId)로 입력 상태를 관리하세요.
 * - 전송 버튼 클릭 시 optimistic message를 생성하고 inboxApi.sendMessage 호출.
 * - 실패 시 retry 가능 UI를 보여주세요.
 * - thread를 바꾸는 도중 sending 메시지의 운명을 결정하세요.
 *   (대기열에 둘지, 취소할지)
 */
export function MessageComposer() {
  return (
    <form
      className="composer"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO(student): optimistic update + sendMessage mutation 연결
      }}
    >
      <textarea
        className="composer__input"
        placeholder="메시지를 입력하세요 (TODO: draft 연결)"
        aria-label="Message body"
      />
      <button type="submit" className="composer__send">
        보내기
      </button>
    </form>
  );
}
