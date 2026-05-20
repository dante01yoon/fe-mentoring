import { describe, it } from 'vitest';

describe('move rollback', () => {
  it.todo('optimistically moves a card before the PATCH request resolves');
  it.todo('restores the previous board snapshot when PATCH fails');
  it.todo('shows a conflict recovery UI on stale-version 409 responses');
});
