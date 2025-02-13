/* Core Dependencies */
import { Field, Int, ID, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '../../graphql/scalars/unixtimestamp.scalar';
import { CashuMintMintQuote } from '../../cashumintdb/cashumintdb.types';

@ObjectType()
export class OrchardMintMintQuote {

  @Field(type => ID)
  quote:string;

  @Field()
  method: string;

  @Field()
  request: string;

  @Field()
  checking_id: string;
  
  @Field()
  unit: string;

  @Field(type => Int)
  amount: number;

  @Field()
  paid: boolean;

  @Field()
  issued: boolean;

  @Field(type => UnixTimestamp, { nullable: true })
  created_time: number;

  @Field(type => UnixTimestamp, { nullable: true })
  paid_time: number;

  @Field({ nullable: true })
  state: string;

  @Field({ nullable: true })
  pubkey: string;
  
  constructor(cashu_mint_mint_quote: CashuMintMintQuote) {
    this.quote = cashu_mint_mint_quote.quote;
    this.method = cashu_mint_mint_quote.method;
    this.request = cashu_mint_mint_quote.request;
    this.checking_id = cashu_mint_mint_quote.checking_id;
    this.unit = cashu_mint_mint_quote.unit;
    this.amount = cashu_mint_mint_quote.amount;
    this.paid = !!cashu_mint_mint_quote.paid;
    this.issued = !!cashu_mint_mint_quote.issued;
    this.created_time = cashu_mint_mint_quote.created_time;
    this.paid_time = cashu_mint_mint_quote.paid_time;
    this.state = cashu_mint_mint_quote.state;
    this.pubkey = cashu_mint_mint_quote.pubkey;
  }
}