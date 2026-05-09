import { test, expect } from '@playwright/test';

test('widget state survives host route simulation', async ({ page }) => {
  // TODO(student): implement e2e test
  //   1. navigate to '/'
  //   2. boot member, show panel, navigate to messages
  //   3. click "Simulate host route change"
  //   4. assert that the widget panel and route state are preserved
  await page.goto('/');
  await expect(page).toHaveTitle(/Embeddable Support Widget/);
});
