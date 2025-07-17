/* Shared Dependencies */
import {OrchardPublicImage} from '@shared/generated.types';

export class PublicImage implements OrchardPublicImage {
	data: string | null;
	type: string;

	constructor(data: OrchardPublicImage) {
		this.data = data.data || null;
		this.type = data.type;
	}
}
