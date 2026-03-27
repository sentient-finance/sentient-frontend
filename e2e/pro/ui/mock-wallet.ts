import { Page } from "@playwright/test";

export const MOCK_WALLET_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
export const MOCK_CHAIN_ID = "0x2105"; // Base Mainnet (8453) - though app uses baseSepolia (84532 -> 0x14a34)
export const MOCK_CHAIN_ID_HEX = "0x14a34"; // Base Sepolia

/**
 * Injects a mock EIP-1193 provider into the page.
 */
export async function injectMockWallet(page: Page) {
  await page.addInitScript(
    ({ address, chainId }) => {
      const provider = {
        isMetaMask: true,
        chainId: chainId,
        request: async (request: { method: string; params?: Array<unknown> }) => {
          console.log(`[MockWallet] Request: ${request.method}`, request.params);

          switch (request.method) {
            case "eth_requestAccounts":
            case "eth_accounts":
              return [address];
            case "eth_chainId":
              return chainId;
            case "net_version":
              return parseInt(chainId, 16).toString();
            case "personal_sign":
              return "0xsignature";
            case "eth_sendTransaction":
              return "0xhash";
            case "wallet_switchEthereumChain":
              return null;
            default:
              throw new Error(`Method ${request.method} not implemented in MockWallet`);
          }
        },
        on: (event: string) => {
          console.log(`[MockWallet] Listener added: ${event}`);
        },
        removeListener: (event: string) => {
          console.log(`[MockWallet] Listener removed: ${event}`);
        },
        autoRefreshOnNetworkChange: false,
      };

      (window as unknown as { ethereum: unknown }).ethereum = provider;
    },
    { address: MOCK_WALLET_ADDRESS, chainId: MOCK_CHAIN_ID_HEX }
  );
}
