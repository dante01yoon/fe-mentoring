export function formatDueDate(value?: string): string {
  if (!value) return 'No due date';
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
