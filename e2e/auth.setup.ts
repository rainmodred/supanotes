import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/auth.json';

const user = {
  email: 'joe@example.com',
  password: '123456',
};

setup('authenticate', async ({ page }) => {
  //register
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByPlaceholder('email@example.com').click();
  await page.getByPlaceholder('email@example.com').fill(user.email);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Create an account' }).click();
  await expect(page.getByRole('button', { name: 'Notes' })).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByTestId('loading-tags')).not.toBeVisible();

  //logout
  // await page.getByRole('button').nth(3).click();
  await page
    .locator('div')
    .filter({ hasText: /^Toggle theme$/ })
    .getByRole('button')
    .nth(1)
    .click();

  //login
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('email@example.com').click();
  await page.getByPlaceholder('email@example.com').fill(user.email);
  await page.getByPlaceholder('email@example.com').press('Tab');
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('button', { name: 'Notes' })).toBeVisible();
  await expect(page.getByTestId('loading-tags')).not.toBeVisible({
    timeout: 10000,
  });

  await page.context().storageState({ path: authFile });
});
