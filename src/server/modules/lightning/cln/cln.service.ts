/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
/* Vendor Dependencies */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

@Injectable()
export class ClnService {
	private readonly logger = new Logger(ClnService.name);

	constructor(private configService: ConfigService) {}

	private createGrpcCredentials() {
		const rpc_host = this.configService.get('lightning.host');
		const rpc_port = this.configService.get('lightning.port');
		const client_cert = this.configService.get('lightning.cert');
		const client_key = this.configService.get('lightning.key');
		const ca_cert = this.configService.get('lightning.ca');

		if (!rpc_host || !rpc_port || !client_cert || !client_key || !ca_cert) {
			this.logger.warn('Missing CLN gRPC mTLS credentials, secure connection cannot be established');
			return null;
		}

		const rpc_url = `${rpc_host}:${rpc_port}`;
		const ca_cert_content = fs.readFileSync(ca_cert);
		const client_cert_content = fs.readFileSync(client_cert);
		const client_key_content = fs.readFileSync(client_key);

		const ssl_creds = grpc.credentials.createSsl(ca_cert_content, client_key_content, client_cert_content);

		let channel_options: Record<string, any> | undefined = {
			'grpc.ssl_target_name_override': 'cln',
		};

		return {rpc_url, creds: ssl_creds, channel_options};
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
			this.logger.log(`${client_class} gRPC client initialized with mTLS`);
			return new grpc_package[client_class](credentials.rpc_url, credentials.creds, credentials.channel_options);
		} catch (error) {
			this.logger.error(`Failed to initialize ${client_class} gRPC client: ${error.message}`);
			throw error;
		}
	}

	public initializeLightningClient(): grpc.Client {
		const node_proto_path = path.join(process.cwd(), 'proto/cln/node.proto');
		const primitives_proto_path = path.join(process.cwd(), 'proto/cln/primitives.proto');
		return this.initializeGrpcClient([node_proto_path, primitives_proto_path], 'cln', 'Node');
	}
}
