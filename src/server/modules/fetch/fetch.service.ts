import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { Agent } from 'https';
import { SocksProxyAgent } from 'socks-proxy-agent';

@Injectable()
export class FetchService {
  agent: Agent | null = null;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    const torProxy = this.configService.get('torProxy');

    if (torProxy) {
      this.logger.info(`Using tor proxy for external requests: ${torProxy}`);
      this.agent = new SocksProxyAgent(torProxy) as any;
    }
  }

  async fetchWithProxy(url: string, options?: any) {
    return this.agent
      ? fetch(url, { agent: this.agent, ...options })
      : fetch(url, options);
  }
}
