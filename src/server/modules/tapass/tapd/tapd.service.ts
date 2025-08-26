/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
/* Vendor Dependencies */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

@Injectable()
export class TapdService {
	private readonly logger = new Logger(TapdService.name);

	constructor(private configService: ConfigService) {}

	private createGrpcCredentials() {
		const rpc_host = this.configService.get('taproot_assets.host');
		const rpc_port = this.configService.get('taproot_assets.port');
		const rpc_macaroon = this.configService.get('taproot_assets.macaroon');
		const rpc_tls_cert = this.configService.get('taproot_assets.cert');

		if (!rpc_host || !rpc_port || !rpc_macaroon || !rpc_tls_cert) {
			this.logger.warn('Missing TAPD RPC credentials, secure connection cannot be established');
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

		return {rpc_url, combined_creds};
	}

	private initializeGrpcClient(proto_paths: string[], package_namespace: string, client_class: string): grpc.Client {
		const credentials = this.createGrpcCredentials();
		if (!credentials) {
			return;
		}

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
			return new grpc_package[client_class](credentials.rpc_url, credentials.combined_creds);
		} catch (error) {
			this.logger.error(`Failed to initialize ${client_class} gRPC client: ${error.message}`);
			throw error;
		}
	}

	public initializeTaprootAssetsClient(): grpc.Client {
		const taproot_assets_proto_path = path.join(process.cwd(), 'proto/tapd/taprootassets.proto');
		return this.initializeGrpcClient([taproot_assets_proto_path], 'taprpc', 'TaprootAssets');
	}
}
