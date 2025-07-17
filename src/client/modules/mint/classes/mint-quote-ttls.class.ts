/* Shared Dependencies */
import {OrchardMintQuoteTtls} from '@shared/generated.types';

export class MintQuoteTtls implements OrchardMintQuoteTtls {
	melt_ttl: number | null;
	mint_ttl: number | null;

	constructor(omqt: OrchardMintQuoteTtls) {
		this.melt_ttl = omqt.melt_ttl ?? null;
		this.mint_ttl = omqt.mint_ttl ?? null;
	}
}
