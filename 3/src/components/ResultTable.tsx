import type { CSSProperties } from 'react';

/**
 * ResultTable — 검색 결과 테이블 (스펙 §7.5)
 *
 * 멘티 TODO:
 *   - loading / empty / error / success 4가지 상태 모두 구분
 *     * loading : skeleton or spinner
 *     * empty   : "검색 결과가 없습니다"
 *     * error   : 결과 영역만 error UI (facet/Drawer는 영향받지 않음)
 *     * success : 행 클릭 → URL의 itemId 갱신 (Drawer open)
 *   - 표시 컬럼: rank, title, category, price, rating, inStock, tags, score
 *   - “이전 성공 결과를 유지할지 비울지”는 자유 — README에 정책 기재
 */
export default function ResultTable() {
  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Rank</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Category</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Price</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Rating</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Tags</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={8} style={emptyCellStyle}>
              결과 영역 — 구현 필요
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const containerStyle: CSSProperties = {
  border: '1px solid #eee',
  borderRadius: 6,
  background: '#fff',
  overflowX: 'auto',
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.88rem',
};

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '0.6rem 0.75rem',
  borderBottom: '1px solid #eee',
  background: '#fafafa',
  fontWeight: 600,
  color: '#333',
};

const emptyCellStyle: CSSProperties = {
  padding: '2rem 1rem',
  textAlign: 'center',
  color: '#999',
};
