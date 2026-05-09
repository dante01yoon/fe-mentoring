type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = '불러오는 중…' }: LoadingStateProps) {
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      {label}
    </div>
  );
}
