/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {LightningType} from '@server/modules/lightning/lightning.enums';
import {LndService} from '@server/modules/lightning/lnd/lnd.service';
import {ClnService} from '@server/modules/lightning/cln/cln.service';
/* Local Dependencies */
import {LightningInfo, LightningChannelBalance} from './lightning.types';

@Injectable()
export class LightningService implements OnModuleInit {
	private readonly logger = new Logger(LightningService.name);

	private grpc_client: any = null;
	private type: LightningType;

	constructor(
		private configService: ConfigService,
		private lndService: LndService,
		private clnService: ClnService,
	) {}

	public async onModuleInit() {
		this.type = this.configService.get('lightning.type');
		this.initializeGrpcClients();
	}

	private initializeGrpcClients() {
		if (this.type === 'lnd') this.grpc_client = this.lndService.initializeLightningClient();
		if (this.type === 'cln') this.grpc_client = this.clnService.initializeLightningClient();
	}

	private makeGrpcRequest(method: string, request: any): Promise<any> {
		if (!this.grpc_client) throw OrchardErrorCode.LightningRpcConnectionError;

		return new Promise((resolve, reject) => {
			if (!(method in this.grpc_client)) reject(OrchardErrorCode.LightningSupportError);
			this.grpc_client[method](request, (error: Error | null, response: any) => {
				if (error) this.logger.debug('error', error);
				if (error && error?.message?.includes('14 UNAVAILABLE')) reject(OrchardErrorCode.LightningRpcConnectionError);
				if (error) reject(error);
				resolve(response);
			});
		});
	}

	async getLightningInfo(): Promise<LightningInfo> {
		if (this.type === 'lnd') return this.makeGrpcRequest('GetInfo', {});
		if (this.type === 'cln') return this.mapClnInfo();
	}

	async getLightningChannelBalance(): Promise<LightningChannelBalance> {
		if (this.type === 'lnd') return this.makeGrpcRequest('ChannelBalance', {});
		if (this.type === 'cln') return this.getClnChannelBalance();
	}

	private async mapClnInfo(): Promise<LightningInfo> {
		const info = await this.makeGrpcRequest('Getinfo', {});
		const toHex = (v: any): string => {
			if (v == null) return '';
			if (Buffer.isBuffer(v)) return v.toString('hex');
			if (typeof v === 'string') return v.replace(/^#/, '');
			return '';
		};

		const id_hex = toHex(info?.id);
		const color_hex = toHex(info?.color).toLowerCase();
		const network: string = info?.network ?? '';
		const addresses: any[] = Array.isArray(info?.address) ? info.address : [];

		const uris: string[] = addresses
			.map((a: any) => {
				const addr = a?.address;
				const port = a?.port;
				if (!id_hex || !addr || !port) return null;
				return `${id_hex}@${addr}:${port}`;
			})
			.filter((x: string | null): x is string => !!x);

		return {
			version: info?.version ?? '',
			commit_hash: '',
			identity_pubkey: id_hex,
			alias: info?.alias ?? '',
			color: color_hex,
			num_pending_channels: info?.num_pending_channels ?? 0,
			num_active_channels: info?.num_active_channels ?? 0,
			num_inactive_channels: info?.num_inactive_channels ?? 0,
			num_peers: info?.num_peers ?? 0,
			block_height: info?.blockheight ?? 0,
			block_hash: '',
			best_header_timestamp: 0,
			synced_to_chain: true,
			synced_to_graph: true,
			testnet: !(network === 'bitcoin' || network === 'mainnet'),
			chains: [{chain: 'bitcoin', network}],
			uris,
			require_htlc_interceptor: false,
			store_final_htlc_resolutions: false,
			features: {},
		};
	}

	private asBigIntMsat(v: any): bigint {
		if (v == null) return BigInt(0);
		if (typeof v === 'object' && 'msat' in v) v = v.msat;
		if (typeof v === 'string') return BigInt(v);
		if (typeof v === 'number') return BigInt(Math.trunc(v));
		try {
			return BigInt(v);
		} catch {
			return BigInt(0);
		}
	}

	private msatToStrings(msatLike: any): {sat: string; msat: string} {
		const msat = this.asBigIntMsat(msatLike);
		return {sat: (msat / BigInt(1000)).toString(), msat: msat.toString()};
	}

	private sumMsat(items: any[], selector: (x: any) => any): bigint {
		let total = BigInt(0);
		for (const it of items || []) total += this.asBigIntMsat(selector(it));
		return total;
	}

	private async getClnChannelBalance(): Promise<LightningChannelBalance> {
		const [funds, peers] = await Promise.all([this.makeGrpcRequest('ListFunds', {}), this.makeGrpcRequest('ListPeerChannels', {})]);

		const openStates = new Set(['ChanneldNormal']);
		const pendingStates = new Set([
			'Openingd',
			'ChanneldAwaitingLockin',
			'DualopendOpenInit',
			'DualopendAwaitingLockin',
			'ChanneldAwaitingSplice',
			'DualopendOpenCommitted',
			'DualopendOpenCommittReady',
		]);

		const fundChans = funds?.channels ?? [];
		const peerChans = peers?.channels ?? [];

		const openFundChans = fundChans.filter((c: any) => openStates.has(c.state));
		const pendingFundChans = fundChans.filter((c: any) => pendingStates.has(c.state));
		const openPeerChans = peerChans.filter((c: any) => openStates.has(c.state));

		let localOpenMsat = this.sumMsat(openPeerChans, (c: any) => c.to_us_msat ?? 0);
		if (localOpenMsat === BigInt(0)) {
			localOpenMsat = this.sumMsat(openFundChans, (c: any) => c.our_amount_msat ?? 0);
		}

		let remoteOpenMsat = BigInt(0);
		for (const c of openPeerChans) {
			const total = this.asBigIntMsat(c.total_msat);
			const toUs = this.asBigIntMsat(c.to_us_msat);
			if (total > BigInt(0)) remoteOpenMsat += total - toUs;
		}
		if (remoteOpenMsat === BigInt(0)) {
			for (const c of openFundChans) {
				const total = this.asBigIntMsat(c.amount_msat);
				const ours = this.asBigIntMsat(c.our_amount_msat);
				if (total > BigInt(0)) remoteOpenMsat += total - ours;
			}
		}

		let unsettledLocalMsat = BigInt(0);
		let unsettledRemoteMsat = BigInt(0);
		for (const c of openPeerChans) {
			for (const h of c.htlcs || []) {
				const amt = this.asBigIntMsat(h.amount_msat);
				const dir = h.direction; // 'IN' | 'OUT'
				if (dir === 'OUT') unsettledLocalMsat += BigInt(amt);
				else if (dir === 'IN') unsettledRemoteMsat += BigInt(amt);
			}
		}

		const pendingLocalMsat = this.sumMsat(pendingFundChans, (c: any) => c.our_amount_msat);
		let pendingRemoteMsat = BigInt(0);
		for (const c of pendingFundChans) {
			const total = this.asBigIntMsat(c.amount_msat);
			const ours = this.asBigIntMsat(c.our_amount_msat);
			if (total > BigInt(0)) pendingRemoteMsat += total - ours;
		}

		return {
			balance: (localOpenMsat / BigInt(1000)).toString(),
			pending_open_balance: (pendingLocalMsat / BigInt(1000)).toString(),
			local_balance: this.msatToStrings(localOpenMsat),
			remote_balance: this.msatToStrings(remoteOpenMsat),
			unsettled_local_balance: this.msatToStrings(unsettledLocalMsat),
			unsettled_remote_balance: this.msatToStrings(unsettledRemoteMsat),
			pending_open_local_balance: this.msatToStrings(pendingLocalMsat),
			pending_open_remote_balance: this.msatToStrings(pendingRemoteMsat),
			custom_channel_data: Buffer.alloc(0),
		};
	}
}
