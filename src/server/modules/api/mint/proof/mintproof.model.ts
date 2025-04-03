/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import { CashuMintProof } from '@server/modules/cashu/mintdb/cashumintdb.types';

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