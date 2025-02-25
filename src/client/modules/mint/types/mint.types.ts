import { OrchardMintBalance, OrchardMintInfo, OrchardMintKeyset } from "@shared/generated.types";

export type MintInfoResponse = {
  	mint_info: OrchardMintInfo;
}

export type MintBalancesResponse = {
  	mint_balances: OrchardMintBalance[];
}

export type MintKeysetsResponse = {
  	mint_keysets: OrchardMintKeyset[];
}