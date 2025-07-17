/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {TaprootAssetsModule} from '@server/modules/tapass/tapass/tapass.module';
/* Local Dependencies */
import {TaprootAssetsInfoService} from './tapinfo.service';
import {TaprootAssetsInfoResolver} from './tapinfo.resolver';

@Module({
	imports: [TaprootAssetsModule, ErrorModule],
	providers: [TaprootAssetsInfoService, TaprootAssetsInfoResolver],
})
export class TaprootAssetsInfoModule {}
