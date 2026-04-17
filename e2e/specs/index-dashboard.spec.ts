/**
 * `/` fidelity — the operator index dashboard.
 *
 * The landing page fires a wide forkJoin across every enabled backend (chain,
 * LN, mint, tapd, oracle, analytics). This spec covers the passthrough-friendly
 * subset where backend truth is one `docker exec` away:
 *
 *   - bitcoin_blockchain_info  (also fired by the layout wrapper on any authed route)
 *   - bitcoin_network_info     (index-dashboard-specific)
 *   - lightning_info           (layout wrapper)
 *
 * Deferred to dedicated section specs:
 *   - lightning_balance, lightning_wallet, lightning_channels, lightning_closed_channels
 *   - mint_info, mint_balances, mint_keysets, mint_activity_summary
 *   - taproot_assets_info, taproot_assets (config.tapd only)
 *   - bitcoin_block_template, bitcoin_transaction_fee_estimates (derived / flaky on idle regtest)
 *   - bitcoin_oracle (mainnet-only)
 *   - crew_user, ai_models (Orchard-internal state, no upstream truth)
 */

import {test} from '@playwright/test';

import {getConfig} from '../helpers/config';
import {loginViaUi} from '../helpers/auth';
import {btc, ln} from '../helpers/backend';
import {expectAllFieldsAgree, agree} from '../helpers/agree';
import {interceptOnNavigation} from '../helpers/gql-intercept';
import {BITCOIN_BLOCKCHAIN_INFO_FIELDS, BITCOIN_NETWORK_INFO_FIELDS} from '../helpers/query-fields';

test('index dashboard queries agree with backends', async ({page}, testInfo) => {
	const config = getConfig(testInfo.project.name);
	await loginViaUi(page, config);

	const data = await interceptOnNavigation(page, '/', [
		'bitcoin_blockchain_info',
		'bitcoin_network_info',
		'lightning_info',
	]);

	expectAllFieldsAgree('chain', data.bitcoin_blockchain_info, btc.getBlockchainInfo(config), BITCOIN_BLOCKCHAIN_INFO_FIELDS);
	expectAllFieldsAgree('network', data.bitcoin_network_info, btc.getNetworkInfo(config), BITCOIN_NETWORK_INFO_FIELDS);

	// LN node field shapes diverge between lnd & cln — compare only ones present on both.
	const backendLn = ln.getInfo(config) as {alias: string; version: string};
	agree('ln.alias', data.lightning_info.alias, backendLn.alias);
	agree('ln.version', data.lightning_info.version, backendLn.version);
});
