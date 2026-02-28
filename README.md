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

### 5) Realtime UX
- Sau khi execute thành công -> event on-chain -> subgraph index -> UI refresh history
- Hiển thị trạng thái `queued/submitted/confirmed/failed`

---

## Pages plan
- `/` Landing
- `/app` Dashboard
- `/app/vault/new` Create vault
- `/app/vault/[address]` Vault detail + actions
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

---

## Local development

```bash
# install
npm install

# run
npm run dev
```

Open `http://localhost:3000`.

## Env (example)

```bash
NEXT_PUBLIC_GRAPHQL_URL=
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_CHAIN_ID=84532
```

## Definition of Done (MVP)
- Connect wallet + switch network OK
- Dashboard load data từ GraphQL
- Action call REST thành công
- Execution status hiển thị rõ
- History update sau khi event được index
