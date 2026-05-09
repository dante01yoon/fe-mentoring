import { expect, test } from '@playwright/test';

test.describe('Inbox console smoke', () => {
  test('renders 3-column shell at /inbox', async ({ page }) => {
    await page.goto('/inbox');

    // 3 panel placeholder가 모두 보여야 합니다.
    await expect(page.getByText('Threads')).toBeVisible();
    await expect(page.getByText('Messages')).toBeVisible();
    await expect(page.getByText('Customer')).toBeVisible();

    // thread list / message panel placeholder 텍스트
    await expect(page.getByText('스레드 목록 placeholder')).toBeVisible();
    await expect(page.getByText('스레드를 선택하세요')).toBeVisible();
  });

  // 깊은 동작은 멘티가 채워 넣어야 합니다.
  test.skip('searches threads and selects one — TODO(student)', async () => {});
  test.skip('sends a message with optimistic update — TODO(student)', async () => {});
  test.skip('shows reconnect backfill banner — TODO(student)', async () => {});
});
