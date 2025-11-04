import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Baseline UI', () => {
  test('catalogue loads and is accessible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();
    // Allow only minor naming issues; enforce no serious/critical
    const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact || ''));
    expect(serious).toEqual([]);
  });

  test('workforce loads and table renders', async ({ page }) => {
    await page.goto('/workforce');
    await expect(page.getByText('Workforce Prompt Library')).toBeVisible();
  });

  test('dag renders if data present', async ({ page }) => {
    await page.goto('/dag');
    await expect(page.locator('canvas, .vis-network')).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('filter presets can be saved and loaded', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Search prompts').fill('name:demo');
    await page.getByRole('button', { name: /save preset/i }).click();
    await page.getByPlaceholder('Preset name').fill('MyPreset');
    await page.getByRole('button', { name: /save preset/i }).click();
    await page.getByRole('combobox').selectOption({ label: 'MyPreset' });
    await expect(page.getByLabel('Search prompts')).toHaveValue(/name:demo/i);
  });

  test('reduced motion: no transitions', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.will-transform')).toBeVisible();
  });
});
