#!/usr/bin/env python3
# Orchard e2e — bolt11 fixture generator for the fake-backed activity script.
#
# Emits a small JSON map of signed regtest bolt11 invoices at fixed amounts.
# activity-fake.sh picks a fixture per melt so the fake_wallet backend
# (cdk / nutshell) has a bolt11 to decode. Signatures are produced with a
# throwaway privkey — invoices are regtest-prefixed and unroutable by design.
#
# Usage: python gen-bolt11s.py <out-path>

import json
import secrets
import sys
import time

from bolt11 import Bolt11, Tags, encode
from bolt11.models.tags import Tag, TagChar

# Fixed amount set shared by every unit. bolt11's amount field is always
# msat/sat — the mint's fake backend decodes amount_msat and uses it as
# the quote amount in whatever unit the mint is configured for. All units
# share the same fixture map; if fiat melts end up requiring a different
# denomination strategy, set ACTIVITY_MELTS_<UNIT>=0 in compose.
AMOUNTS = [100, 500, 1000]


def make_invoice(amount_sat: int, privkey: str) -> str:
    tags = Tags()
    tags.add(TagChar.payment_hash, secrets.token_hex(32))
    tags.add(TagChar.payment_secret, secrets.token_hex(32))
    tags.add(TagChar.description, f"e2e-fake-melt-{amount_sat}")
    invoice = Bolt11(
        currency="bcrt",
        date=int(time.time()),
        tags=tags,
        amount_msat=amount_sat * 1000,
    )
    return encode(invoice, privkey)


def main() -> int:
    out_path = sys.argv[1] if len(sys.argv) > 1 else "/shared/fake-bolt11s.json"
    privkey = secrets.token_hex(32)
    fixtures = {str(a): make_invoice(a, privkey) for a in AMOUNTS}
    units = ["sat", "usd", "eur"]
    payload = {unit: fixtures for unit in units}
    with open(out_path, "w") as f:
        json.dump(payload, f, indent=2)
    print(f"wrote {len(AMOUNTS)} fixtures × {len(units)} units → {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
