import { 
	OrchardBitcoinBlockchainInfo, 
	OrchardBitcoinBlockCount, 
	OrchardBitcoinNetworkInfo, 
	OrchardBitcoinBlock,
	OrchardBitcoinMempoolTransaction,
	OrchardBitcoinTxFeeEstimate,
	OrchardBitcoinBlockTemplate,
} from "@shared/generated.types";

export type BitcoinBlockchainInfoResponse = {
	bitcoin_blockchain_info: OrchardBitcoinBlockchainInfo;
}

export type BitcoinBlockCountResponse = {
  	bitcoin_blockcount: OrchardBitcoinBlockCount;
}

export type BitcoinNetworkInfoResponse = {
	bitcoin_network_info: OrchardBitcoinNetworkInfo;
}

export type BitcoinBlockResponse = {
	bitcoin_block: OrchardBitcoinBlock;
}

export type BitcoinMempoolTransactionsResponse = {
	bitcoin_mempool_transactions: OrchardBitcoinMempoolTransaction[];
}

export type BitcoinTransactionFeeEstimatesResponse = {
	bitcoin_transaction_fee_estimates: OrchardBitcoinTxFeeEstimate[];
}

export type BitcoinBlockTemplateResponse = {
	bitcoin_block_template: OrchardBitcoinBlockTemplate;
}