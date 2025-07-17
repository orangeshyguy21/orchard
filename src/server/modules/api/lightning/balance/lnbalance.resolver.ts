/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query} from '@nestjs/graphql';
/* Local Dependencies */
import {LightningBalanceService} from './lnbalance.service';
import {OrchardLightningBalance} from './lnbalance.model';

@Resolver()
export class LightningBalanceResolver {
	private readonly logger = new Logger(LightningBalanceResolver.name);

	constructor(private lightningBalanceService: LightningBalanceService) {}

	@Query(() => OrchardLightningBalance)
	async lightning_balance(): Promise<OrchardLightningBalance> {
		const tag = 'GET { lightning_balance }';
		this.logger.debug(tag);
		return await this.lightningBalanceService.getLightningChannelBalance(tag);
	}
}
