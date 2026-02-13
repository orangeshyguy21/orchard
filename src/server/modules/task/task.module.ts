/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {AuthModule} from '@server/modules/auth/auth.module';
import {SettingModule} from '@server/modules/setting/setting.module';
import {BitcoinUTXOracleModule} from '@server/modules/bitcoin/utxoracle/utxoracle.module';
import {BitcoinRpcModule} from '@server/modules/bitcoin/rpc/btcrpc.module';
import {LightningAnalyticsModule} from '@server/modules/lightning/analytics/lnanalytics.module';
/* Local Dependencies */
import {TaskService} from './task.service';

@Module({
	imports: [AuthModule, SettingModule, BitcoinUTXOracleModule, BitcoinRpcModule, LightningAnalyticsModule],
	providers: [TaskService],
})
export class TaskModule {}
