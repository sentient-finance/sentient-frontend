import { Page, Locator } from "@playwright/test";

/**
 * Page object for the Notifications page (/dashboard/notifications).
 */
export class NotificationsPage {
  readonly page: Page;
  readonly container: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator("[class*='space-y-5']").first();
  }

  async goto() {
    await this.page.goto("/dashboard/notifications");
    await this.page.waitForLoadState("domcontentloaded");
  }
}
