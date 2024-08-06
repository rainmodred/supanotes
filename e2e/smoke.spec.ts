import { test, expect } from '@playwright/test';

test('smoke', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(page.getByRole('button', { name: 'Notes' })).toBeVisible();
  await expect(page.getByTestId('loading-tags')).not.toBeVisible();
  await page.getByPlaceholder('Add tag').fill('1');
  await page.getByPlaceholder('Add tag').press('Enter');

  await expect(page.getByRole('button', { name: '1' })).toBeVisible();
  await expect(page.getByTestId('loading')).not.toBeVisible();
});
