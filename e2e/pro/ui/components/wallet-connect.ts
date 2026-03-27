import { Page } from "@playwright/test";

/**
 * Helper for wallet connection UI interactions.
 */
export class WalletConnectHelper {
  constructor(private readonly page: Page) {}

  /**
   * Returns a locator for the RainbowKit connect button.
   */
  get connectButton() {
    return this.page.locator("button[class*='connect'], [class*='rainbow']").first();
  }

  /**
   * Checks if a wallet address is visible in the UI (RainbowKit truncated format).
   */
  async isAddressVisible(address: string): Promise<boolean> {
    const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
    const locator = this.page.getByText(truncated);
    return locator.isVisible();
  }
}
