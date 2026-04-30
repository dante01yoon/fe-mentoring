import type { CSSProperties } from 'react';

/**
 * SearchBar — 검색어 입력 (스펙 §7.1)
 *
 * 멘티 TODO:
 *   - input value(타이핑 중) ↔ URL의 q(검색에 실제 사용) 분리 권장 (방식 A)
 *   - Enter 키 또는 Search 버튼 클릭 시 URL의 q를 갱신하고 page를 1로 초기화
 *   - URL의 q가 외부에서 바뀌면 (saved view 클릭, 뒤로가기) input에도 반영
 *
 * 권장 컴포넌트 인터페이스:
 *   - 자체적으로 useSearchParams를 읽고 쓰거나,
 *   - 부모(SearchPage)에서 SearchUrlState와 setter를 props로 내려주거나,
 *   - 둘 다 가능. 어느 쪽이든 README state-model에 “SSOT는 URL”이라는 점을 명시하세요.
 */
export default function SearchBar() {
  return (
    <div style={containerStyle}>
      <input
        type="search"
        placeholder="상품명을 검색하세요"
        style={inputStyle}
        // TODO: value, onChange, onKeyDown
      />
      <button type="button" style={buttonStyle}>
        Search
      </button>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
};

const inputStyle: CSSProperties = {
  flex: 1,
  padding: '0.55rem 0.75rem',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: '0.95rem',
};

const buttonStyle: CSSProperties = {
  padding: '0.55rem 1rem',
  border: 'none',
  borderRadius: 6,
  background: '#333',
  color: '#fff',
  cursor: 'pointer',
};
