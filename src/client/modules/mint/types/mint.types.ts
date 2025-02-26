import { OrchardMintBalance, OrchardMintInfo, OrchardMintKeyset, OrchardMintPromise } from "@shared/generated.types";

export type MintInfoResponse = {
  	mint_info: OrchardMintInfo;
}

export type MintBalancesResponse = {
  	mint_balances: OrchardMintBalance[];
}

export type MintKeysetsResponse = {
  	mint_keysets: OrchardMintKeyset[];
}

export type MintPromisesResponse = {
  	mint_promises: OrchardMintPromise[];
}