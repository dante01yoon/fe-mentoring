import { Outlet, useLocation } from 'react-router-dom';
import { STEPS } from '../lib/steps';

export default function Layout() {
  const { pathname } = useLocation();
  const currentStep = STEPS.find((s) => s.path === pathname);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* ── Step Indicator ─────────────────────────────────
       *  TODO: 멘티가 직접 구현
       *  - 현재 step 하이라이트
       *  - 완료된 step 표시
       *  - 클릭으로 이전 step 이동 (선택)
       * ──────────────────────────────────────────────────── */}
      <nav style={{ marginBottom: '2rem' }}>
        <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', padding: 0, fontSize: '0.85rem' }}>
          {STEPS.map((step) => (
            <li
              key={step.path}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: 4,
                background: step.path === pathname ? '#333' : '#eee',
                color: step.path === pathname ? '#fff' : '#666',
              }}
            >
              {step.label}
            </li>
          ))}
        </ol>
      </nav>

      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        {currentStep?.label ?? 'Checkout'}
      </h1>

      <Outlet />
    </div>
  );
}
