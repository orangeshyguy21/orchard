/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query} from '@nestjs/graphql';
/* Local Dependencies */
import {MintPulseService} from './mintpulse.service';
import {OrchardMintPulse} from './mintpulse.model';

@Resolver(() => OrchardMintPulse)
export class MintPulseResolver {
	private readonly logger = new Logger(MintPulseResolver.name);

	constructor(private mintPulseService: MintPulseService) {}

	@Query(() => OrchardMintPulse)
	async mint_pulse(): Promise<OrchardMintPulse> {
		const tag = 'GET { mint_pulse }';
		this.logger.debug(tag);
		return await this.mintPulseService.getMintPulse(tag);
	}
}
