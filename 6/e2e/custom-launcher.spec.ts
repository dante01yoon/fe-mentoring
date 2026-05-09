import { test, expect } from '@playwright/test';

test('custom launcher opens the widget', async ({ page }) => {
  // TODO(student): implement e2e test
  //   1. navigate to '/'
  //   2. click "Use custom launcher"
  //   3. click the host-side custom-support-launcher
  //   4. assert panel becomes visible
  await page.goto('/');
  await expect(page).toHaveTitle(/Embeddable Support Widget/);
});
