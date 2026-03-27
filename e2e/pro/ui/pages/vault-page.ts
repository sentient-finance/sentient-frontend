import { Page, Locator } from "@playwright/test";

/**
 * Page object for the Vault feature on the Dashboard.
 */
export class VaultPage {
  readonly page: Page;

  // Vault card locators
  readonly vaultCards: Locator;
  readonly noVaultsText: Locator;

  // Deposit modal locators
  readonly depositButton: Locator;
  readonly depositTokenSearch: Locator;
  readonly depositAmountInput: Locator;
  readonly depositConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.vaultCards = page.getByTestId(/vault-card-0x/);
    this.noVaultsText = page.getByText(/No vaults found/i);

    this.depositButton = page.getByTestId("vault-deposit-button");
    this.depositTokenSearch = page.getByTestId("deposit-token-search");
    this.depositAmountInput = page.getByTestId("deposit-amount-input");
    this.depositConfirmButton = page.getByTestId("deposit-confirm-button");
  }

  async goto() {
    await this.page.goto("/dashboard");
    await this.page.waitForLoadState("networkidle");
  }

  async openDepositModal() {
    const vaultCard = this.vaultCards.first();
    if (await vaultCard.isVisible()) {
      await vaultCard.click();
      await this.depositButton.click();
    }
  }

  async selectToken(symbol: string) {
    const searchInput = this.depositTokenSearch;
    await searchInput.fill(symbol);
    const tokenRow = this.page.getByTestId(/deposit-token-/).first();
    if (await tokenRow.isVisible()) {
      await tokenRow.click();
    }
  }

  async fillDepositAmount(amount: string) {
    await this.depositAmountInput.fill(amount);
  }
}
