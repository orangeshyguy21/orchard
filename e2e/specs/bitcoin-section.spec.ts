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
import {gqlData, interceptOnNavigation} from '../helpers/gql-intercept';

test('bitcoin section queries agree with bitcoind', async ({page}, testInfo) => {
	const config = getConfig(testInfo.project.name);
	await loginViaUi(page, config);

	const responses = await interceptOnNavigation(page, '/bitcoin', [
		'bitcoin_network_info',
		'bitcoin_blockchain_info',
	]);

	const orchardNetwork = await gqlData(responses.bitcoin_network_info, 'bitcoin_network_info');
	expectAllFieldsAgree('network', orchardNetwork, btc.getNetworkInfo(config), [
		'version',
		'subversion',
		'protocolversion',
		'networkactive',
		'relayfee',
		'incrementalfee',
	]);

	const orchardChain = await gqlData(responses.bitcoin_blockchain_info, 'bitcoin_blockchain_info');
	expectAllFieldsAgree('chain', orchardChain, btc.getBlockchainInfo(config), [
		'chain',
		'blocks',
		'headers',
		'bestblockhash',
		'difficulty',
		'chainwork',
		'pruned',
		'initialblockdownload',
	]);

	// Cross-query sanity: both resolvers' views of the chain tip agree with bitcoind's.
	agree('blockcount consistency', orchardChain.blocks, btc.blockCount(config));
});
