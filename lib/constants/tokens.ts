export const TOKEN_DATA: Record<
  string,
  { name: string; symbol: string; address: string; decimals: number }
> = {
  ETH: {
    name: "Ether",
    symbol: "ETH",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    decimals: 6,
  },
  WETH: {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
  },
  LINK: {
    name: "ChainLink Token",
    symbol: "LINK",
    address: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
    decimals: 18,
  },
  CCIP: {
    name: "CCIP-BnM",
    symbol: "CCIP",
    address: "0x88A2d74F47a237a62e7A51cdDa67270CE381555e",
    decimals: 18,
  },
};

export const STABLE_COINS = ["ETH", "USDC", "WETH", "LINK", "CCIP"];
