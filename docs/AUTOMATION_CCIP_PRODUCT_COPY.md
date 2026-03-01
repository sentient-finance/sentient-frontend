# Automation & CCIP — Product Copy (UI/Docs Ready)

## 1) Short explainer (for overview card)

### What is Automation?
Automation lets your vault monitor market conditions and execute approved actions automatically when your rules are met.

### What is CCIP?
CCIP (Cross-Chain Interoperability Protocol) enables secure cross-chain messaging and token movement with stronger safety guarantees than ad-hoc bridge logic.

---

## 2) User-facing copy (non-technical)

### Automation (simple)
- Your vault checks configured rules on a schedule.
- If conditions match, it can trigger execution without manual clicks.
- Cooldown and risk limits still apply.

### CCIP (simple)
- Your vault can coordinate actions across chains.
- Cross-chain actions may take longer to finalize than same-chain actions.
- Safety controls can trigger protective behavior when risk is detected.

---

## 3) UI labels and descriptions

## Section title
**Automation & Cross-chain**

## Cards
### Automation Status
- **Enabled** / **Disabled**
- Last run: `<time>`
- Next check: `<time>`
- Cooldown: `<duration>`

Helper text:
> Automation checks your strategy rules periodically and triggers execution when conditions are met.

### CCIP Status
- Router: `<address>`
- Route: `<source chain> → <destination chain>`
- Last cross-chain action: `<time>`
- Finality state: `Pending` / `Confirmed`

Helper text:
> Cross-chain actions use CCIP and may take additional time to finalize.

---

## 4) Event copy mapping

Use these titles/subtitles in event feed:

- `AutomationConfigUpdated`
  - Title: **Automation config updated**
  - Subtitle: Strategy automation settings were changed.

- `CCIPRouterUpdated`
  - Title: **CCIP router updated**
  - Subtitle: Cross-chain routing configuration changed.

- `CrossChainShieldTriggered`
  - Title: **Cross-chain shield triggered**
  - Subtitle: A protective cross-chain action was triggered by safety rules.

Optional badge set:
- `AUTOMATION`
- `CCIP`
- `SHIELD`

---

## 5) Empty / loading / error states

### Loading
- “Checking automation status…”
- “Fetching cross-chain activity…”

### Empty
- “No automation runs yet.”
- “No cross-chain actions recorded.”

### Error
- “Unable to load automation status. Try again.”
- “Unable to load cross-chain data. Please retry.”

---

## 6) Warning copy (trust & safety)

- “Cross-chain actions may finalize later than same-chain transactions.”
- “Pending status means the action is submitted but not yet finalized.”
- “If shield is triggered, some actions may be delayed or restricted for safety.”

---

## 7) Tooltip copy

### Automation tooltip
> Automation helps execute your strategy without manual intervention. Execution still follows your configured risk limits.

### CCIP tooltip
> CCIP enables secure communication and value transfer between supported chains. Final confirmation time can vary by network.

### Shield tooltip
> Shield is a protective fallback for cross-chain risk scenarios.

---

## 8) Suggested placement in existing V1 spec

In `UIUX_SPEC_V1.md`, add under Vault Detail:
- New subsection: **Automation & Cross-chain**
- Show summary card + event timeline filter tags (`AUTOMATION`, `CCIP`, `SHIELD`)

---

## 9) VN quick copy (optional localized)

- Automation: “Tự động kiểm tra rule và kích hoạt hành động khi đủ điều kiện.”
- CCIP: “Hỗ trợ hành động liên chain an toàn hơn, có thể mất thêm thời gian để finality.”
- Shield: “Cơ chế bảo vệ khi phát hiện rủi ro liên chain.”
