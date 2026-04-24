# Orchard e2e — bolt11 fixture generator.
#
# One-shot container: emits a small set of signed regtest bolt11 invoices
# to /shared/fake-bolt11s.json for the activity script to melt toward.
# Debian-based so `pip install bolt11` works without Alpine's native-build
# dance for secp256k1. Image pulled once per stack rebuild; ignored after.
FROM python:3.12-slim
RUN pip install --no-cache-dir bolt11==2.1.1
