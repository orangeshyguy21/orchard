/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
import { promises as dns } from 'dns';
import { URL } from 'url';
/* Application Dependencies */
import { FetchService } from '@server/modules/fetch/fetch.service';
import { OrchardApiError } from '@server/modules/graphql/classes/orchard-error.class';
import { OrchardErrorCode } from '@server/modules/error/error.types';
/* Local Dependencies */
import { OrchardPublicUrl } from './url.model';

@Injectable()
export class PublicUrlService {

    private readonly logger = new Logger(PublicUrlService.name);

    constructor(
        private fetchService: FetchService
    ) {}

    public async getUrlsData(urls: string[]): Promise<OrchardPublicUrl[]> {
        const promises = urls.map((url) => this.getUrlData(url));
        return await Promise.all(promises);
    }

    private async getUrlData(url: string): Promise<OrchardPublicUrl> {
        let response: any;
        let parsed_url: URL;
        let ip_address: string | null;
        let has_data: boolean = false;

        try {
            response = await this.fetchService.fetchWithProxy(url);
        } catch (error) {
            console.error('getUrlData', error);
            throw new OrchardApiError(OrchardErrorCode.PublicUrlError);
        }

        try {
            parsed_url = new URL(url);
        } catch (error) {
            throw new OrchardApiError(OrchardErrorCode.PublicUrlParseError);
        }
        
        try {
            const addresses = await dns.resolve4(parsed_url.hostname);
            ip_address = addresses[0];
        } catch (error) {
            this.logger.warn('DNS resolution failed:', error);
            ip_address = null;
        }

        try {
            await response.json();
            has_data = true;
        } catch (error) {
            this.logger.warn('Failed to parse JSON:', error);
        }

        return new OrchardPublicUrl(response.url, response.status, ip_address, has_data);
    }
}