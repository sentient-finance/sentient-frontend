import { test, expect } from "../ui/fixtures";
import { MOCK_WALLET_ADDRESS } from "../ui/mock-wallet";

test.describe("CCIP Feature", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ walletPage }) => {
    // Navigate to CCIP page and wait for it to load
    await walletPage.goto("/dashboard/ccip");
    await walletPage.waitForLoadState("networkidle");
  });

  test("ccip page loads with mock wallet connected", async ({ walletPage }) => {
    // Check if the mock address or a truncated version of it is visible
    // RainbowKit usually shows truncated address e.g. 0x7099...79C8
    const truncatedAddress = `${MOCK_WALLET_ADDRESS.slice(0, 6)}...${MOCK_WALLET_ADDRESS.slice(-4)}`;
    await expect(walletPage.getByText(truncatedAddress)).toBeVisible({ timeout: 15000 });

    const header = walletPage.getByText(/Config CCIP Cross-Chain/i);
    await expect(header).toBeVisible();
  });

  test("can interact with CCIP form fields", async ({ walletPage }) => {
    // Wait for the panel to be in "configured" state or "setup" state
    // For this test, we assume it might show the panel if already configured on the mock chain

    const amountInput = walletPage.getByTestId("shield-amount-input");
    if (await amountInput.isVisible()) {
      await amountInput.fill("1.5");
      await expect(amountInput).toHaveValue("1.5");

      const receiverInput = walletPage.getByTestId("shield-receiver-input");
      await receiverInput.fill(MOCK_WALLET_ADDRESS);
      await expect(receiverInput).toHaveValue(MOCK_WALLET_ADDRESS);

      const destSelect = walletPage.getByTestId("dest-chain-select");
      await destSelect.selectOption({ label: "Ethereum Sepolia" });
      await expect(destSelect).toHaveValue(/0x/); // Selector values are bigint strings e.g. "16015286601757825753"
    } else {
      // If in setup mode, check for setup fields
      const routerInput = walletPage.locator("input[placeholder*='0x']");
      await expect(routerInput).toBeVisible();
    }
  });

  test("execute button is disabled when fields are empty", async ({ walletPage }) => {
    const amountInput = walletPage.getByTestId("shield-amount-input");
    if (await amountInput.isVisible()) {
      await amountInput.fill("");
      const executeBtn = walletPage.getByTestId("execute-shield-button");
      await expect(executeBtn).toBeDisabled();
    }
  });
});
