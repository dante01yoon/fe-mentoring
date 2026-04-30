import type { CSSProperties } from 'react';

/**
 * SavedViewBar — Saved View 선택/저장 (스펙 §7.7)
 *
 * 멘티 TODO:
 *   - 현재 검색 조건을 SavedViewState로 추출 (page는 제외 권장)
 *   - 저장: 이름 입력 → localStorage 또는 mock API에 추가
 *   - 선택: 저장된 view를 dropdown으로 노출 → 클릭 시 URL state 복원
 *   - 저장 실패 시 toast 또는 inline error (스펙 §7.9-3)
 *   - 저장 위치(localStorage vs API) 결정 후 README에 이유 기록
 *
 * 구현 힌트:
 *   - localStorage 방식: lib/storage.ts의 loadSavedViewsFromLocal/saveSavedViewsToLocal 사용
 *   - mock API 방식    : lib/api.ts의 listSavedViews/createSavedView 사용
 */
export default function SavedViewBar() {
  return (
    <div style={containerStyle}>
      <label style={labelStyle}>
        Saved Views{' '}
        <select style={selectStyle} disabled>
          <option>저장된 뷰가 없습니다</option>
        </select>
      </label>
      <button type="button" style={buttonStyle}>
        Save current view
      </button>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
  padding: '0.5rem 0.75rem',
  border: '1px dashed #ddd',
  borderRadius: 6,
  background: '#fafafa',
  fontSize: '0.85rem',
};

const labelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#444',
};

const selectStyle: CSSProperties = {
  padding: '0.35rem 0.5rem',
  border: '1px solid #ccc',
  borderRadius: 4,
};

const buttonStyle: CSSProperties = {
  padding: '0.4rem 0.75rem',
  border: '1px solid #999',
  borderRadius: 4,
  background: '#fff',
  cursor: 'pointer',
  marginLeft: 'auto',
};
