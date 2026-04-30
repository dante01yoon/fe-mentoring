import type { CSSProperties } from 'react';

/**
 * Pagination — 페이지 이동 (스펙 §7.4)
 *
 * 멘티 TODO:
 *   - page / pageSize / totalPages를 props 또는 URL state에서 읽기
 *   - page 변경 시 URL 갱신 (다른 검색 조건은 유지)
 *   - 응답으로 받은 totalPages가 줄어든 경우 page를 보정 (lib/searchParams.ts의 clampPage 사용)
 *   - 보정 정책(마지막 유효 page vs 1)은 README에 명시
 *   - 첫/마지막 페이지에서는 prev/next 비활성화
 */
export default function Pagination() {
  return (
    <nav aria-label="pagination" style={containerStyle}>
      {/* TODO: 동적 렌더링 */}
      <button type="button" style={buttonStyle} disabled>
        ‹
      </button>
      <span style={pageStyle}>1</span>
      <button type="button" style={buttonStyle} disabled>
        ›
      </button>
    </nav>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem 0',
};

const buttonStyle: CSSProperties = {
  padding: '0.35rem 0.6rem',
  border: '1px solid #ccc',
  borderRadius: 4,
  background: '#fff',
  cursor: 'pointer',
};

const pageStyle: CSSProperties = {
  fontSize: '0.9rem',
  minWidth: '2rem',
  textAlign: 'center',
};
