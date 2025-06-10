export type TaprootAssetsInfo = {
    version: string;
    lnd_version: string;
    network: string;
    lnd_identity_pubkey: string;
    node_alias: string;
    block_height: number;
    block_hash: string;
    sync_to_chain: boolean;
}