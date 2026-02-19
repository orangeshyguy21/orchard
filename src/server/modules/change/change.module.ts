/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Vendor Dependencies */
import {TypeOrmModule} from '@nestjs/typeorm';
/* Local Dependencies */
import {ChangeEvent} from './change-event.entity';
import {ChangeDetail} from './change-detail.entity';
import {ChangeService} from './change.service';

@Module({
    imports: [TypeOrmModule.forFeature([ChangeEvent, ChangeDetail])],
    providers: [ChangeService],
    exports: [ChangeService],
})
export class ChangeModule {}
