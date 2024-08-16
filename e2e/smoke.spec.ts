import { test, expect } from '@playwright/test';

test('smoke', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(page.getByRole('button', { name: 'Notes' })).toBeVisible();
  await expect(page.getByTestId('loading-tags')).not.toBeVisible();
  await page.getByPlaceholder('Add tag').fill('Malazan');
  await page.getByPlaceholder('Add tag').press('Enter');

  await expect(page.getByRole('button', { name: 'Malazan' })).toBeVisible();
  await expect(page.getByTestId('loading')).not.toBeVisible();

  //create note
  await page.getByTestId('create-note').click();
  await expect(page.getByTestId('create-note')).toBeVisible();
  await page.getByPlaceholder('title').fill('Malazan');
  await page.getByRole('button', { name: 'Create Note' }).click();
  await expect(page.getByRole('link', { name: 'Malazan' })).toBeVisible();

  //rename note
  await page.getByPlaceholder('title').click();
  await page.getByPlaceholder('title').fill('Gardens of the Moon');
  await expect(
    page.getByRole('link', { name: 'Gardens of the Moon' }),
  ).toBeVisible();

  //fill note
  await page.getByTestId('codemirror').getByRole('textbox').click();
  await page.getByTestId('codemirror').getByRole('textbox').fill('Some notes');

  //add tag
  await page.getByPlaceholder('Tags...').click();
  await page.getByRole('option', { name: 'Malazan' }).click();

  //create tag
  await page.getByPlaceholder('Tags...').click();
  await page.getByPlaceholder('Tags...').fill('Fantasy');
  await page.getByPlaceholder('Tags...').press('Enter');

  await expect(page.getByRole('button', { name: 'Fantasy' })).toBeVisible();

  await page.getByPlaceholder('Tags...').click();
  await page.getByPlaceholder('Tags...').fill('To Read');
  await page.getByPlaceholder('Tags...').press('Enter');

  await expect(page.getByRole('button', { name: 'To Read' })).toBeVisible();

  //delete tag
  await page.getByTestId('edit-To Read').click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByRole('button', { name: 'To Read' })).not.toBeVisible();

  // await expect(
  //   page.locator('div').filter({ hasText: /^To Read$/ }),
  // ).not.toBeVisible();

  //create another note
  await page.getByTestId('create-note').click();
  await page.getByPlaceholder('title').click();
  await page.getByPlaceholder('title').fill('Deadhouse Gates');
  await page.getByPlaceholder('title').press('Enter');

  await expect(
    page.getByRole('link', { name: 'Deadhouse Gates' }),
  ).toBeVisible();

  //search note

  await page.getByPlaceholder('Search note').click();
  await page.getByPlaceholder('Search note').fill('Gardens');

  await expect(
    page.getByRole('link', { name: 'Gardens of the Moon' }),
  ).toBeVisible();

  await expect(
    page.getByRole('link', { name: 'Deadhouse Gates' }),
  ).not.toBeVisible();

  //delete note
  await page.getByRole('link', { name: 'Gardens of the Moon' }).click();
  await page.getByTestId('delete-note').click();
  await page.getByRole('button', { name: 'Confirm' }).click();

  await expect(
    page.getByRole('link', { name: 'Gardens of the Moon' }),
  ).not.toBeVisible();
});
