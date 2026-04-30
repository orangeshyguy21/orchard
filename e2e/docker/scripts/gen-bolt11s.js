#!/usr/bin/env node
// Orchard e2e — bolt11 fixture generator for the fake-backed activity script.
//
// Emits a small JSON map of signed regtest bolt11 invoices at fixed amounts.
// activity-fake.sh picks a fixture per melt so the fake_wallet backend
// (cdk / nutshell) has a bolt11 to decode. Signatures are produced with a
// throwaway privkey — invoices are regtest-prefixed and unroutable by design.
//
// Usage: node gen-bolt11s.js <out-path>

const fs = require('fs');
const crypto = require('crypto');
const bolt11 = require('bolt11');

// Fixed amount set shared by every unit. bolt11's amount field is always
// msat/sat — the mint's fake backend decodes amount_msat and uses it as
// the quote amount in whatever unit the mint is configured for. All units
// share the same fixture map; if fiat melts end up requiring a different
// denomination strategy, set ACTIVITY_MELTS_<UNIT>=0 in compose.
const AMOUNTS = [100, 500, 1000];
const UNITS = ['sat', 'usd', 'eur'];

function makeInvoice(amount_sat, priv_key) {
    const unsigned = bolt11.encode({
        coinType: 'regtest',
        satoshis: amount_sat,
        timestamp: Math.floor(Date.now() / 1000),
        tags: [
            { tagName: 'payment_hash', data: crypto.randomBytes(32).toString('hex') },
            { tagName: 'payment_secret', data: crypto.randomBytes(32).toString('hex') },
            { tagName: 'description', data: `e2e-fake-melt-${amount_sat}` },
        ],
    });
    return bolt11.sign(unsigned, priv_key).paymentRequest;
}

function main() {
    const out_path = process.argv[2] || '/shared/fake-bolt11s.json';
    const priv_key = crypto.randomBytes(32).toString('hex');
    const fixtures = Object.fromEntries(AMOUNTS.map((a) => [String(a), makeInvoice(a, priv_key)]));
    const payload = Object.fromEntries(UNITS.map((u) => [u, fixtures]));
    fs.writeFileSync(out_path, JSON.stringify(payload, null, 2));
    console.log(`wrote ${AMOUNTS.length} fixtures × ${UNITS.length} units → ${out_path}`);
}

main();
