import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("page loads without crash", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toBeVisible();
  });

  test("hero section is visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that hero content is present (check for main heading or CTA)
    const heroContent = page.locator("main, [class*='hero'], h1").first();
    await expect(heroContent).toBeVisible({ timeout: 10000 });
  });

  test("navigation has Launch App CTA", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const launchAppBtn = page.getByRole("link", { name: /launch app/i });
    await expect(launchAppBtn).toBeVisible();
  });

  test("navigation link to dashboard works", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const launchAppBtn = page.getByRole("link", { name: /launch app/i });
    await launchAppBtn.click();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("features section is visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for features section - look for common patterns
    const featuresSection = page.locator("section, [class*='features']").first();
    await expect(featuresSection).toBeVisible({ timeout: 10000 });
  });
});
