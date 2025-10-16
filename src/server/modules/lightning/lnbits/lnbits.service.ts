/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
import {FetchService} from '@server/modules/fetch/fetch.service';
/* Native Dependencies */
import {
	LightningInfo,
	LightningChannelBalance,
	LightningRequest,
} from '@server/modules/lightning/lightning/lightning.types';
import {LightningAddresses} from '@server/modules/lightning/walletkit/lnwalletkit.types';
import {LightningAddressType} from '@server/modules/lightning/lightning.enums';
/* Local Dependencies */
import {mapRequestType, mapRequestDescription, mapRequestExpiry, mapLnbitsError} from './lnbits.helpers';

@Injectable()
export class LnbitsService {
	private readonly logger = new Logger(LnbitsService.name);
	private api_url: string;
	private api_key: string;

	constructor(
		private configService: ConfigService,
		private credentialService: CredentialService,
		private fetchService: FetchService,
	) {}

	private getApiCredentials() {
		this.api_url = this.configService.get('lightning.api_url');
		this.api_key = this.configService.get('lightning.api_key');

		if (!this.api_url || !this.api_key) {
			this.logger.warn('Missing LNbits API credentials, connection cannot be established');
			return null;
		}

		if (this.api_key && this.api_key.includes('/')) {
			const loaded_key_buffer = this.credentialService.loadPemOrPath(this.api_key);
			if (loaded_key_buffer) {
				this.api_key = loaded_key_buffer.toString('utf8').trim();
			}
		}

		return {api_url: this.api_url, api_key: this.api_key};
	}

	private async makeHttpRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
		const credentials = this.getApiCredentials();
		if (!credentials) {
			throw new Error('LNbits API credentials not configured');
		}

		const url = `${credentials.api_url}${endpoint}`;
		const headers = {
			'X-Api-Key': credentials.api_key,
			'Content-Type': 'application/json',
			...options.headers,
		};

		try {
			const response = await this.fetchService.fetchWithProxy(url, {
				...options,
				headers,
			});

			if (!response.ok) {
				let errorMessage = `HTTP ${response.status}`;
				try {
					const errorData = await response.json();
					errorMessage = mapLnbitsError(errorData);
				} catch {
					errorMessage = await response.text() || errorMessage;
				}
				this.logger.error(`LNbits API error: ${response.status} - ${errorMessage}`);
				throw new Error(`LNbits API error: ${response.status} - ${errorMessage}`);
			}

			return await response.json();
		} catch (error) {
			this.logger.error(`LNbits request failed: ${error.message}`);
			throw error;
		}
	}

	public initializeLightningClient(): LnbitsService {
		const credentials = this.getApiCredentials();
		if (credentials) {
			this.logger.log('LNbits HTTP client initialized');
			return this;
		}
		throw new Error('Failed to initialize LNbits client');
	}

	public initializeWalletKitClient(): LnbitsService {
		return this.initializeLightningClient();
	}

	public async getLnbitsInfo(): Promise<any> {
		return this.makeHttpRequest('/lndhub/ext/getinfo');
	}

	public async getLnbitsBalance(): Promise<any> {
		const walletData = await this.makeHttpRequest('/api/v1/wallet');
		return Math.floor(walletData.balance / 1000).toString();
	}

	public async decodeLnbitsInvoice(invoice: string): Promise<any> {
		return this.makeHttpRequest(`/lndhub/ext/decodeinvoice?invoice=${encodeURIComponent(invoice)}`);
	}

	public async getLnbitsBtcAddress(): Promise<any> {
		return this.makeHttpRequest('/lndhub/ext/getbtc');
	}

	public async getLnbitsTransactions(): Promise<any> {
		return this.makeHttpRequest('/lndhub/ext/gettxs');
	}

	public async getLnbitsPendingTransactions(): Promise<any> {
		return this.makeHttpRequest('/lndhub/ext/getpending');
	}

	public async mapLnbitsInfo(info: any): Promise<LightningInfo> {
		return {
			version: info?.version || 'LNbits',
			commit_hash: '',
			identity_pubkey: info?.identity_pubkey || '',
			alias: info?.alias || 'LNbits Wallet',
			color: '#000000',
			num_pending_channels: 0,
			num_active_channels: 0,
			num_inactive_channels: 0,
			num_peers: 0,
			block_height: info?.block_height || 0,
			block_hash: info?.block_hash || '',
			best_header_timestamp: info?.best_header_timestamp || 0,
			synced_to_chain: true,
			synced_to_graph: true,
			testnet: info?.testnet || false,
			chains: [{chain: 'bitcoin', network: info?.testnet ? 'testnet' : 'mainnet'}],
			uris: [],
			require_htlc_interceptor: false,
			store_final_htlc_resolutions: false,
			features: {},
		};
	}

	public async mapLnbitsChannelBalance(balance: any): Promise<LightningChannelBalance> {
		const balanceStr = balance?.toString() || '0';
		
		return {
			balance: balanceStr,
			pending_open_balance: '0',
			local_balance: {sat: balanceStr, msat: (parseInt(balanceStr) * 1000).toString()},
			remote_balance: {sat: '0', msat: '0'},
			unsettled_local_balance: {sat: '0', msat: '0'},
			unsettled_remote_balance: {sat: '0', msat: '0'},
			pending_open_local_balance: {sat: '0', msat: '0'},
			pending_open_remote_balance: {sat: '0', msat: '0'},
			custom_channel_data: Buffer.alloc(0),
		};
	}

	public mapLnbitsRequest(request: any): LightningRequest {
		return {
			type: mapRequestType(request?.type),
			valid: request?.valid ?? true, // LNbits generalmente retorna invoices válidos
			expiry: mapRequestExpiry(request),
			description: mapRequestDescription(request?.description),
			offer_quantity_max: request?.offer_quantity_max ?? null,
		};
	}

	public async mapLnbitsAddresses(btcAddress: any): Promise<LightningAddresses> {
		const address = typeof btcAddress === 'string' ? btcAddress : btcAddress?.address;
		
		if (!address) {
			return {account_with_addresses: []};
		}

		return {
			account_with_addresses: [
				{
					name: 'LNbits Onchain',
					address_type: this.detectAddressType(address),
					derivation_path: '',
					addresses: [
						{
							address: address,
							is_internal: 'false',
							balance: 0,
							derivation_path: '',
							public_key: Buffer.alloc(0),
						},
					],
				},
			],
		};
	}

	private detectAddressType(address: string): LightningAddressType {
		if (address.startsWith('bc1q') || address.startsWith('tb1q')) {
			return LightningAddressType.WITNESS_PUBKEY_HASH;
		}
		if (address.startsWith('3') || address.startsWith('2')) {
			return LightningAddressType.NESTED_WITNESS_PUBKEY_HASH;
		}
		if (address.startsWith('bc1p') || address.startsWith('tb1p')) {
			return LightningAddressType.TAPROOT_PUBKEY;
		}
		return LightningAddressType.UNKOWN;
	}
}