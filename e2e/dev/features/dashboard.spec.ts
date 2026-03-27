import { test, expect } from "@playwright/test";

test.describe("Dashboard Page", () => {
  test.setTimeout(60000);

  test("dashboard page loads", async ({ page }) => {
    await page.goto("/dashboard");
    // Dashboard is behind wallet gate, so may redirect or show wallet prompt
    // Just verify the page loads without crash
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toBeVisible();
  });

  test("navigation to dashboard from home works", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const launchAppBtn = page.getByRole("link", { name: /launch app/i });
    await launchAppBtn.click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test("key dashboard elements render", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    // The main content area should be visible
    const mainContent = page.locator("main, [class*='space-y-8']").first();
    await expect(mainContent).toBeVisible({ timeout: 15000 });
  });

  test("wallet connect button is present", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    // RainbowKit connect button should be present
    const connectBtn = page.locator("button[class*='connect'], [class*='rainbow']").first();
    // Assert element exists in DOM (may not be visible if wallet already connected)
    await expect(connectBtn).toHaveCount(1, { timeout: 5000 });
  });
});
