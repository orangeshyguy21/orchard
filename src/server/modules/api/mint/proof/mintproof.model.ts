/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import { CashuMintProof } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintProofGroup } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { MintUnit, MintProofState } from '@server/modules/cashu/cashu.enums';

@ObjectType()
export class OrchardMintProof {

	@Field(type => Int)
	amount: number;

	@Field({ nullable: true })
	id: string;

	@Field()
	c: string;

	@Field()
	secret: string;

	@Field({ nullable: true })
	y: string;

	@Field({ nullable: true })
	witness: string;

	@Field(type => UnixTimestamp, { nullable: true })
	created: number;

	@Field({ nullable: true })
	melt_quote: string;
	
	constructor(cashu_mint_proof: CashuMintProof) {
		this.amount = cashu_mint_proof.amount;
		this.id = cashu_mint_proof.id;
		this.c = cashu_mint_proof.c;
		this.secret = cashu_mint_proof.secret;
		this.y = cashu_mint_proof.y;
		this.witness = cashu_mint_proof.witness;
		this.created = cashu_mint_proof.created;
		this.melt_quote = cashu_mint_proof.melt_quote;
	}
}

@ObjectType()
export class OrchardMintProofGroup {

	@Field(type => Int)
	amount: number;

	@Field(type => UnixTimestamp)
	created_time: number;

	@Field(type => [String])
	keyset_ids: string[];

 	@Field(type => MintUnit)
	unit: MintUnit;

	@Field(type => MintProofState)
	state: MintProofState;

	@Field(type => [[Int]])
	proofs: number[][];

	constructor(cashu_mint_pg: CashuMintProofGroup) {
		this.amount = cashu_mint_pg.amount;
		this.created_time = cashu_mint_pg.created_time;
		this.keyset_ids = cashu_mint_pg.keyset_ids;
		this.unit = cashu_mint_pg.unit;
		this.state = cashu_mint_pg.state;
		this.proofs = cashu_mint_pg.proofs;
	}
}