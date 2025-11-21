/* Core Dependencies */
import {Logger, OnModuleInit} from '@nestjs/common';
import {Resolver, Query, Subscription, Args, Mutation} from '@nestjs/graphql';
import {Throttle, minutes} from '@nestjs/throttler';
/* Vendor Dependencies */
import {PubSub} from 'graphql-subscriptions';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
import {UserRole} from '@server/modules/user/user.enums';
import {NoHeaders} from '@server/modules/auth/decorators/auth.decorator';
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
/* Local Dependencies */
import {OrchardBitcoinOraclePrice, OrchardBitcoinOracleBackfillProgress, OrchardBitcoinOracleBackfillStream} from './btcoracle.model';
import {BitcoinOracleService} from './btcoracle.service';

const pubSub = new PubSub();

@Resolver()
export class BitcoinOracleResolver implements OnModuleInit {
	private readonly logger = new Logger(BitcoinOracleResolver.name);

	constructor(
		private bitcoinOracleService: BitcoinOracleService,
		private authService: AuthService,
	) {}

	onModuleInit() {
		this.bitcoinOracleService.onBackfillUpdate((update: OrchardBitcoinOracleBackfillProgress) => {
			pubSub.publish('bitcoin_oracle_backfill', {bitcoin_oracle_backfill: update});
		});
	}

	@Query(() => [OrchardBitcoinOraclePrice])
	async bitcoin_oracle(
		@Args('start_date', {type: () => UnixTimestamp, nullable: true}) start_date?: number,
		@Args('end_date', {type: () => UnixTimestamp, nullable: true}) end_date?: number,
	): Promise<OrchardBitcoinOraclePrice[]> {
		const tag = 'GET { bitcoin_oracle }';
		this.logger.debug(tag);
		return await this.bitcoinOracleService.getOracle(tag, start_date, end_date);
	}

	@Subscription(() => OrchardBitcoinOracleBackfillProgress)
	@Throttle({default: {limit: 3, ttl: minutes(1)}})
	@NoHeaders()
	async bitcoin_oracle_backfill(
		@Args('id', {type: () => String}) id: string,
		@Args('auth', {type: () => String}) auth: string,
		@Args('start_date', {type: () => UnixTimestamp}) start_date: number,
		@Args('end_date', {type: () => UnixTimestamp, nullable: true}) end_date?: number,
	) {
		const tag = `SUBSCRIPTION { bitcoin_oracle_backfill } stream ${id}`;
		this.logger.debug(tag);
		try {
			const payload = await this.authService.validateAccessToken(auth);
			const approved_roles = [UserRole.ADMIN, UserRole.MANAGER];
			if (!approved_roles.includes(payload.role)) throw new OrchardApiError(OrchardErrorCode.AuthorizationError);
		} catch (error) {
			if (error instanceof OrchardApiError) throw error;
			throw new OrchardApiError(OrchardErrorCode.AuthenticationError);
		}
		this.bitcoinOracleService.streamBackfillOracle(tag, id, start_date, end_date);
		return pubSub.asyncIterableIterator('bitcoin_oracle_backfill');
	}

	@Mutation(() => OrchardBitcoinOracleBackfillStream)
	@Roles(UserRole.ADMIN)
	async bitcoin_oracle_backfill_abort(@Args('id', {type: () => String}) id: string): Promise<OrchardBitcoinOracleBackfillStream> {
		const tag = `MUTATION { bitcoin_oracle_backfill_abort } for stream ${id}`;
		this.logger.debug(tag);
		return this.bitcoinOracleService.abortBackfillStream(id);
	}
}
