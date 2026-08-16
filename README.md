# $DASHA Utility Package

Cultural tools and lobby for [getdasha.com](https://www.getdasha.com) / `$DASHA` on Solana.

**Contract:** `53uxQtB9pcjWvCHguz3JTTndvuKqGxhrD37EetnCpump`

Companion to [dasha-desk](https://github.com/Uuriko/dasha-desk).

## Features

### Studio utility (Phase 1)
- Wallet connect + $DASHA balance / tier
- Gated Studio access (50k / 150k thresholds)
- Burn $DASHA → mint compressed NFT (Bubblegum)
- Arweave metadata upload via Irys

### Lobby
- Public rooms (no DMs)
- Wallet signature auth
- Durable messages (PartyKit)
- Replies, reactions, pins
- Presence + optional image attach

## Structure

```
├── DASHA_WHITEPAPER_v1.1.md
├── PHASE1_SPEC.md
├── CNFT_SETUP.md
├── src/           # React: wallet, gating, mint, upload
└── lobby/         # React Lobby + PartyKit backend
```

## Quick start — Lobby

```bash
cd lobby/partykit && npm install && npx partykit dev
```

```tsx
<LobbyShell partyHost="127.0.0.1:1999" />
```

See `lobby/docs/DEPLOY.md` for production.

## Tier thresholds

| Tier     | $DASHA held |
|----------|-------------|
| Public   | 0 – 49,999  |
| Advanced | ≥ 50,000    |
| Full     | ≥ 150,000   |
