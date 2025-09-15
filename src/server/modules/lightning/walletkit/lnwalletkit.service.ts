/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {LightningType} from '@server/modules/lightning/lightning.enums';
import {LndService} from '@server/modules/lightning/lnd/lnd.service';
import {ClnService} from '@server/modules/lightning/cln/cln.service';
import {LightningAddressType} from '@server/modules/lightning/lightning.enums';
/* Local Dependencies */
import {LightningAddresses} from './lnwalletkit.types';

@Injectable()
export class LightningWalletKitService implements OnModuleInit {
	private readonly logger = new Logger(LightningWalletKitService.name);

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
		if (this.type === 'lnd') this.grpc_client = this.lndService.initializeWalletKitClient();
		if (this.type === 'cln') this.grpc_client = this.clnService.initializeLightningClient();
	}

	private makeGrpcRequest(method: string, request: any): Promise<any> {
		if (!this.grpc_client) throw OrchardErrorCode.LightningRpcConnectionError;

		return new Promise((resolve, reject) => {
			if (!(method in this.grpc_client)) reject(OrchardErrorCode.LightningSupportError);
			this.grpc_client[method](request, (error: Error | null, response: any) => {
				if (error && error?.message?.includes('14 UNAVAILABLE')) reject(OrchardErrorCode.LightningRpcConnectionError);
				if (error) reject(error);
				resolve(response);
			});
		});
	}

	private mapClnAddresses(resp: any): LightningAddresses {
		const entries: any[] = Array.isArray(resp?.addresses) ? resp.addresses : [];

		const mkAddress = (addr: string) => ({
			address: addr,
			is_internal: 'false',
			balance: 0,
			derivation_path: '',
			public_key: Buffer.alloc(0),
		});

		const bech32 = entries.map((e) => e?.bech32).filter((x: string) => !!x);
		const p2tr = entries.map((e) => e?.p2tr).filter((x: string) => !!x);

		const account_with_addresses: LightningAddresses['account_with_addresses'] = [];

		if (bech32.length) {
			account_with_addresses.push({
				name: 'bech32',
				address_type: LightningAddressType.WITNESS_PUBKEY_HASH,
				derivation_path: '',
				addresses: bech32.map(mkAddress),
			});
		}

		if (p2tr.length) {
			account_with_addresses.push({
				name: 'p2tr',
				address_type: LightningAddressType.TAPROOT_PUBKEY,
				derivation_path: '',
				addresses: p2tr.map(mkAddress),
			});
		}

		return {account_with_addresses};
	}

	async getLightningAddresses(): Promise<LightningAddresses> {
		// return this.makeGrpcRequest('ListAddresses', {});
		if (this.type === 'lnd') return this.makeGrpcRequest('ListAddresses', {});
		if (this.type === 'cln') {
			const addresses = await this.makeGrpcRequest('ListAddresses', {});
			return this.mapClnAddresses(addresses);
		}
	}
}
