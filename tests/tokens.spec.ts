import { test, expect } from '@playwright/test';

test.describe('Tokens Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Token Scanner' })).toBeVisible();
  });

  test('should display WebSocket status indicator', async ({ page }) => {
    await expect(page.getByText('WebSocket Status:')).toBeVisible();
  });

  test('should display token filters', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const filterElements = page.locator('input[placeholder*="Search"], select, button:has-text("Filter")');
    await expect(filterElements.first()).toBeVisible();
  });

  test('should display trending tokens table', async ({ page }) => {
    const trendingContainer = page.locator('[data-automationId="trending-tokens"]');
    await expect(trendingContainer).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Trending Tokens' })).toBeVisible();

    const trendingTable = trendingContainer.locator('table');
    await expect(trendingTable).toBeVisible();

    await expect(trendingTable.locator('thead')).toBeVisible();
    await expect(trendingTable.locator('tbody')).toBeVisible();
  });

  test('should display new tokens table', async ({ page }) => {
    const newTokensContainer = page.locator('[data-automationId="new-tokens"]');
    await expect(newTokensContainer).toBeVisible();

    await expect(page.getByRole('heading', { name: 'New Tokens' })).toBeVisible();

    const newTokensTable = newTokensContainer.locator('table');
    await expect(newTokensTable).toBeVisible();

    await expect(newTokensTable.locator('thead')).toBeVisible();
    await expect(newTokensTable.locator('tbody')).toBeVisible();
  });

  test('should have sticky table headers', async ({ page }) => {
    await page.waitForSelector('[data-automationId="trending-tokens"] table');
    
    const trendingHeader = page.locator('[data-automationId="trending-tokens"] thead');
    await expect(trendingHeader).toHaveCSS('position', 'sticky');
    
    const newTokensHeader = page.locator('[data-automationId="new-tokens"] thead');
    await expect(newTokensHeader).toHaveCSS('position', 'sticky');
  });

  test('should display expected table columns', async ({ page }) => {
    await page.waitForSelector('[data-automationId="trending-tokens"] table');

    const trendingTable = page.locator('[data-automationId="trending-tokens"] table');
    await expect(trendingTable.locator('th:has-text("Token Name/Symbol")')).toBeVisible();
    await expect(trendingTable.locator('th:has-text("Exchange")')).toBeVisible();
    await expect(trendingTable.locator('th:has-text("Price (USD)")')).toBeVisible();
    await expect(trendingTable.locator('th:has-text("Market Cap")')).toBeVisible();
    await expect(trendingTable.locator('th:has-text("Volume (24h)")')).toBeVisible();

    const newTokensTable = page.locator('[data-automationId="new-tokens"] table');
    await expect(newTokensTable.locator('th:has-text("Token Name/Symbol")')).toBeVisible();
    await expect(newTokensTable.locator('th:has-text("Exchange")')).toBeVisible();
    await expect(newTokensTable.locator('th:has-text("Age")')).toBeVisible();
  });

  test('should have responsive layout', async ({ page }) => {
    const tablesContainer = page.locator('.flex.flex-row.gap-4');
    await expect(tablesContainer).toBeVisible();

    const trendingContainer = page.locator('[data-automationId="trending-tokens"]');
    const newTokensContainer = page.locator('[data-automationId="new-tokens"]');
    
    await expect(trendingContainer).toBeVisible();
    await expect(newTokensContainer).toBeVisible();

    await expect(trendingContainer).toHaveClass(/flex-1/);
    await expect(newTokensContainer).toHaveClass(/flex-1/);
  });
});
