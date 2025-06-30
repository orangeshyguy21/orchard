import { 
	OrchardBitcoinBlockchainInfo, 
	OrchardBitcoinBlockCount, 
	OrchardBitcoinNetworkInfo, 
	OrchardBitcoinBlock,
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