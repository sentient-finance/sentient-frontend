export const TOKEN_DATA: Record<string, { name: string; icon: string }> = {
  USDC: {
    name: "USD Coin",
    icon: "https://assets.trustwalletapp.com/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  },
  USDT: {
    name: "Tether",
    icon: "https://assets.trustwalletapp.com/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
  },
  DAI: {
    name: "Dai",
    icon: "https://assets.trustwalletapp.com/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  },
  WETH: {
    name: "Wrapped Ethereum",
    icon: "https://assets.trustwalletapp.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
  ETH: {
    name: "Ethereum",
    icon: "https://assets.trustwalletapp.com/blockchains/ethereum/info/logo.png",
  },
  WBTC: {
    name: "Wrapped Bitcoin",
    icon: "https://assets.trustwalletapp.com/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2E597/logo.png",
  },
  BTC: {
    name: "Bitcoin",
    icon: "https://assets.trustwalletapp.com/blockchains/bitcoin/info/logo.png",
  },
  SOL: {
    name: "Solana",
    icon: "https://assets.trustwalletapp.com/blockchains/solana/info/logo.png",
  },
  BNB: { name: "BNB", icon: "https://assets.trustwalletapp.com/blockchains/binance/info/logo.png" },
  XRP: { name: "XRP", icon: "https://assets.trustwalletapp.com/blockchains/ripple/info/logo.png" },
};

export const STABLE_COINS = [{ symbol: "USDC" }, { symbol: "USDT" }, { symbol: "DAI" }];
