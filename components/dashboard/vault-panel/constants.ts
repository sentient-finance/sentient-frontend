import { Terminal, Clock, Settings2 } from "lucide-react";

// Base Sepolia chain id
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export { TOKEN_DATA, STABLE_COINS } from "@/lib/constants/tokens";

export const tabItems = [
  { id: "console", label: "Console", Icon: Terminal },
  { id: "history", label: "History", Icon: Clock },
  { id: "config", label: "Config", Icon: Settings2 },
] as const;
