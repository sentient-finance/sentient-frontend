# Sentient Frontend

Frontend cho Sentient Finance (Next.js) theo hướng hybrid:
- **Read dữ liệu:** The Graph (GraphQL)
- **Write/action:** sentient-backend (REST)

## Tech stack
- Next.js (App Router)
- TypeScript
- Tailwind
- Wallet: wagmi + viem

## FE Flow (MVP)

### 1) User vào app + connect wallet
- Connect ví
- Switch network (Base Sepolia ưu tiên)

### 2) Dashboard (read-heavy)
- Query GraphQL:
  - danh sách vault
  - trạng thái vault
  - lịch sử swap/shield
- Hiển thị card tổng quan theo chain

### 3) Vault Detail
- Tab Overview: balance, owner/executor, cooldown/slippage
- Tab History: timeline event từ GraphQL
- Tab Strategy: form set threshold/trade amount

### 4) Action commands (write path)
- Gọi REST backend:
  - `POST /vault/{address}/action/execute`
  - `POST /vault/{address}/action/pause`
  - `POST /vault/{address}/action/shield`
- Poll `GET /executions/{id}` để cập nhật trạng thái tx

### 5) Notification flow (Telegram for non-tech users)
- Màn **Notifications** có nút `Connect Telegram`
- User bấm link bot: `t.me/<bot>?start=link_<nonce>`
- Bot nhận `start`, backend map `wallet_address <-> telegram_chat_id`
- User bật/tắt loại cảnh báo theo vault:
  - buy/sell threshold reached
  - swap success/fail
  - risk alert
  - shield triggered
- Có `Send test notification` để user tự kiểm tra

### 6) Realtime UX
- Sau khi execute thành công -> event on-chain -> subgraph index -> UI refresh history
- Hiển thị trạng thái `queued/submitted/confirmed/failed`

---

## Pages plan
- `/` Landing
- `/app` Dashboard
- `/app/vault/new` Create vault
- `/app/vault/[address]` Vault detail + actions
- `/app/notifications` Telegram connect + alert preferences
- `/app/monitor` Logs/health

---

## API/Query contract

### GraphQL (read)
- vault list
- vault detail
- swap history
- shield history

### REST (write)
- execute / pause / shield
- execution status
- connect telegram / set alert preferences

---

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Env (example)

```bash
NEXT_PUBLIC_GRAPHQL_URL=
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
```

## Definition of Done (MVP)
- Connect wallet + switch network OK
- Dashboard load data từ GraphQL
- Action call REST thành công
- Telegram connect flow hoạt động
- Alert preferences lưu được
- History update sau khi event được index
