/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Mutation, Args, Int, Float} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
import {UserRole} from '@server/modules/user/user.enums';
/* Local Dependencies */
import {MintKeysetService} from './mintkeyset.service';
import {OrchardMintKeyset, OrchardMintKeysetProofCount} from './mintkeyset.model';
import {OrchardMintKeysetRotation} from './mintkeyset.model';

@Resolver()
export class MintKeysetResolver {
	private readonly logger = new Logger(MintKeysetResolver.name);

	constructor(private mintKeysetService: MintKeysetService) {}

	@Query(() => [OrchardMintKeyset])
	async mint_keysets(): Promise<OrchardMintKeyset[]> {
		const tag = 'GET { mint_keysets }';
		this.logger.debug(tag);
		return await this.mintKeysetService.getMintKeysets(tag);
	}

	@Query(() => [OrchardMintKeysetProofCount])
	async mint_keyset_proof_counts(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('id_keysets', {type: () => [String], nullable: true}) id_keysets?: string[],
	): Promise<OrchardMintKeysetProofCount[]> {
		const tag = 'GET { mint_keyset_proof_counts }';
		this.logger.debug(tag);
		return await this.mintKeysetService.getMintKeysetProofCounts(tag, {date_start, date_end, id_keysets});
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintKeysetRotation)
	async mint_rotate_keyset(
		@Args('unit') unit: string,
		@Args('amounts', {type: () => [Float], nullable: true}) amounts?: number[],
		@Args('input_fee_ppk', {type: () => Int, nullable: true}) input_fee_ppk?: number,
		@Args('keyset_v2', {nullable: true}) keyset_v2?: boolean,
	): Promise<OrchardMintKeysetRotation> {
		const tag = 'MUTATION { mint_rotate_keyset }';
		this.logger.debug(tag);
		return await this.mintKeysetService.mintRotateKeyset(tag, {unit, amounts, input_fee_ppk, keyset_v2});
	}
}
