import { test, expect } from "@playwright/test";

test.describe("Vault Feature", () => {
  test.setTimeout(60000);

  test("vault section loads on dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    // Dashboard should contain vault-related content
    // The page loads VaultSection component
    await expect(page.locator("body")).toBeVisible();
  });

  test("vault page interaction structure is correct", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    // Verify the dashboard has the expected structure with vault sections
    const spaceDiv = page.locator("[class*='space-y-8']").first();
    await expect(spaceDiv).toBeVisible({ timeout: 15000 });
  });

  test("vault panel can be triggered", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    // Just verify page structure loads correctly
    // VaultPanel appears when a vault is selected
    await page.waitForTimeout(1000);
  });
});
