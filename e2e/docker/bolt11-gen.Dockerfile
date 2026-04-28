# Orchard e2e — bolt11 fixture generator.
#
# One-shot container: emits a small set of signed regtest bolt11 invoices
# to /shared/fake-bolt11s.json for the activity script to melt toward.
# Slim Debian base so secp256k1 prebuilt binaries resolve cleanly.
FROM node:22-slim
WORKDIR /app
RUN npm install --omit=dev --no-package-lock bolt11@1.4.1
