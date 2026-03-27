import { test, expect } from "@playwright/test";

/**
 * Landing Page E2E Tests
 *
 * Strategy notes:
 * - Use `waitForLoadState("domcontentloaded")` instead of "networkidle".
 *   WagmiProvider with reconnectOnMount=true makes continuous background RPC
 *   calls, so "networkidle" never resolves within a reasonable timeout.
 * - For elements inside RevealSection (opacity: 0 → IntersectionObserver → 1),
 *   call `.scrollIntoViewIfNeeded()` first to trigger the observer before
 *   asserting visibility.
 * - The "Launch App" nav link has target="_blank", so navigation tests must
 *   capture the popup tab rather than checking the current page URL.
 */

test.describe("Landing Page", () => {
  // ─── Page-level smoke ────────────────────────────────────────────────────

  test("page title matches Sentient Finance branding", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await expect(page).toHaveTitle(/Sentient Finance/i);
  });

  test("page loads without critical console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Ignore known non-critical web3 / wallet errors
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("wallet") &&
        !e.includes("ethereum") &&
        !e.includes("MetaMask") &&
        !e.includes("RainbowKit") &&
        !e.includes("WalletConnect") &&
        !e.includes("wagmi")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  // ─── Navbar ─────────────────────────────────────────────────────────────

  test("nav: Launch App CTA is visible and opens dashboard in new tab", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const launchAppLink = page.getByRole("link", { name: /launch app/i });
    await expect(launchAppLink).toBeVisible({ timeout: 10000 });

    // landing-nav.tsx sets target="_blank" → verify attributes before clicking
    await expect(launchAppLink).toHaveAttribute("href", "/dashboard");
    await expect(launchAppLink).toHaveAttribute("target", "_blank");

    // Capture the new tab that opens when clicking the link
    const [newTab] = await Promise.all([page.waitForEvent("popup"), launchAppLink.click()]);
    await newTab.waitForLoadState("domcontentloaded");
    await expect(newTab).toHaveURL(/\/dashboard/);
  });

  // ─── HeroSection ─────────────────────────────────────────────────────────
  // HeroSection is NOT wrapped in RevealSection → elements animate via CSS
  // classes (hs-in-*) and are immediately in the DOM with visible opacity.

  test("hero: renders AUTOMATE / YOUR DeFi / VAULTS headline", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const h1 = page.locator("h1");
    await expect(h1).toBeVisible({ timeout: 10000 });
    await expect(h1).toContainText("AUTOMATE");
    await expect(h1).toContainText("YOUR DeFi");
    await expect(h1).toContainText("VAULTS");
  });

  test("hero: inspect wallet input is visible and submit button disabled when empty", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const input = page.getByPlaceholder("inspect 0x... or ENS address");
    await expect(input).toBeVisible({ timeout: 10000 });

    // Button is disabled when the input is empty (source: disabled={!address.trim()})
    const inspectBtn = page.getByRole("button", { name: /inspect wallet/i });
    await expect(inspectBtn).toBeDisabled();
  });

  test("hero: inspect wallet button enables after typing an address", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const input = page.getByPlaceholder("inspect 0x... or ENS address");
    const inspectBtn = page.getByRole("button", { name: /inspect wallet/i });

    await input.fill("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
    await expect(inspectBtn).toBeEnabled();
  });

  test("hero: supported chain names are listed", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Chain names from CHAINS constant in hero-section.tsx
    for (const chain of ["Ethereum", "Arbitrum", "Optimism", "Base"]) {
      await expect(page.getByText(chain).first()).toBeVisible({ timeout: 10000 });
    }
  });

  // ─── FeaturedVaultsSection ───────────────────────────────────────────────
  // All content is inside RevealSection → scroll to trigger IntersectionObserver

  test("featured vaults: renders section heading and 3 vault cards", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const heading = page.getByText("Top Performing Vaults");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Vault labels from static featuredVaults array in featured-vaults-section.tsx
    const vaultLabels = ["ETH/USDC Yield", "BTC Hedge", "Stable Rebalancer"];
    for (const label of vaultLabels) {
      const el = page.getByText(label);
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible({ timeout: 10000 });
    }
  });

  test("featured vaults: Track Vault links point to /dashboard (no new tab)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // 3 vault cards, each has a "Track Vault" link without target="_blank"
    const trackVaultLinks = page.getByRole("link", { name: /track vault/i });
    await expect(trackVaultLinks).toHaveCount(3, { timeout: 10000 });

    const firstLink = trackVaultLinks.first();
    await firstLink.scrollIntoViewIfNeeded();
    await expect(firstLink).toHaveAttribute("href", "/dashboard");
    // Confirm no target="_blank" (same-tab navigation)
    await expect(firstLink).not.toHaveAttribute("target", "_blank");
  });

  // ─── FeaturesSection ─────────────────────────────────────────────────────

  test("features: renders Core Features heading and all 4 feature cards", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const heading = page.getByText("Core Features");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Feature card titles from static features array in features-section.tsx
    const featureTitles = [
      "Rule-Based Automation",
      "Risk Shields",
      "Transaction History Analysis",
      "Cross-Chain Monitoring",
    ];
    for (const title of featureTitles) {
      const el = page.getByText(title).first();
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible({ timeout: 10000 });
    }
  });

  // ─── LiveActivitySection ─────────────────────────────────────────────────

  test("live activity: renders activity feed with real event types", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // "Live Activity" text appears twice: section h2 + phone frame header
    const sectionHeading = page.getByRole("heading", { name: /live activity/i });
    await sectionHeading.scrollIntoViewIfNeeded();
    await expect(sectionHeading).toBeVisible({ timeout: 10000 });

    // Event types from static activities array in live-activity-section.tsx
    const eventTypes = ["SwapExecuted", "RuleEvaluated", "ShieldTriggered"];
    for (const type of eventTypes) {
      const el = page.getByText(type).first();
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible({ timeout: 10000 });
    }
  });

  test("live activity: View all events link goes to /dashboard/notifications", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const viewAllLink = page.getByRole("link", { name: /view all events/i });
    await viewAllLink.scrollIntoViewIfNeeded();
    await expect(viewAllLink).toBeVisible({ timeout: 10000 });
    await expect(viewAllLink).toHaveAttribute("href", "/dashboard/notifications");
  });

  test("live activity: Create Vault button links to /dashboard", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const createVaultLink = page.getByRole("link", { name: /create vault/i });
    await createVaultLink.scrollIntoViewIfNeeded();
    await expect(createVaultLink).toBeVisible({ timeout: 10000 });
    await expect(createVaultLink).toHaveAttribute("href", "/dashboard");
  });

  // ─── Footer ──────────────────────────────────────────────────────────────

  test("footer: renders copyright with Sentient Finance and Chainlink mentions", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();

    // Exact copy from app/page.tsx footer text
    await expect(page.getByText(/2026 Sentient Finance.*Built on Chainlink/)).toBeVisible();
  });
});
