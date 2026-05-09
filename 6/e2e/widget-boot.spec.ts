import { test, expect } from '@playwright/test';

test('widget can boot and show on demo host page', async ({ page }) => {
  // TODO(student): implement e2e test
  //   1. navigate to '/'
  //   2. click "Boot anonymous"
  //   3. assert that the widget DOM is visible
  //   4. click "Show"
  //   5. assert panel is shown
  await page.goto('/');
  await expect(page).toHaveTitle(/Embeddable Support Widget/);
});
