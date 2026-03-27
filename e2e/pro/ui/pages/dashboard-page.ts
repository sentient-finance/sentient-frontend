import { Page, Locator } from "@playwright/test";

/**
 * Page object for the Dashboard page (/dashboard).
 */
export class DashboardPage {
  readonly page: Page;
  readonly mainContent: Locator;
  readonly connectButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContent = page.locator("main, [class*='space-y-8']").first();
    this.connectButton = page.locator("button[class*='connect'], [class*='rainbow']").first();
  }

  async goto() {
    await this.page.goto("/dashboard");
    await this.page.waitForLoadState("domcontentloaded");
  }
}
