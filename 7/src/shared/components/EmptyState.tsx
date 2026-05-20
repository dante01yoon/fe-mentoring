type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="state">
      <p className="state__title">{title}</p>
      {description ? <p className="state__desc">{description}</p> : null}
    </div>
  );
}
