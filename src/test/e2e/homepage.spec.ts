import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Khanstruct/);
  });

  test('has skip to main content link', async ({ page }) => {
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toBeAttached();
  });

  test('header is visible', async ({ page }) => {
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();
  });

  test('hero section is visible', async ({ page }) => {
    const hero = page.locator('section[aria-label="Hero"]');
    await expect(hero).toBeVisible();
  });

  test('hero has Work With Me CTA', async ({ page }) => {
    const cta = page.locator('a:has-text("Work With Me")').first();
    await expect(cta).toBeVisible();
  });

  test('navigation has all required links', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Primary navigation"]');
    await expect(nav).toBeVisible();
    await expect(nav.locator('a:has-text("Home")')).toBeVisible();
    await expect(nav.locator('a:has-text("Services")')).toBeVisible();
    await expect(nav.locator('a:has-text("Projects")')).toBeVisible();
    await expect(nav.locator('a:has-text("GDG Tulsa")')).toBeVisible();
  });

  test('services section is present', async ({ page }) => {
    await page.locator('#services').scrollIntoViewIfNeeded();
    const services = page.locator('#services');
    await expect(services).toBeVisible();
  });

  test('no horizontal overflow', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('footer is visible', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();
  });

  test('contact section opens the message panel', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    const trigger = page.getByRole('button', { name: 'Open the message panel' });
    await expect(trigger).toBeVisible();
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('textbox', { name: 'Message' })).toBeVisible();
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Filter out known non-critical warnings
    const criticalErrors = errors.filter(
      (e) => !e.includes('WebGL') && !e.includes('GSAP') && !e.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Homepage — Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('header shows hamburger menu on mobile', async ({ page }) => {
    await page.goto('/');
    const menuBtn = page.locator('button[aria-label*="menu" i]').or(
      page.locator('button[aria-expanded]')
    );
    await expect(menuBtn).toBeVisible();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.goto('/');
    const menuBtn = page.locator('button[aria-expanded]');
    await menuBtn.click();
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toHaveAttribute('aria-hidden', 'false');

    await menuBtn.click();
    await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.goto('/');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});
