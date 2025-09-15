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

- Bitcoin
  - core
- Lightning
  - lnd
- Cashu Mint
  - cdk (sqlite, postgreSQL)
    - Lacks support for fee revenue
  - nutshell (sqlite, postgreSQL)
    - Management RPC still in development. Waiting on official release
- Taproot Assets
  - tapd
- AI
  - ollama

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

## Environment Variable Options
```bash
# --------------------------------------------
# Environment Configs (required)
# --------------------------------------------

# --------------------------------------------
# Orchard Configs (required)
# --------------------------------------------

# --------------------------------------------
# Bitcoin Configs (optional)
# --------------------------------------------

# --------------------------------------------
# Lightning Configs (optional)
# --------------------------------------------

# --------------------------------------------
# Taproot Configs (optional)
# --------------------------------------------

# --------------------------------------------
# Cashu Mint Configs (optional)
# --------------------------------------------

# --------------------------------------------
# AI Configs (optional)
# --------------------------------------------
```

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
```
docker compose build orchard
docker compose -f docker-compose.yml -f docker-compose.sqlite.yml up -d
```

### Postgres Cashu Mint
```
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
