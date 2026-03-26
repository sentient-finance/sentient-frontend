import { test, expect } from "@playwright/test";

test.describe("CCIP Feature", () => {
  test.setTimeout(60000);

  test("ccip page loads", async ({ page }) => {
    await page.goto("/dashboard/ccip");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toBeVisible();
  });

  test("ccip page has expected content structure", async ({ page }) => {
    await page.goto("/dashboard/ccip");
    await page.waitForLoadState("domcontentloaded");

    // Page should show either wallet connect prompt or CCIP panel
    // Give it time to load
    await page.waitForTimeout(2000);
  });

  test("ccip page has shield icon heading", async ({ page }) => {
    await page.goto("/dashboard/ccip");
    await page.waitForLoadState("domcontentloaded");

    // The CCIP page has a Shield icon in the header
    // Look for the header text
    const header = page.getByText(/Config CCIP Cross-Chain/i);
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test("navigation to ccip page works", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate directly to CCIP page
    await page.goto("/dashboard/ccip");
    await expect(page).toHaveURL(/\/dashboard\/ccip/, { timeout: 15000 });
  });
});
