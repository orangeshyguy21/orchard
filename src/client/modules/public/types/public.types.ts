/* Shared Dependencies */
import {OrchardPublicImage, OrchardPublicUrl} from '@shared/generated.types';

export type PublicImageResponse = {
	public_image: OrchardPublicImage;
};

export type PublicUrlResponse = {
	public_urls: OrchardPublicUrl[];
};
