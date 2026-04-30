import SearchBar from '../components/SearchBar';
import SavedViewBar from '../components/SavedViewBar';
import FilterPanel from '../components/FilterPanel';
import ResultToolbar from '../components/ResultToolbar';
import ResultTable from '../components/ResultTable';
import Pagination from '../components/Pagination';
import DetailDrawer from '../components/DetailDrawer';

/**
 * /search — 상품 검색 관리자 콘솔 (단일 라우트)
 *
 * 이 페이지는 “구성 요소 배치만” 잡혀 있습니다.
 * 멘티가 아래 흐름을 직접 설계해야 합니다.
 *
 * ─ 데이터 흐름 ───────────────────────────────────────────────
 * 1. URL ↔ State
 *    - useSearchParams로 URL을 SSOT로 사용
 *    - lib/searchParams.ts의 parse / serialize / mergeAndResetPage / clampPage 활용
 *    - 잘못된 query는 기본값으로 보정 (스펙 §11.3)
 *
 * 2. 서버 상태
 *    - bootstrap (카테고리/정렬옵션 등) — 1회만
 *    - search    (URL state 변화에 반응하여 fetch)
 *    - facets    (search와 비슷하게 fetch, 단 실패해도 결과는 유지)
 *    - detail    (itemId가 있을 때만 fetch)
 *    - 권장: TanStack Query 도입. 직접 구현하면 stale token / AbortController 필요.
 *
 * 3. 비동기 정합성 (스펙 §7.8)
 *    - 빠른 검색어 변경, 응답 순서 꼬임을 방지
 *    - 하나 이상 선택: AbortController / queryKey / sequence id / debounce / latest token
 *
 * 4. 부분 실패 (스펙 §7.9)
 *    - search 성공 + facets 실패 → 결과는 유지, FilterPanel 자체에 error UI
 *    - search 성공 + detail 실패  → 결과는 유지, Drawer 내부에 error UI
 *    - saved view 저장 실패        → 화면 상태 유지, toast/inline error
 *
 * 5. URL Drawer 복원 (스펙 §7.6)
 *    - /search?itemId=p_001로 직접 들어와도 Drawer 열린 상태가 복구되어야 함
 *
 * ─ 권장 구현 순서 ──────────────────────────────────────────────
 * 1) parseSearchParams / serializeSearchState 구현 + 잘못된 URL 보정 동작 확인
 * 2) bootstrap fetch + 정렬/페이지 옵션 표시
 * 3) search fetch + 결과 테이블
 * 4) facet fetch + 좌측 필터 + 부분 실패
 * 5) 페이지네이션 + page clamp
 * 6) detail Drawer + URL 동기화
 * 7) Saved Views 저장/불러오기
 * 8) stale response 방지 전략 적용
 * 9) 테스트 작성 (스펙 §12)
 */
export default function SearchPage() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <SearchBar />
      <SavedViewBar />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '1rem',
          alignItems: 'start',
        }}
      >
        <FilterPanel />

        <section style={{ display: 'grid', gap: '0.75rem' }}>
          <ResultToolbar />
          <ResultTable />
          <Pagination />
        </section>
      </div>

      <DetailDrawer />
    </div>
  );
}
