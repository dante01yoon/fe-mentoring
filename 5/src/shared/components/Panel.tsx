import type { ReactNode } from 'react';

type PanelProps = {
  title?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function Panel({ title, actions, children, className }: PanelProps) {
  return (
    <section className={`panel ${className ?? ''}`}>
      {(title || actions) && (
        <header className="panel__header">
          {title && <h2 className="panel__title">{title}</h2>}
          {actions && <div className="panel__actions">{actions}</div>}
        </header>
      )}
      <div className="panel__body">{children}</div>
    </section>
  );
}
