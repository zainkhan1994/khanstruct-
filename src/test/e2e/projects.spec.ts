import { test, expect } from '@playwright/test';

test.describe('Projects Pages', () => {
  test('projects index loads', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle(/Projects|Khanstruct/);
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('project cards are listed', async ({ page }) => {
    await page.goto('/projects');
    const cards = page.locator('article[role="listitem"]');
    await expect(cards).not.toHaveCount(0);
  });

  test('clicking a project card navigates to detail', async ({ page }) => {
    await page.goto('/projects');
    const firstCard = page.locator('article[role="listitem"]').first();
    const link = firstCard.locator('a');
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^\/projects\//);

    await link.click();
    await page.waitForLoadState('domcontentloaded');
    const url = page.url();
    expect(url).toContain('/projects/');
  });

  test('project detail has back navigation', async ({ page }) => {
    await page.goto('/projects/cortana-ai-agent');
    const back = page.locator('a:has-text("All Projects")');
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/projects');
  });

  test('project detail has next project link', async ({ page }) => {
    await page.goto('/projects/cortana-ai-agent');
    const next = page.locator('a:has-text("Next Project")').or(
      page.locator('.next')
    );
    await expect(next.first()).toBeAttached();
  });

  test('404 on unknown project slug', async ({ page }) => {
    const response = await page.goto('/projects/not-a-real-project-slug-xyz');
    expect(response?.status()).toBe(404);
  });
});
