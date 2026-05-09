import type { ReactNode } from 'react';

type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  title = '표시할 내용이 없습니다.',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="state state--empty" role="status">
      <p className="state__title">{title}</p>
      {description && <p className="state__desc">{description}</p>}
      {action && <div className="state__action">{action}</div>}
    </div>
  );
}
