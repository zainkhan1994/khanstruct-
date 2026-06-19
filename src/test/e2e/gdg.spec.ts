import { test, expect } from '@playwright/test';

test.describe('GDG Tulsa Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gdg-tulsa');
    await page.waitForLoadState('domcontentloaded');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/GDG Tulsa|Khanstruct/);
  });

  test('has back to home link', async ({ page }) => {
    const back = page.locator('a:has-text("Back to Home")');
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/');
  });

  test('has GDG hero heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('GDG Tulsa');
  });

  test('has Join Our Community button', async ({ page }) => {
    const cta = page.locator('a:has-text("Join Our Community")').first();
    await expect(cta).toBeVisible();
  });

  test('Mission section is present', async ({ page }) => {
    const mission = page.locator('#mission-heading').or(
      page.locator('h2:has-text("Mission")')
    );
    await expect(mission.first()).toBeAttached();
  });

  test('events section shows empty state or events', async ({ page }) => {
    await page.locator('#events').scrollIntoViewIfNeeded();
    const section = page.locator('#events');
    await expect(section).toBeVisible();
  });

  test('no horizontal overflow', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
