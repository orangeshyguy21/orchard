/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { FetchModule } from "@server/modules/fetch/fetch.module";
/* Local Dependencies */
import { ImageResolver } from "./image.resolver";
import { ImageService } from './image.service';

@Module({
    imports: [
        FetchModule,
    ],
    providers: [
        ImageResolver,
        ImageService
    ],
})
export class ImageModule {}