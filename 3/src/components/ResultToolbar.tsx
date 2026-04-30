import type { CSSProperties } from 'react';

/**
 * ResultToolbar — 결과 요약 + 정렬/페이지크기 컨트롤 (스펙 §7.3)
 *
 * 멘티 TODO:
 *   - 좌측: '검색어' 검색 결과 N건 (totalCount 노출)
 *   - 우측: Sort select, PageSize select
 *   - 변경 시 URL 갱신 + page=1 리셋
 *   - 잘못된 sort/pageSize는 기본값으로 보정됨 (lib/searchParams.ts)
 */
export default function ResultToolbar() {
  return (
    <div style={containerStyle}>
      <div>
        {/* TODO: 검색어 + 결과 개수 */}
        <p style={summaryStyle}>결과 요약 영역 — 구현 필요</p>
      </div>

      <div style={controlsStyle}>
        <label style={labelStyle}>
          Sort{' '}
          <select style={selectStyle} disabled>
            <option>Relevance</option>
          </select>
        </label>
        <label style={labelStyle}>
          PageSize{' '}
          <select style={selectStyle} disabled>
            <option>20</option>
          </select>
        </label>
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '0.5rem 0.75rem',
  border: '1px solid #eee',
  borderRadius: 6,
  background: '#fff',
};

const summaryStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.9rem',
  color: '#444',
};

const controlsStyle: CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  fontSize: '0.85rem',
};

const labelStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  color: '#444',
};

const selectStyle: CSSProperties = {
  padding: '0.3rem 0.5rem',
  border: '1px solid #ccc',
  borderRadius: 4,
};
