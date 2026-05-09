import { useCallback, useState } from 'react';

/**
 * TODO(student):
 * - threadId별 draft key를 분리하세요. (예: storageKeys.messageDraft(threadId))
 * - 전송 성공 시 draft를 정리하세요.
 * - 새로고침 후 draft 복구 여부를 확인하세요.
 * - 동일 thread를 여러 탭에서 열었을 때 동기화 여부를 정책으로 결정하세요.
 */
export function useMessageDraft(_threadId: string | null): {
  draft: string;
  setDraft: (next: string) => void;
  clear: () => void;
} {
  // 현재는 메모리 기반 placeholder입니다.
  const [draft, setDraftState] = useState<string>('');
  const setDraft = useCallback((next: string) => setDraftState(next), []);
  const clear = useCallback(() => setDraftState(''), []);
  return { draft, setDraft, clear };
}
