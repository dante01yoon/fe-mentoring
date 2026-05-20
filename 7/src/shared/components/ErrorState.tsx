type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="state state--error">
      <p className="state__title">{title}</p>
      {description ? <p className="state__desc">{description}</p> : null}
      {onRetry ? (
        <button className="state__retry" type="button" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
