/* Core Dependencies */
import { Injectable } from '@nestjs/common';
/* Application Dependencies */
import { FetchService } from '@server/modules/fetch/fetch.service';
/* Local Dependencies */
import { OrchardPublicImage } from './image.model';

@Injectable()
export class PublicImageService {
    
    constructor(
        private fetch_service: FetchService
    ) {}

    async getImageData(url: string): Promise<OrchardPublicImage> {
        const response = await this.fetch_service.fetchWithProxy(url);
        const content_type = response.headers.get('content-type');
        const buffer = Buffer.from(await response.arrayBuffer());
        return new OrchardPublicImage(buffer, content_type || 'image/jpeg');
    }
}