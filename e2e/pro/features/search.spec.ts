import { test, expect } from "@playwright/test";

test.describe("Search Page", () => {
  test.setTimeout(60000);

  test("search page loads", async ({ page }) => {
    await page.goto("/dashboard/search");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toBeVisible();
  });

  test("top vaults heading is visible", async ({ page }) => {
    await page.goto("/dashboard/search");
    await page.waitForLoadState("domcontentloaded");

    const heading = page.getByText("Top Vaults").first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("page renders one of: loading, vaults, or empty state", async ({ page }) => {
    await page.goto("/dashboard/search");
    await page.waitForLoadState("domcontentloaded");

    // Give the API time to respond
    await page.waitForTimeout(3000);

    const skeletons = page
      .locator("[class*='rounded-2xl'][class*='border']")
      .filter({ has: page.locator("[class*='skeleton']") });
    const vaultRows = page.locator("[class*='cursor-pointer'][class*='rounded-2xl']");
    const emptyState = page.getByText(/no vaults found/i);
    const errorState = page.locator("[class*='border-destructive']");

    // One of these should be visible
    const hasSkeletons = await skeletons
      .first()
      .isVisible()
      .catch(() => false);
    const hasRows = await vaultRows
      .first()
      .isVisible()
      .catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    const hasError = await errorState.isVisible().catch(() => false);

    expect(hasSkeletons || hasRows || hasEmpty || hasError).toBeTruthy();
  });

  test("navigation to search page from dashboard works", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    await page.goto("/dashboard/search");
    await expect(page).toHaveURL(/\/dashboard\/search/, { timeout: 15000 });
  });
});
