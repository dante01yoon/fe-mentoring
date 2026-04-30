import type { CSSProperties } from 'react';

/**
 * DetailDrawer — 상품 상세 우측 패널 (스펙 §7.6)
 *
 * 멘티 TODO:
 *   - URL의 itemId가 있을 때만 렌더 (없으면 null 반환)
 *   - itemId가 바뀌면 api.getProductDetail(id, q) 호출
 *   - loading / error / success 3가지 상태 (목록은 영향 X)
 *   - 닫기 동작: URL에서 itemId 제거 (다른 query는 유지)
 *   - /search?itemId=p_001로 직접 들어오면 Drawer가 열린 상태로 복구되어야 함
 *   - 상세 fetch 실패해도 Drawer 외부(목록/필터)는 정상 유지
 *
 * 구현 힌트:
 *   - 검색어 q를 함께 보내면 mock 서버가 matchedKeywords를 채워줍니다.
 *   - 빠른 itemId 변경에서도 stale response를 막아야 합니다 (AbortController 권장).
 */
export default function DetailDrawer() {
  // TODO: URL의 itemId 읽기, 없으면 return null;
  const isOpen = false;
  if (!isOpen) return null;

  return (
    <aside style={overlayStyle}>
      <div style={panelStyle}>
        <header style={headerStyle}>
          <h2 style={titleStyle}>Product Detail</h2>
          <button type="button" style={closeButtonStyle}>
            Close
          </button>
        </header>
        <div style={bodyStyle}>
          {/* TODO: detail.title, matchedKeywords, rankingReasons, updatedAt 등 표시 */}
          <p>상세 영역 — 구현 필요</p>
        </div>
      </div>
    </aside>
  );
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.25)',
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 100,
};

const panelStyle: CSSProperties = {
  width: 360,
  background: '#fff',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  borderBottom: '1px solid #eee',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1rem',
};

const closeButtonStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

const bodyStyle: CSSProperties = {
  padding: '1rem',
  overflowY: 'auto',
  flex: 1,
};
