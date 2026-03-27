import { Page, Locator } from "@playwright/test";

/**
 * Page object for the Search page (/dashboard/search).
 */
export class SearchPage {
  readonly page: Page;

  readonly topVaultsHeading: Locator;
  readonly vaultRows: Locator;
  readonly errorState: Locator;
  readonly loadingSkeletons: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;

    this.topVaultsHeading = page.getByText("Top Vaults").first();
    this.vaultRows = page.locator("[class*='cursor-pointer'][class*='rounded-2xl']");
    this.errorState = page.locator("[class*='border-destructive']");
    this.loadingSkeletons = page
      .locator("[class*='rounded-2xl'][class*='border']")
      .filter({ has: page.locator("[class*='skeleton']") });
    this.emptyState = page.getByText(/no vaults found/i);
  }

  async goto() {
    await this.page.goto("/dashboard/search");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickFirstVaultRow() {
    const row = this.vaultRows.first();
    if (await row.isVisible()) {
      await row.click();
    }
  }
}
