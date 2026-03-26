import { test, expect } from "@playwright/test";

test.describe("App Smoke Tests", () => {
  test("homepage loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Filter out known non-critical errors (e.g., wallet-related)
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("wallet") &&
        !e.includes("ethereum") &&
        !e.includes("MetaMask") &&
        !e.includes("RainbowKit")
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("app page structure is correct", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Sentient/i);
  });
});
