import type { CSSProperties, ReactNode } from 'react';

/**
 * FilterPanel — 좌측 필터 영역 (스펙 §7.2)
 *
 * 멘티 TODO:
 *   - facet API에서 받은 카테고리/태그/가격 범위로 옵션 표시
 *   - 필터 변경 시 URL 갱신 + page=1 리셋
 *   - facet API 실패 시 “필터 정보를 불러오지 못했습니다 + retry” UI 표시
 *     단, 검색 결과 테이블은 그대로 유지되어야 함 (부분 실패 분리)
 *   - 잘못된 query 값(예: category=invalid)은 lib/searchParams.ts에서 이미 보정됨
 *
 * 표시할 필터:
 *   - Category (단일 선택)
 *   - Price Range (min / max)
 *   - In Stock (true / false / all)
 *   - Tags (다중 선택)
 */
export default function FilterPanel() {
  return (
    <aside style={asideStyle}>
      <h2 style={h2Style}>Filters</h2>

      <FilterGroup title="Category">
        {/* TODO: facets.categories를 라디오/체크박스로 렌더 */}
        <p style={mutedStyle}>구현 필요</p>
      </FilterGroup>

      <FilterGroup title="Price">
        {/* TODO: minPrice / maxPrice input + apply 버튼 */}
        <p style={mutedStyle}>구현 필요</p>
      </FilterGroup>

      <FilterGroup title="In Stock">
        {/* TODO: 'all' | true | false 라디오 */}
        <p style={mutedStyle}>구현 필요</p>
      </FilterGroup>

      <FilterGroup title="Tags">
        {/* TODO: facets.tags를 체크박스로 렌더, comma-separated로 URL 동기화 */}
        <p style={mutedStyle}>구현 필요</p>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: '1rem' }}>
      <h3 style={h3Style}>{title}</h3>
      {children}
    </section>
  );
}

const asideStyle: CSSProperties = {
  border: '1px solid #eee',
  borderRadius: 6,
  padding: '1rem',
  background: '#fff',
};

const h2Style: CSSProperties = {
  fontSize: '1rem',
  marginTop: 0,
  marginBottom: '0.75rem',
};

const h3Style: CSSProperties = {
  fontSize: '0.85rem',
  margin: '0 0 0.5rem',
  color: '#555',
};

const mutedStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.8rem',
  color: '#999',
};
