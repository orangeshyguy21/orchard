/* Core Dependencies */
import { Field, Int, ID, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '../../graphql/scalars/unixtimestamp.scalar';
import { CashuMintMeltQuote } from '../../cashumintdb/cashumintdb.types';

@ObjectType()
export class OrchardMintMeltQuote {

  @Field(type => ID)
  get quote(): string { return this._quote; }
  private _quote: string;
  set quote(quote:CashuMintMeltQuote['quote']) { this._quote = quote; } // TODO: is this worth persuing? can we autoset these?

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

  @Field(type => Int, { nullable: true })
  fee_reserve: number;

  @Field()
  paid: boolean;

  @Field(type => UnixTimestamp, { nullable: true })
  created_time: number;

  @Field(type => UnixTimestamp, { nullable: true })
  paid_time: number;

  @Field(type => Int, { nullable: true })
  fee_paid: number;

  @Field({ nullable: true })
  proof: string;

  @Field({ nullable: true })
  state: string;

  @Field({ nullable: true })
  change: string;

  @Field(type => UnixTimestamp, { nullable: true })
  expiry: number;

  constructor(cashu_mint_melt_quote: CashuMintMeltQuote) {
    this.quote = cashu_mint_melt_quote.quote;
    this.method = cashu_mint_melt_quote.method;
    this.request = cashu_mint_melt_quote.request;
    this.checking_id = cashu_mint_melt_quote.checking_id;
    this.unit = cashu_mint_melt_quote.unit;
    this.amount = cashu_mint_melt_quote.amount;
    this.fee_reserve = cashu_mint_melt_quote.fee_reserve;
    this.paid = !!cashu_mint_melt_quote.paid;
    this.created_time = cashu_mint_melt_quote.created_time;
    this.paid_time = cashu_mint_melt_quote.paid_time;
    this.fee_paid = cashu_mint_melt_quote.fee_paid;
    this.proof = cashu_mint_melt_quote.proof;
    this.state = cashu_mint_melt_quote.state;
    this.change = cashu_mint_melt_quote.change;
    this.expiry = cashu_mint_melt_quote.expiry;
  }
}
