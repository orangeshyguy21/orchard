<h1 align="center">Orchard</h1>

<p align="center">
  <br>
  <img src="src/client/public/assets/orchard-logo-color-v2.svg" alt="orchard-logo" width="150px"/>
  <br>
  <br>
  <em>A super application for cashu mints</em>
  <br>
</p>

<hr>

### Implementation support

- Bitcoin Lightning support (LND)
- Cashu mint support (nutshell)

# Development Setup

## Prerequisites

- Install [Node.js] which includes [Node Package Manager][npm]

## Run the application

### Configuration
```bash
mv .env.example .env.local
# edit .env file
vim .env
```

### Client
```bash
npm run start:client
```

### Server
```bash
npm run start:server
```


# Production Setup

```bash
npm run build
npm run start
```