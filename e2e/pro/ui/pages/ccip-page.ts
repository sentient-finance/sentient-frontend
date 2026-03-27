import { Page, Locator } from "@playwright/test";
import { MOCK_WALLET_ADDRESS } from "../mock-wallet";

/**
 * Page object for the CCIP feature on the Dashboard.
 */
export class CCIPPage {
  readonly page: Page;

  readonly truncatedAddress: string;
  readonly header: Locator;
  readonly shieldAmountInput: Locator;
  readonly shieldReceiverInput: Locator;
  readonly destChainSelect: Locator;
  readonly executeShieldButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.truncatedAddress = `${MOCK_WALLET_ADDRESS.slice(0, 6)}...${MOCK_WALLET_ADDRESS.slice(-4)}`;
    this.header = page.getByText(/Config CCIP Cross-Chain/i);
    this.shieldAmountInput = page.getByTestId("shield-amount-input");
    this.shieldReceiverInput = page.getByTestId("shield-receiver-input");
    this.destChainSelect = page.getByTestId("dest-chain-select");
    this.executeShieldButton = page.getByTestId("execute-shield-button");
  }

  async goto() {
    await this.page.goto("/dashboard/ccip");
    await this.page.waitForLoadState("networkidle");
  }
}
