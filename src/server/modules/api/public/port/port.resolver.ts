/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {Public} from '@server/modules/auth/decorators/auth.decorator';
/* Local Dependencies */
import {PublicPortService} from './port.service';
import {OrchardPublicPort} from './port.model';
import {PublicPortInput} from './port.input';

@Resolver(() => [OrchardPublicPort])
export class PublicPortResolver {
	private readonly logger = new Logger(PublicPortResolver.name);

	constructor(private publicPortService: PublicPortService) {}

	@Public()
	@Query(() => [OrchardPublicPort])
	async public_ports(@Args('targets', {type: () => [PublicPortInput]}) targets: PublicPortInput[]): Promise<OrchardPublicPort[]> {
		this.logger.debug('GET { public_ports }');
		return await this.publicPortService.getPortsData(targets);
	}
}
