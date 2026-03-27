import { Page, Locator } from "@playwright/test";

/**
 * Page object for the Landing page (/).
 */
export class LandingPage {
  readonly page: Page;

  // Navbar
  readonly launchAppLink: Locator;

  // Hero section
  readonly heroHeadline: Locator;
  readonly inspectWalletInput: Locator;
  readonly inspectWalletButton: Locator;
  readonly chainNames: Locator[];

  // Featured vaults section
  readonly topVaultsHeading: Locator;
  readonly vaultLabels: string[];
  readonly trackVaultLinks: Locator;

  // Features section
  readonly coreFeaturesHeading: Locator;
  readonly featureTitles: string[];

  // Live activity section
  readonly liveActivityHeading: Locator;
  readonly eventTypes: string[];
  readonly viewAllEventsLink: Locator;
  readonly createVaultLink: Locator;

  // Footer
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navbar
    this.launchAppLink = page.getByRole("link", { name: /launch app/i });

    // Hero
    this.heroHeadline = page.locator("h1");
    this.inspectWalletInput = page.getByPlaceholder("inspect 0x... or ENS address");
    this.inspectWalletButton = page.getByRole("button", { name: /inspect wallet/i });
    this.chainNames = ["Ethereum", "Arbitrum", "Optimism", "Base"].map((c) =>
      page.getByText(c).first()
    );

    // Featured vaults
    this.topVaultsHeading = page.getByText("Top Performing Vaults");
    this.vaultLabels = ["ETH/USDC Yield", "BTC Hedge", "Stable Rebalancer"];
    this.trackVaultLinks = page.getByRole("link", { name: /track vault/i });

    // Features
    this.coreFeaturesHeading = page.getByText("Core Features");
    this.featureTitles = [
      "Rule-Based Automation",
      "Risk Shields",
      "Transaction History Analysis",
      "Cross-Chain Monitoring",
    ];

    // Live activity
    this.liveActivityHeading = page.getByRole("heading", { name: /live activity/i });
    this.eventTypes = ["SwapExecuted", "RuleEvaluated", "ShieldTriggered"];
    this.viewAllEventsLink = page.getByRole("link", { name: /view all events/i });
    this.createVaultLink = page.getByRole("link", { name: /create vault/i });

    // Footer
    this.footer = page.locator("footer");
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async scrollToSection(selector: Locator) {
    await selector.scrollIntoViewIfNeeded();
  }
}
