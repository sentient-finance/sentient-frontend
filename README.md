# Sentient Frontend

Frontend cho Sentient Finance (Next.js) theo hướng hybrid:
- **Read data:** The Graph (GraphQL)
- **Write actions:** sentient-backend (REST)

## MVP workflow

1. **Connect wallet + network** (Base Sepolia)
2. **Read vault state/history** qua GraphQL
3. **Execute action** (`execute/pause/shield`) qua REST backend
4. **Track execution** (`queued -> submitted -> confirmed/failed`)
5. **Telegram notifications** cho user non-tech (connect bot + alert preferences)

## Route map

- `/` Landing / workflow overview
- `/app` Dashboard
- `/app/vault/new` Create vault
- `/app/vault/[address]` Vault detail + actions
- `/app/notifications` Telegram link + alert settings
- `/app/monitor` Logs/health

## Color base (design tokens)

Defined in `app/globals.css`:
- `--background`, `--foreground`, `--muted`
- `--card`, `--card-2`, `--border`
- `--primary`, `--success`, `--warning`, `--danger`

Use these tokens for consistent UI across pages.

## Local development

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Env example

```bash
NEXT_PUBLIC_GRAPHQL_URL=
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
```
