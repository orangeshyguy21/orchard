/* Shared Dependencies */
import {OrchardPublicImage, OrchardPublicUrl, OrchardPublicPort} from '@shared/generated.types';

export type PublicImageResponse = {
	public_image: OrchardPublicImage;
};

export type PublicUrlResponse = {
	public_urls: OrchardPublicUrl[];
};

export type PublicPortResponse = {
	public_ports: OrchardPublicPort[];
};
