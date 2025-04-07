/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CashuMintRpcService {
    private readonly logger = new Logger(CashuMintRpcService.name);
    private grpc_client: any = null;

    constructor(
        private configService: ConfigService,
    ) {
        this.initializeGrpcClient();
    }
    
    private initializeGrpcClient() {
        this.logger.log('Initializing gRPC client for Cashu mint');
        const rpc_key = this.configService.get('cashu.rpc_key');
        const rpc_cert = this.configService.get('cashu.rpc_cert');
        const rpc_ca = this.configService.get('cashu.rpc_ca');
        const rpc_host = this.configService.get('cashu.rpc_host');
        const rpc_port = this.configService.get('cashu.rpc_port');
        const rpc_url = `${rpc_host}:${rpc_port}`;


        if (!rpc_key || !rpc_cert || !rpc_url) {
            this.logger.warn('Missing RPC credentials or mint URL, secure connection cannot be established');
            return;
        }
        
        try {
            // Load the protocol buffer definition
            const proto_path = path.resolve(__dirname, '../../../../proto/cdk-mint-rpc.proto');
            
            const package_definition = protoLoader.loadSync(proto_path, {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            });
            
            // The package and service names from the proto file
            const mint_proto: any = grpc.loadPackageDefinition(package_definition).cdk_mint_rpc;
            
            // Read SSL/TLS certificates
            const key_content = fs.readFileSync(rpc_key);
            const cert_content = fs.readFileSync(rpc_cert);
            const ca_content = rpc_ca ? fs.readFileSync(rpc_ca) : undefined;
            
            // Create SSL credentials
            const ssl_credentials = grpc.credentials.createSsl(
                ca_content,
                key_content,
                cert_content
            );
            
            // Create gRPC client with the correct service name: CdkMint
            this.grpc_client = new mint_proto.CdkMint(
                rpc_url,
                ssl_credentials
            );
            
            this.logger.log('gRPC client initialized with TLS certificate authentication');
        } catch (error) {
            this.logger.error(`Failed to initialize gRPC client: ${error.message}`);
            if (error.stack) {
                this.logger.debug(error.stack);
            }
        }
    }
    
    /**
     * Get mint information
     */
    async getMintInfo() {
        return this.makeGrpcRequest('GetInfo', {});
    }
    
    /**
     * Update mint name
     */
    async updateName(name: string) {
        return this.makeGrpcRequest('UpdateName', { name });
    }
    
    /**
     * Update mint message of the day
     */
    async updateMotd(motd: string) {
        return this.makeGrpcRequest('UpdateMotd', { motd });
    }
    
    /**
     * Update mint short description
     */
    async updateShortDescription(description: string) {
        return this.makeGrpcRequest('UpdateShortDescription', { description });
    }
    
    /**
     * Update mint long description
     */
    async updateLongDescription(description: string) {
        return this.makeGrpcRequest('UpdateLongDescription', { description });
    }
    
    /**
     * Update mint icon URL
     */
    async updateIconUrl(icon_url: string) {
        return this.makeGrpcRequest('UpdateIconUrl', { icon_url });
    }
    
    /**
     * Add a URL to the mint
     */
    async addUrl(url: string) {
        return this.makeGrpcRequest('AddUrl', { url });
    }
    
    /**
     * Remove a URL from the mint
     */
    async removeUrl(url: string) {
        return this.makeGrpcRequest('RemoveUrl', { url });
    }
    
    /**
     * Add a contact method to the mint
     */
    async addContact(method: string, info: string) {
        return this.makeGrpcRequest('AddContact', { method, info });
    }
    
    /**
     * Remove a contact method from the mint
     */
    async removeContact(method: string, info: string) {
        return this.makeGrpcRequest('RemoveContact', { method, info });
    }
    
    /**
     * Rotate to the next keyset
     */
    async rotateNextKeyset(unit: string, max_order?: number, input_fee_ppk?: number) {
        const request: any = { unit };
        if (max_order !== undefined) request.max_order = max_order;
        if (input_fee_ppk !== undefined) request.input_fee_ppk = input_fee_ppk;
        
        return this.makeGrpcRequest('RotateNextKeyset', request);
    }
    
    /**
     * Make a gRPC request to the mint
     */
    private makeGrpcRequest(method: string, request: any): Promise<any> {
        if (!this.grpc_client) {
            throw new Error('gRPC client not properly initialized');
        }
        
        return new Promise((resolve, reject) => {
            if (!(method in this.grpc_client)) {
                reject(new Error(`Method ${method} not found in gRPC client`));
                return;
            }
            
            this.logger.debug(`Making gRPC call: ${method}`, request);
            
            this.grpc_client[method](request, (error: Error | null, response: any) => {
                if (error) {
                    this.logger.error(`gRPC request failed: ${error.message}`);
                    reject(error);
                    return;
                }
                
                this.logger.debug(`gRPC response for ${method}:`, response);
                resolve(response);
            });
        });
    }
    
    /**
     * Check if the client is connected
     */
    isConnected(): boolean {
        return !!this.grpc_client;
    }
}