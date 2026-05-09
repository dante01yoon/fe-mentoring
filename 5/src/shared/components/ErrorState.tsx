import type { ReactNode } from 'react';

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  children?: ReactNode;
};

export function ErrorState({
  title = '오류가 발생했습니다.',
  message,
  onRetry,
  children,
}: ErrorStateProps) {
  return (
    <div className="state state--error" role="alert">
      <p className="state__title">{title}</p>
      {message && <p className="state__desc">{message}</p>}
      {onRetry && (
        <button type="button" className="state__retry" onClick={onRetry}>
          다시 시도
        </button>
      )}
      {children}
    </div>
  );
}
