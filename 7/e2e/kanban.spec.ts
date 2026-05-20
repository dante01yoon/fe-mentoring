import { expect, test } from '@playwright/test';

test.describe('Kanban board smoke', () => {
  test('renders board columns and cards at /board', async ({ page }) => {
    await page.goto('/board');

    await expect(page.getByRole('heading', { name: 'Kanban Board' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Backlog' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Todo' })).toBeVisible();
    await expect(page.getByTestId('kanban-board')).toBeVisible();
    await expect(page.getByText('보드 필터 URL 동기화')).toBeVisible();
  });

  test.skip('moves a card between columns with pointer drag — TODO(student)', async () => {});
  test.skip('moves a card with keyboard controls — TODO(student)', async () => {});
  test.skip('rolls back the UI in move-failure scenario — TODO(student)', async () => {});
  test.skip('recovers from stale-version conflict — TODO(student)', async () => {});
});
