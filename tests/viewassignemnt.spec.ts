import { test, expect } from '@playwright/test';

const baseUrl = process.env.BASE_URL;
const username = process.env.APP_USER;
const password = process.env.APP_PASSWORD;
const assignmentTitle = process.env.ASSIGNMENT_TITLE;
const resultTimestamp = process.env.RESULT_TIMESTAMP;

test('View Assignment', async ({ page }) => {
  if (!baseUrl || !username || !password || !assignmentTitle || !resultTimestamp) throw new Error('Set BASE_URL, APP_USER, APP_PASSWORD, ASSIGNMENT_TITLE, RESULT_TIMESTAMP (see .env.example)');
  test.setTimeout(120000);

  // Login
  await page.goto(`${baseUrl}/login`);

  await page.getByText('Log in with password').click();

  await page.getByRole('textbox', { name: 'Email address' }).fill(username);

  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait until redirected to Team Manager
  await page.waitForURL('**/team_manager/**', {
    timeout: 60000
  });

  //await page.waitForLoadState('networkidle');

  // Open My Teams
  await page.getByRole('button', { name: 'My Teams' }).click();

  // Open Assignments
  await page.getByRole('link', { name: 'Assignments' }).click();

  await page.waitForLoadState('networkidle');

  // Open Assignment Status dropdown
await page.locator("//qai-searchable-select[1]//button[1]//span[2]//qai-icon[1]//*[name()='svg']").click();
await page.getByRole('button', { name: 'Deselect all' }).click();
//await page.getByText('Completed', { exact: true }).click();


// Select Completed
await page.locator('button')
  .filter({ hasText: 'Completed' })
  .first()
  .click();

await page.waitForLoadState('networkidle');

// Click the assignment title first
await page.getByText(
  assignmentTitle
).click();

await page.waitForTimeout(2000);

// Now click View Assignment
await page.getByRole('link', {
  name: `View assignment for ${assignmentTitle} 2026`,
  exact: true
}).click();

await page.waitForLoadState('networkidle');

// View Previous Results
await page.getByRole('button', {
  name: /View Previous Results/
}).click();

await page.locator(`//tr[td[contains(., '${resultTimestamp}')]]//button`).click();

await page.waitForURL('**/results_guided**', {
  timeout: 30000
});


// Verify logout was successful
await page
  .locator("//button[@qaislot='user']//qai-icon[@kind='chevron-down']//*[name()='svg']")
  .click();

//await page.pause();

await page.getByRole('button', { name: 'Logout' }).click();

await page.waitForURL('**/login', {
  timeout: 60000
});

await expect(page).toHaveURL(/login/);

console.log('Logout successful');

await page.pause();
});