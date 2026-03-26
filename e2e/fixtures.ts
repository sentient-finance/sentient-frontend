import { test as base, Page } from "@playwright/test";
import { injectMockWallet } from "./utils/mock-wallet";

type MyFixtures = {
  walletPage: Page;
};

export const test = base.extend<MyFixtures>({
  walletPage: async ({ page }, use) => {
    // Inject the mock wallet before any navigation
    await injectMockWallet(page);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export { expect } from "@playwright/test";
