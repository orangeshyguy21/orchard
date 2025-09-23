<h1 align="center">Orchard</h1>

<p align="center">
  <br>
  <img src="src/client/assets/img/orchard-logo.svg" alt="orchard-logo" width="150px"/>
  <br>
  <br>
  <em>Your sovereign bank in cyberspace</em>
  <br>
</p>

<hr>

# Implementation support

| Protocol       | Implementation                     | Version                    |
| -------------- | ---------------------------------- | -------------------------- |
| Bitcoin        | core                               | (^Satoshi:28.0.0)          |
| Lightning      | lnd, cln                           | (^v0.19.0-beta), (^v25.02) |
| Cashu Mint     | cdk, nutshell                      | (^v0.13.0), (^0.17.1)      |
| Taproot Assets | tapd                               | (^v0.6.1-alpha)            |
| AI             | ollama                             | (^0.11.11)                 |

<br>
<br>

# Setup

## Prerequisites

- Install [Node.js] which includes [Node Package Manager][npm]
  - Recommended version (v24)

## Environment Variables
```bash
mv .env.example .env
# edit .env file
nano .env
```

## Configuration Options
|           | Orchard | Bitcoin | Lightning  | Taproot Assets | Cashu Mint | AI |
| --------- | ------- | ------- | ---------- | -------------- | ---------- | -- |
| Required  | ✅      |         |            |                |            |     |
| Optional  |         | ✅      | ✅          | ✅             | ✅         | ✅  |

<br>
<br>

# Production Setup

## Run the application (standard)
```bash
npm install
npm run build
npm run start
```

## Updating
```bash
git pull
npm install
npm run build
npm run start
```

## Run the application (docker)

### Sqlite Cashu Mint
```bash
# Additional env vars
MINT_DATANAME=mint.sqlite3
MINT_DATADIR=/path/to/data/directory
```
```bash
docker compose build orchard
docker compose -f docker-compose.yml -f docker-compose.sqlite.yml up -d
```

### Postgres Cashu Mint
```bash
docker compose build orchard
docker compose up -d
```

<br>
<br>

# Development Setup

## Run the application

### Package Management 
```bash
npm install
```

### Client
```bash
npm run start:client
```

### Server
```bash
npm run start:server
```
