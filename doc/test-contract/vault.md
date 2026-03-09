import "dotenv/config";
import { JsonRpcProvider, Wallet, Contract, ethers } from "ethers";

const FACTORY_DEFAULT = "0x33cEEeAe9d235fe2d183Ac4781c8AD6297E30b32";
const CCIP_ROUTER     = "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93"; //CCIP router on Base Sepolia

const FACTORY_ABI = [
  "function createVault() external returns (address)",
  "function getVault(address user) view returns (address)",
];

const VAULT_ABI = [
  "function ccipRouter() view returns (address)",
  "function setCCIPConfig(address ccipRouter) external",
];

async function main() {
  const provider = new JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL!);
  const signer   = new Wallet(process.env.PRIVATE_KEY_USER!, provider);
  const factory  = new Contract(process.env.FACTORY_ADDRESS ?? FACTORY_DEFAULT, FACTORY_ABI, signer);

  console.log("Signer:", signer.address);

  // ── Step 1: createVault ───────────────────────────────────────────────────
  let vaultAddr: string = await factory.getVault(signer.address);
  if (vaultAddr === ethers.ZeroAddress) {
    console.log("\n[1/2] createVault()...");
    await (await factory.createVault()).wait();
    vaultAddr = await factory.getVault(signer.address);
    console.log("✅ Vault:", vaultAddr);
  } else {
    console.log("\n[1/2] Vault exists:", vaultAddr, "— skip");
  }

  // ── Step 2: setCCIPConfig ─────────────────────────────────────────────────
  const vault       = new Contract(vaultAddr, VAULT_ABI, signer);
  const currentCCIP = await vault.ccipRouter();
  if (currentCCIP === ethers.ZeroAddress) {
    console.log("\n[2/2] setCCIPConfig...");
    await (await vault.setCCIPConfig(CCIP_ROUTER)).wait();
    console.log("✅ CCIP Router:", CCIP_ROUTER);
  } else {
    console.log("\n[2/2] CCIP already set:", currentCCIP, "— skip");
  }

  console.log("\n══════════════════════════════════════");
  console.log("✅ Done. Add to .env:");
  console.log(`   VAULT_ADDRESS=${vaultAddr}`);
  console.log("\nNext: pnpm run emergency:shield:base-sepolia");
}

main().catch((e) => { console.error("❌", e.message); process.exitCode = 1; });