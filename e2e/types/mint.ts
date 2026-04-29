/** NUT-06 `/v1/info` shape, narrowed to the fields the dashboard's mint
 *  card renders. The full Cashu spec includes `pubkey`, `nuts`, etc. —
 *  add fields here as specs need them. `urls` is optional in NUT-06 and
 *  null/missing on fixtures that don't advertise public URLs. */
export type MintNutInfo = {
	name?: string | null;
	description?: string | null;
	description_long?: string | null;
	icon_url?: string | null;
	urls?: string[] | null;
	version?: string;
};
