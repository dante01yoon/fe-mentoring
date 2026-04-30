import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div
      style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: '1.5rem 1rem 4rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', margin: 0 }}>
          Product Search Admin Console
        </h1>
        <p style={{ color: '#666', marginTop: '0.25rem', fontSize: '0.85rem' }}>
          상품 카탈로그 검색 / 필터 / 정렬 / 상세 조회 (mock 서버 기반)
        </p>
      </header>
      <Outlet />
    </div>
  );
}
