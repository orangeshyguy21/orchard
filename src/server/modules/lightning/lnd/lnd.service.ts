/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
/* Vendor Dependencies */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
/* Application Dependencies */
import {LightningRequest} from '@server/modules/lightning/lightning/lightning.types';
/* Local Dependencies */
import {mapRequestType, mapRequestDescription, mapRequestExpiry} from './lnd.helpers';

@Injectable()
export class LndService {
	private readonly logger = new Logger(LndService.name);

	constructor(private configService: ConfigService) {}

	private createGrpcCredentials() {
		const rpc_host = this.configService.get('lightning.host');
		const rpc_port = this.configService.get('lightning.port');
		const rpc_macaroon = this.configService.get('lightning.macaroon');
		const rpc_tls_cert = this.configService.get('lightning.cert');

		if (!rpc_host || !rpc_port || !rpc_macaroon || !rpc_tls_cert) {
			this.logger.warn('Missing LND RPC credentials, secure connection cannot be established');
			return null;
		}

		const rpc_url = `${rpc_host}:${rpc_port}`;
		const macaroon_content = fs.readFileSync(rpc_macaroon);
		const macaroon_hex = macaroon_content.toString('hex');
		const cert_content = fs.readFileSync(rpc_tls_cert);
		const metadata = new grpc.Metadata();
		metadata.add('macaroon', macaroon_hex);
		const macaroon_creds = grpc.credentials.createFromMetadataGenerator((args, callback) => {
			callback(null, metadata);
		});
		const ssl_creds = grpc.credentials.createSsl(cert_content);
		const combined_creds = grpc.credentials.combineChannelCredentials(ssl_creds, macaroon_creds);

		// When running in Docker, we connect to host.docker.internal but need to verify against localhost
		let channel_options: Record<string, any> | undefined = undefined;
		if (rpc_host?.includes('host.docker.internal')) {
			channel_options = {
				'grpc.ssl_target_name_override': 'localhost',
				'grpc.default_authority': 'localhost',
			};
		}

		return {rpc_url, combined_creds, channel_options};
	}

	private initializeGrpcClient(proto_paths: string[], package_namespace: string, client_class: string): grpc.Client {
		const credentials = this.createGrpcCredentials();
		if (!credentials) return;

		try {
			const package_definition = protoLoader.loadSync(proto_paths, {
				keepCase: true,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true,
			});
			const grpc_package: any = grpc.loadPackageDefinition(package_definition)[package_namespace];
			this.logger.log(`${client_class} gRPC client initialized with TLS certificate authentication`);
			return new grpc_package[client_class](credentials.rpc_url, credentials.combined_creds, credentials.channel_options);
		} catch (error) {
			this.logger.error(`Failed to initialize ${client_class} gRPC client: ${error.message}`);
			throw error;
		}
	}

	public initializeLightningClient(): grpc.Client {
		const lightning_proto_path = path.join(process.cwd(), 'proto/lnd/lightning.proto');
		return this.initializeGrpcClient([lightning_proto_path], 'lnrpc', 'Lightning');
	}

	public initializeWalletKitClient(): grpc.Client {
		const lightning_proto_path = path.join(process.cwd(), 'proto/lnd/lightning.proto');
		const walletkit_proto_path = path.join(process.cwd(), 'proto/lnd/walletkit.proto');
		return this.initializeGrpcClient([lightning_proto_path, walletkit_proto_path], 'walletrpc', 'WalletKit');
	}

	public mapLndRequest(request: any): LightningRequest {
		return {
			type: mapRequestType(),
			valid: true,
			expiry: mapRequestExpiry(request),
			description: mapRequestDescription(request?.description),
			offer_quantity_max: null,
		};
	}
}
