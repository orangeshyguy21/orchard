/* Core Dependencies */
import { Injectable } from '@nestjs/common';
/* Application Dependencies */
import { FetchService } from '@server/modules/fetch/fetch.service';
/* Local Dependencies */
import { OrchardImage } from './image.model';

@Injectable()
export class ImageService {
    constructor(
        private fetch_service: FetchService
    ) {}

    async getImageData(image_url: string): Promise<OrchardImage> {
        const response = await this.fetch_service.fetchWithProxy(image_url);
        const content_type = response.headers.get('content-type');
        const buffer = Buffer.from(await response.arrayBuffer());
        console.log('BUFFER:::::', buffer);
        return new OrchardImage(buffer, content_type || 'image/jpeg');
    }
}