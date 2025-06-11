import { OrchardBitcoinInfo, OrchardBitcoinBlockCount } from "@shared/generated.types";

export type BitcoinInfoResponse = {
	bitcoin_info: OrchardBitcoinInfo;
}

export type BitcoinBlockCountResponse = {
  	bitcoin_blockcount: OrchardBitcoinBlockCount;
}
