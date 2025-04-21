/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from "@nestjs/graphql";
/* Local Dependencies */
import { ImageService } from "./image.service";
import { OrchardImage } from "./image.model";

@Resolver(() => OrchardImage)
export class ImageResolver {

	private readonly logger = new Logger(ImageResolver.name);

	constructor(
		private imageService: ImageService,
	) {}

	@Query(() => OrchardImage)
	async image(@Args('image_url') image_url: string) : Promise<OrchardImage> {
		this.logger.debug('GET { image }');
		return await this.imageService.getImageData(image_url);
	}
}
