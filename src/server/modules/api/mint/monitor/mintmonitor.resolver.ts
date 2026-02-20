/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query} from '@nestjs/graphql';
/* Local Dependencies */
import {MintMonitorService} from './mintmonitor.service';
import {OrchardMintMonitor} from './mintmonitor.model';

@Resolver(() => OrchardMintMonitor)
export class MintMonitorResolver {
	private readonly logger = new Logger(MintMonitorResolver.name);

	constructor(private mintMonitorService: MintMonitorService) {}

	@Query(() => OrchardMintMonitor)
	async mint_monitor(): Promise<OrchardMintMonitor> {
		const tag = 'GET { mint_monitor }';
		this.logger.debug(tag);
		return await this.mintMonitorService.getMintMonitor(tag);
	}
}
