/* Shared Dependencies */
import { OrchardImage } from '@shared/generated.types';

export class Image implements OrchardImage {
    data: string | null;
    type: string;

    constructor(data: OrchardImage) {
        this.data = data.data || null;
        this.type = data.type;
    }
}
