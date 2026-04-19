import { useNavigate } from 'react-router-dom';
import { STEPS } from '../lib/steps';
import type { StepPath } from '../lib/steps';

interface StepNavigationProps {
  current: StepPath;
  /** 다음 버튼 비활성화 여부 — 멘티가 validation 연결할 자리 */
  disableNext?: boolean;
  /** 다음 버튼 클릭 전 실행할 콜백 (예: draft 저장, validation) */
  onBeforeNext?: () => boolean | void;
  /** 다음 버튼 라벨 override (예: "결제하기") */
  nextLabel?: string;
}

export default function StepNavigation({
  current,
  disableNext = false,
  onBeforeNext,
  nextLabel,
}: StepNavigationProps) {
  const navigate = useNavigate();
  const currentIndex = STEPS.findIndex((s) => s.path === current);
  const prev = currentIndex > 0 ? STEPS[currentIndex - 1] : null;
  const next = currentIndex < STEPS.length - 1 ? STEPS[currentIndex + 1] : null;

  const handleNext = () => {
    if (onBeforeNext) {
      const result = onBeforeNext();
      if (result === false) return;
    }
    if (next) navigate(next.path);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #eee',
      }}
    >
      {prev ? (
        <button
          type="button"
          onClick={() => navigate(prev.path)}
          style={{
            padding: '0.6rem 1.2rem',
            border: '1px solid #ccc',
            borderRadius: 6,
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          ← {prev.label}
        </button>
      ) : (
        <span />
      )}

      {next && (
        <button
          type="button"
          onClick={handleNext}
          disabled={disableNext}
          style={{
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: 6,
            background: disableNext ? '#ccc' : '#333',
            color: '#fff',
            cursor: disableNext ? 'not-allowed' : 'pointer',
          }}
        >
          {nextLabel ?? next.label} →
        </button>
      )}
    </div>
  );
}
