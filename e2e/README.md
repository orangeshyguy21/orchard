# Orchard E2E Testing

End-to-end testing infrastructure. Docker-based regtest Bitcoin + Lightning stacks,
real mints, Orchard built from repo source.

See [tasks/todo.md](../tasks/todo.md) for the full rollout plan.

## Config matrix

Four configs, each a diagonal across (LN × Mint × DB). Together they exercise
every axis exactly twice.

| Config | LN | Mint | DB | Tapd |
|---|---|---|---|---|
| `lnd-nutshell-sqlite` | lnd | nutshell | sqlite | — |
| `cln-nutshell-postgres` | cln | nutshell | postgres | — |
| `lnd-cdk-sqlite` | lnd | cdk | sqlite | ✓ |
| `cln-cdk-postgres` | cln | cdk | postgres | — |

## Directory structure

```
e2e/
├── docker/
│   ├── setup.Dockerfile                # shared alpine+tools image (curl/jq/xxd/docker-cli)
│   ├── scripts/
│   │   ├── compose.sh                  # dispatcher: up/down/logs/ps
│   │   ├── fund-lnd-topology.sh        # runs inside setup for lnd-* configs
│   │   └── fund-cln-topology.sh        # runs inside setup for cln-* configs
│   └── configs/
│       ├── lnd-nutshell-sqlite/
│       │   ├── compose.yml
│       │   └── env
│       ├── lnd-cdk-sqlite/
│       │   ├── compose.yml
│       │   ├── env
│       │   └── mintd.toml              # cdk-mintd config (lnd backend)
│       ├── cln-cdk-postgres/
│       │   ├── compose.yml
│       │   ├── env
│       │   └── mintd.toml              # cdk-mintd config (cln backend + postgres)
│       └── cln-nutshell-postgres/
│           ├── compose.yml
│           └── env
└── README.md
```

## Topologies

**lnd configs** (`lnd-nutshell-sqlite`, `lnd-cdk-sqlite`):

```
lnd-alice ⇄ lnd-orchard ⇄ lnd-bob     (NO direct alice⇄bob — forces routing)
```

Plus tapd (if applicable), nutshell or cdk-mintd backed by `lnd-orchard`, and Orchard.

**cln configs** (`cln-cdk-*`, `cln-nutshell-*`):

```
cln-alice ⇄ cln-orchard ⇄ lnd-carol    (cross-implementation cln↔lnd)
```

Plus the mint backed by `cln-orchard` (unix socket for cdk, REST for nutshell).

## Running

```bash
# bring up (blocks until healthy)
npm run e2e:up lnd-nutshell-sqlite
npm run e2e:up cln-cdk-sqlite

# watch logs
npm run e2e:logs cln-cdk-sqlite

# inspect
npm run e2e:ps cln-cdk-sqlite

# tear down (removes all named volumes — fully clean)
npm run e2e:down cln-cdk-sqlite
```

## Ports exposed to the host

### lnd-nutshell-sqlite

| Service      | Host port | Purpose              |
|--------------|-----------|----------------------|
| bitcoind RPC | 18443     | chain manipulation   |
| lnd-orchard  | 10009     | gRPC                 |
| lnd-alice    | 10019     | gRPC                 |
| lnd-bob      | 10029     | gRPC                 |
| nutshell     | 3338      | mint HTTP API        |
| orchard      | 3322      | Orchard GraphQL + UI |

### lnd-cdk-sqlite (+ tapd)

| Service      | Host port  | Purpose                    |
|--------------|------------|----------------------------|
| bitcoind RPC | 18543      | chain manipulation         |
| lnd-orchard  | 10109      | gRPC                       |
| lnd-alice    | 10119      | gRPC                       |
| lnd-bob      | 10129      | gRPC                       |
| tapd-orchard | 10139      | gRPC                       |
| tapd-alice   | 10149      | gRPC                       |
| cdk-mintd    | 3349/8096  | mint HTTP / management RPC |
| orchard      | 3324       | Orchard GraphQL + UI       |

### cln-cdk-postgres

| Service      | Host port  | Purpose                    |
|--------------|------------|----------------------------|
| bitcoind RPC | 28443      | chain manipulation         |
| cln-orchard  | 21001      | gRPC                       |
| cln-alice    | 21011      | gRPC                       |
| lnd-carol    | 20029      | gRPC                       |
| postgres     | 5532       | shared DB                  |
| cdk-mintd    | 3339/8086  | mint HTTP / management RPC |
| orchard      | 3323       | Orchard GraphQL + UI       |

### cln-nutshell-postgres

| Service      | Host port  | Purpose                    |
|--------------|------------|----------------------------|
| bitcoind RPC | 28543      | chain manipulation         |
| cln-orchard  | 21101      | gRPC (+ clnrest on 3010 internal) |
| cln-alice    | 21111      | gRPC                       |
| lnd-carol    | 20129      | gRPC                       |
| postgres     | 5632       | shared DB                  |
| nutshell     | 3340       | mint HTTP API              |
| orchard      | 3325       | Orchard GraphQL + UI       |

All four configs have disjoint port ranges and can run concurrently. Pair-2 / cln
configs sit in the 20k/28k/55xx range to avoid collisions with Polar Lightning
(desktop app) which occupies 18443–18453 / 10000–13999 / 11000–11099.

## What the setup service does

Per-config `setup` compose service runs once, funds wallets, opens channel
topology, then exits.

- **lnd configs**: [fund-lnd-topology.sh](docker/scripts/fund-lnd-topology.sh)
  opens `alice → orchard` and `orchard → bob` channels.
- **cln configs**: [fund-cln-topology.sh](docker/scripts/fund-cln-topology.sh)
  opens `alice → orchard` and `orchard → carol` channels. Drives CLN via
  `docker exec` + `lightning-cli`. Notes:
    - funds Taproot addresses explicitly because CLN 25.12 signs with BIP86 keys
    - when `CREATE_RUNE_FOR=<node>` is set, mints a clnrest rune after channels
      open and writes it to `/shared/<node>.rune` for mint containers to read
      (used by `cln-nutshell-postgres` which authenticates nutshell → clnrest
      with a rune)

Downstream services (mint, orchard) depend on setup via
`service_completed_successfully`.

## Regenerating credentials

Every `e2e:down <config>` wipes named volumes — certs, macaroons, wallets,
runes, channel state are all regenerated on the next `e2e:up`. No committed
credential fixtures.

## Troubleshooting

- **Build takes forever first run**: builds Orchard + setup image from source.
  Subsequent runs hit Docker's layer cache.
- **Setup service exits non-zero**: `docker logs <config>-setup` shows the
  funding script's last action. Common causes: LN not fully synced, funding
  race, gossip propagation slow.
- **Port collision**: `lsof -iTCP:<port> -sTCP:LISTEN` finds the holder. If
  it's Polar Lightning's desktop app, its ports sit in the 18443–18453 and
  10000–13999 ranges.
