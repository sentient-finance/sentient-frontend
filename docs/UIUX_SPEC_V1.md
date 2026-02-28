# Sentient Finance — UI/UX SPEC V1

## 1) Context
Sentient Finance is an AI-assisted crypto portfolio vault product.
Users create/manage vaults, define token trading rules, and monitor on-chain execution history.

Backend stack exposes read endpoints for FE:
- `GET /v1/vaults`
- `GET /v1/vault/{address}`
- `GET /v1/vault/{address}/history`

Primary UX challenge: show complex on-chain + rule-based automation data in a way that is trustworthy, fast to scan, and actionable.

---

## 2) Product Goals
1. **Trust & transparency**: user can verify what happened (tx hash, block, timestamp, chain).
2. **Operational clarity**: user quickly sees vault health, active rules, and latest events.
3. **Safe configuration**: rule settings are validated with clear guardrails.
4. **Speed**: common tasks (inspect vault, filter history, update rule intent) require minimal steps.

### Non-goals (V1)
- Full advanced analytics/PnL attribution suite
- Multi-role enterprise permission model
- Deep strategy builder with visual scripting

---

## 3) Information Architecture (IA)
- **Dashboard**
  - Portfolio snapshot (multi-vault)
  - Recent critical events
- **Vaults**
  - Vault List
  - Vault Detail
    - Summary
    - Token Rules
    - Event History
    - Settings
- **Alerts** (optional V1.1)
  - Risk or execution notifications

---

## 4) Core User Flows

### Flow A — Inspect vault status
1. Open Dashboard
2. Click a vault card/list row
3. View Vault Detail > Summary
4. Confirm latest event + health state

### Flow B — Audit recent execution
1. Open Vault Detail > Event History
2. Filter by `type`, time range
3. Open event row → tx hash external link
4. Confirm event payload and metadata

### Flow C — Manage trading rules (read-first UX in V1)
1. Open Vault Detail > Token Rules
2. Inspect enabled/disabled rules
3. Validate thresholds and constraints visually
4. (If edit enabled in FE scope) update rule with inline validation

---

## 5) Screen Specs

## 5.1 Dashboard
### Purpose
Global overview across vaults.

### Layout
- Top bar: network filter, refresh status
- KPI row: total vaults, active rules, recent swaps, alerts
- Vault table/cards
- Recent activity panel (latest 10 events)

### Components
- `KpiCard`
- `VaultHealthBadge`
- `VaultListTable`
- `RecentEventsFeed`

### States
- Loading skeleton
- Empty state: “No vaults yet”
- Error state with retry

### Acceptance Criteria
- User can click any vault and enter detail in 1 interaction.
- KPI row loads within same request cycle as list (or clearly indicates partial load).

---

## 5.2 Vault List
### Purpose
Discover and filter vaults quickly.

### Data mapping
From `GET /v1/vaults?limit&offset&chain`

### Columns (minimum)
- Vault address (shortened + copy)
- Chain
- Created time
- Created block
- Quick action: View details

### Interactions
- Pagination controls
- Chain filter
- Row click -> Vault Detail

### Acceptance Criteria
- Pagination + chain filter persist in URL query params.
- Address copy action confirms success.

---

## 5.3 Vault Detail — Summary
### Purpose
Answer: “Is this vault healthy and what happened recently?”

### Data mapping
From `GET /v1/vault/{address}`

### Sections
- Header: full address, chain, status badge
- Metadata cards: created tx, created timestamp, latest event block/time, event count
- Quick links: block explorer links

### Acceptance Criteria
- If vault not found, show clear 404 UX with back-to-list CTA.

---

## 5.4 Vault Detail — Token Rules
### Purpose
Show active/inactive strategy rules clearly.

### UI blocks
- Rule table by token
- Fields shown: enabled, buy threshold, sell threshold, trade amount, base token, cooldown hint
- Validation hints (read-only in V1 if edit not implemented)

### States
- No rules configured
- Mixed enabled/disabled
- Validation warning (if data inconsistent)

### Acceptance Criteria
- Enabled rules are visually distinct.
- Any invalid combo is highlighted with explain text.

---

## 5.5 Vault Detail — Event History
### Purpose
Audit trail and debugging surface.

### Data mapping
From `GET /v1/vault/{address}/history?type&from&to&chain&limit&offset`

### Filters
- Event type (enum from contract events)
- Time range (`from`, `to`)
- Pagination

### Table fields
- Timestamp
- Event type
- Block number
- Tx hash (copy + explorer link)
- Log index

### Event detail drawer/modal
- Full JSON payload
- Chain + vault address

### Acceptance Criteria
- Filtering updates results correctly without full page reload.
- Invalid date range returns user-facing validation message.

---

## 5.6 Vault Detail — Settings
### Purpose
Surface operational config safely.

### Sections
- Executor
- Router allow-list summary
- Max trade amount
- Cooldown period
- Slippage

### Acceptance Criteria
- Values are displayed with units and tooltips.

---

## 6) Design Tokens (Starter)

## Color
- `bg.primary`: `#0B1020`
- `bg.surface`: `#121A2B`
- `text.primary`: `#E6ECFF`
- `text.muted`: `#9FB0D0`
- `accent.info`: `#4DA3FF`
- `accent.success`: `#2DD4BF`
- `accent.warning`: `#F59E0B`
- `accent.danger`: `#EF4444`

## Typography
- Heading: Inter / 600-700
- Body: Inter / 400-500
- Mono (hash, address): JetBrains Mono

## Spacing
- 4 / 8 / 12 / 16 / 24 / 32 scale

## Radius
- Card: 12
- Input/button: 10

---

## 7) Microcopy (VN + EN style, concise)

### Loading
- “Đang đồng bộ dữ liệu vault…”
- “Loading vault activity…”

### Empty
- “Chưa có vault nào.”
- “No events in selected range.”

### Error
- 404 vault: “Không tìm thấy vault này trên chain đã chọn.”
- 422 filter: “Bộ lọc chưa hợp lệ. Vui lòng kiểm tra khoảng thời gian/event type.”
- Generic: “Không thể tải dữ liệu. Thử lại.”

### Success utility
- “Đã copy địa chỉ.”
- “Bộ lọc đã áp dụng.”

---

## 8) UX Guardrails
1. Always show chain context near address.
2. Hash/address always copyable.
3. Never hide critical execution metadata behind too many clicks.
4. Distinguish **pending/synced** state to avoid false confidence.
5. Date/time must be timezone-explicit (UTC label or local toggle).

---

## 9) Handoff Checklist (Design -> FE)
- [ ] Figma frames for all screens above
- [ ] Components mapped to reusable FE components
- [ ] Responsive behavior (desktop first, tablet fallback)
- [ ] Empty/loading/error states covered
- [ ] Event type filter values match backend enum exactly
- [ ] Explorer link format confirmed per chain

---

## 10) Definition of Done (UI/UX V1)
- User can discover vaults, inspect detail, and audit history end-to-end.
- All critical states (loading/empty/error/not found) are designed and implemented.
- FE filters map 1:1 to backend query params.
- Design handoff includes spacing/type/color token references.
- Team can demo full “inspect + audit” flow without ad-hoc explanations.
