/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {ChangeModule} from '@server/modules/change/change.module';
/* Local Dependencies */
import {ChangeResolver} from './change.resolver';
import {ApiChangeService} from './change.service';

@Module({
    imports: [ErrorModule, ChangeModule],
    providers: [ChangeResolver, ApiChangeService],
})
export class ApiChangeModule {}
