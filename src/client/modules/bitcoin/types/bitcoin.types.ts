import { 
	OrchardBitcoinBlockchainInfo, 
	OrchardBitcoinBlockCount, 
	OrchardBitcoinNetworkInfo, 
	OrchardBitcoinBlock,
	OrchardBitcoinMempoolTransaction,
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