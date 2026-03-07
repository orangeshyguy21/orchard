/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Vendor Dependencies */
import {TypeOrmModule} from '@nestjs/typeorm';
/* Local Dependencies */
import {Agent} from './agent.entity';
import {AgentRun} from './agent-run.entity';
import {AgentService} from './agent.service';

@Module({
	imports: [TypeOrmModule.forFeature([Agent, AgentRun])],
	providers: [AgentService],
	exports: [AgentService],
})
export class AgentModule {}
