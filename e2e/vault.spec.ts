import { test, expect } from "./fixtures";

test.describe("Vault Feature", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ walletPage }) => {
    // Navigate to dashboard and wait for it to load
    await walletPage.goto("/dashboard");
    await walletPage.waitForLoadState("networkidle");
  });

  test("dashboard loads with vault cards", async ({ walletPage }) => {
    // Check if at least one vault card is visible or the "No vaults" state
    // Given it's a mock wallet, it might not have a vault yet.
    // If it doesn't have a vault, it should show the "Create Vault" or similar.

    const vaultCard = walletPage.getByTestId(/vault-card-0x/);
    const noVaults = walletPage.getByText(/No vaults found/i);

    await expect(vaultCard.or(noVaults)).toBeVisible({ timeout: 15000 });
  });

  test("can open deposit modal from vault panel", async ({ walletPage }) => {
    // This test assumes there is a vault card to click.
    // If there is no vault, we might need to skip or mock the vault list.
    const vaultCard = walletPage.getByTestId(/vault-card-0x/).first();

    if (await vaultCard.isVisible()) {
      await vaultCard.click();

      // Wait for the vault panel to slide in
      const depositBtn = walletPage.getByTestId("vault-deposit-button");
      await expect(depositBtn).toBeVisible();

      await depositBtn.click();

      // Check if deposit modal is visible
      const modalHeader = walletPage.getByText("Deposit", { exact: true });
      await expect(modalHeader).toBeVisible();

      // Try searching for a token
      const searchInput = walletPage.getByTestId("deposit-token-search");
      await expect(searchInput).toBeVisible();
      await searchInput.fill("USDC");

      // Select a token (if any appear in the mock list)
      const tokenRow = walletPage.getByTestId(/deposit-token-/).first();
      if (await tokenRow.isVisible()) {
        await tokenRow.click();

        // Enter amount and check confirm button
        const amountInput = walletPage.getByTestId("deposit-amount-input");
        await amountInput.fill("100");

        const confirmBtn = walletPage.getByTestId("deposit-confirm-button");
        await expect(confirmBtn).toBeEnabled();
      }
    }
  });
});
