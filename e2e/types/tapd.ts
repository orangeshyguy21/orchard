/** Single asset record from `tapcli assets list`, narrowed to the fields
 *  specs read. tapd's response carries many more — extend as needed. */
export type TapdAsset = {
	asset_genesis: {name: string; asset_id: string; asset_type: string};
	asset_group?: {tweaked_group_key?: string};
	amount: string;
	decimal_display?: {decimal_display?: number};
	version: string;
};
