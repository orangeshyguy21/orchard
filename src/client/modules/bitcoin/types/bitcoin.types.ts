import { OrchardBitcoinBlockchainInfo, OrchardBitcoinBlockCount, OrchardBitcoinNetworkInfo } from "@shared/generated.types";

export type BitcoinBlockchainInfoResponse = {
	bitcoin_blockchain_info: OrchardBitcoinBlockchainInfo;
}

export type BitcoinBlockCountResponse = {
  	bitcoin_blockcount: OrchardBitcoinBlockCount;
}

export type BitcoinNetworkInfoResponse = {
	bitcoin_network_info: OrchardBitcoinNetworkInfo;
}