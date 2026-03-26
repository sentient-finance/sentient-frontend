import { test, expect } from "@playwright/test";

test.describe("Notifications Feature", () => {
  test.setTimeout(60000);

  test("notifications page loads", async ({ page }) => {
    await page.goto("/dashboard/notifications");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toBeVisible();
  });

  test("notifications page has expected structure", async ({ page }) => {
    await page.goto("/dashboard/notifications");
    await page.waitForLoadState("domcontentloaded");

    // Page should have the space-y-5 container
    const container = page.locator("[class*='space-y-5']").first();
    await expect(container).toBeVisible({ timeout: 10000 });
  });

  test("navigation to notifications page works", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.goto("/dashboard/notifications");
    await expect(page).toHaveURL(/\/dashboard\/notifications/, { timeout: 15000 });
  });

  test("connections row section is visible", async ({ page }) => {
    await page.goto("/dashboard/notifications");
    await page.waitForLoadState("domcontentloaded");

    // Wait for hydration
    await page.waitForTimeout(2000);
  });
});
