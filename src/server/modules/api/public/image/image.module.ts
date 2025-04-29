/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { FetchModule } from "@server/modules/fetch/fetch.module";
/* Local Dependencies */
import { PublicImageResolver } from "./image.resolver";
import { PublicImageService } from './image.service';

@Module({
    imports: [
        FetchModule,
    ],
    providers: [
        PublicImageResolver,
        PublicImageService
    ],
})
export class PublicImageModule {}