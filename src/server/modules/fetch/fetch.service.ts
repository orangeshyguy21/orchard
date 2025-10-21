/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Agent} from 'https';
/* Vendor Dependencies */
import {SocksProxyAgent} from 'socks-proxy-agent';
import nodeFetch from 'node-fetch';

@Injectable()
export class FetchService {
	private readonly logger = new Logger(FetchService.name);

	private agent: Agent | null = null;

	constructor(private configService: ConfigService) {
		const server_proxy = this.configService.get('server.proxy');
		if (!server_proxy) return;
		this.logger.log(`Using tor proxy for external requests: ${server_proxy}`);
		this.agent = new SocksProxyAgent(server_proxy) as any;
	}

	async fetchWithProxy(url: string, options?: any) {
		const useProxy = this.agent && (url.includes('.onion') || url.includes('.i2p'));
		return useProxy ? (nodeFetch(url, {agent: this.agent, ...options}) as any) : fetch(url, options);
	}
}
