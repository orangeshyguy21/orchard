/**
 * /bitcoin fidelity — the Bitcoin section container.
 *
 * On navigation, BitcoinSectionComponent fires two queries via its service:
 *   - bitcoin_network_info  (loadBitcoinNetworkInfo)
 *   - bitcoin_blockchain_info  (loadBitcoinBlockchainInfo)
 *
 * The subsection dashboard at `/bitcoin` is a stub — no additional queries
 * fire there today. When real dashboard content lands, add intercepts here.
 */

import {test} from '@playwright/test';

import {getConfig} from '../helpers/config';
import {loginViaUi} from '../helpers/auth';
import {btc} from '../helpers/backend';
import {agree, expectAllFieldsAgree} from '../helpers/agree';
import {interceptOnNavigation} from '../helpers/gql-intercept';
import {BITCOIN_BLOCKCHAIN_INFO_FIELDS, BITCOIN_NETWORK_INFO_FIELDS} from '../helpers/query-fields';

test('bitcoin section queries agree with bitcoind', async ({page}, testInfo) => {
	const config = getConfig(testInfo.project.name);
	await loginViaUi(page, config);

	const data = await interceptOnNavigation(page, '/bitcoin', [
		'bitcoin_network_info',
		'bitcoin_blockchain_info',
	]);

	expectAllFieldsAgree('network', data.bitcoin_network_info, btc.getNetworkInfo(config), BITCOIN_NETWORK_INFO_FIELDS);
	expectAllFieldsAgree('chain', data.bitcoin_blockchain_info, btc.getBlockchainInfo(config), BITCOIN_BLOCKCHAIN_INFO_FIELDS);

	// Cross-query sanity: both resolvers' views of the chain tip agree with bitcoind's.
	agree('blockcount consistency', data.bitcoin_blockchain_info.blocks, btc.blockCount(config));
});
