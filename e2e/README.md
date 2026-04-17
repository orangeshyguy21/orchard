# Orchard E2E Testing

End-to-end testing infrastructure. Docker-based regtest Bitcoin + Lightning stacks,
real mints, real Taproot Assets daemon, and Orchard built from repo source.

See [tasks/todo.md](../tasks/todo.md) for the full rollout plan.

## Structure

```
e2e/
├── docker/
│   ├── pair1.compose.yml      # bitcoind + lnd*3 + tapd*2 + nutshell + orchard
│   ├── pair1.env              # pair1 config (regtest only)
│   ├── pair2.compose.yml      # (planned) bitcoind + cln*2 + lnd-carol + cdk-mintd + orchard
│   ├── pair2.env              # (planned)
│   └── scripts/
│       ├── wait-healthy.sh    # docker compose up --wait wrapper
│       └── fund-and-open.sh   # runs inside setup service: mines, funds, opens channels
└── README.md (this file)
```

## Pair 1 topology

```
lnd-alice ⇄ lnd-orchard ⇄ lnd-bob     (NO direct alice⇄bob — forces routing)
              ▲
              └── tapd-orchard (lnd-orchard)
                  tapd-alice   (lnd-alice)
                  nutshell     (backend: lnd-orchard via REST)
                  orchard      (this repo, built from Dockerfile)
```

## Running pair 1 locally

```bash
# bring it up (blocks until healthy)
npm run e2e:pair1:up

# watch logs
npm run e2e:pair1:logs

# inspect service state
npm run e2e:pair1:ps

# tear down (removes all named volumes — fully clean)
npm run e2e:pair1:down
```

## Ports exposed to the host (pair 1)

| Service       | Host port | Purpose                    |
|---------------|-----------|----------------------------|
| bitcoind RPC  | 18443     | chain manipulation         |
| lnd-orchard   | 10009     | gRPC                       |
| lnd-alice     | 10019     | gRPC                       |
| lnd-bob       | 10029     | gRPC                       |
| tapd-orchard  | 10039     | gRPC                       |
| tapd-alice    | 10049     | gRPC                       |
| nutshell      | 3338      | mint HTTP API              |
| orchard       | 3321      | Orchard GraphQL + UI       |

LND / tapd REST ports are not exposed to the host — they're used only inside the compose network by the setup script. All host-side interactions go through gRPC, Orchard, or the mint HTTP.

## What the setup service does

Runs once after LN nodes are healthy, in `e2e/docker/scripts/fund-and-open.sh`:

1. Mines 101 regtest blocks (unlocks coinbase maturity).
2. Sends 10 BTC from bitcoind to each LND wallet, confirms with 6 blocks.
3. Peers alice→orchard and orchard→bob (no direct alice↔bob).
4. Opens channels alice→orchard and orchard→bob (10M sat cap, push 5M each).
5. Mines 6 blocks to confirm channel funding.
6. Waits for both channels to report `active=true`, then 5s for gossip.
7. Touches `/shared/ready` so downstream services (nutshell, orchard) proceed.

## Regenerating credentials

Every `e2e:pair1:down` wipes named volumes — certs, macaroons, wallets,
channel state are all regenerated on the next `e2e:pair1:up`. No committed
credential fixtures.

## Troubleshooting

- **Build takes forever**: first run builds Orchard from source. Subsequent runs
  hit the Docker layer cache; the orchard build step only reruns on source
  changes.
- **Setup service exits non-zero**: `docker logs pair1-setup` shows the funding
  script's last action. Common causes: LND not fully synced, bitcoind wallet
  not created, gossip propagation slow.
- **Orchard can't see LND macaroon**: macaroon path depends on network; for
  regtest it's `/certs/lnd/data/chain/bitcoin/regtest/admin.macaroon`. Check
  `LIGHTNING_MACAROON` env in [pair1.compose.yml](docker/pair1.compose.yml).
