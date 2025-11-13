/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {AuthModule} from '@server/modules/auth/auth.module';
import {BitcoinUTXOracleModule} from '@server/modules/bitcoin/utxoracle/utxoracle.module';
import {BitcoinRpcModule} from '@server/modules/bitcoin/rpc/btcrpc.module';
/* Local Dependencies */
import {TaskService} from './task.service';

@Module({
	imports: [AuthModule, BitcoinUTXOracleModule, BitcoinRpcModule],
	providers: [TaskService],
})
export class TaskModule {}
