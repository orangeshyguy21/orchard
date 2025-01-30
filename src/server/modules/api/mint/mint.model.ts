/* Core Dependencies */
import { Field, ID, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '../../graphql/types/unixtimestamp';

@ObjectType()
export class Mint {

  @Field()
  name: string;

  @Field()
  pubkey: string;

  @Field()
  version: string;
  
  @Field()
  description: string;

  @Field()
  description_long: string;

  @Field(() => [String!])
  contact: [string];

  @Field()
  icon_url: string;

  @Field(() => [String!])
  urls: [string];

  @Field(type => UnixTimestamp)
  time: number;

  @Field(() => [Nut])
  nuts: Nut[];

  constructor(cashumint:any) {
    console.log('THIS WORKS');
  }
}

@ObjectType()
export class Nut {

  @Field(type => ID)
  nut: number;

  @Field({ nullable: true })
  disabled?: boolean;

  @Field(() => [NutMethod!], { nullable: true })
  methods?: [NutMethod];

  @Field(() => [NutSupported!], { nullable: true })
  supported?: [NutSupported] | [];

}

@ObjectType()
export class NutMethod {

  @Field(type => ID)
  id: number;

  @Field()
  method: string;

  @Field()
  unit: string;

  @Field({ nullable: true })
  description?: boolean;

}

@ObjectType()
export class NutSupported {

  @Field(type => ID)
  id: number;

  @Field()
  method: string;

  @Field()
  unit: string;

  @Field(() => [String!])
  commands: [string];
  
}


// @Field()
// active: boolean;

// @Field()
// version: string;

// @Field()
// unit: string;

// @Field({ nullable: true })
// encrypted_seed: string;

// type CashuNut = {
//   disabled?: boolean;
//   methods?: CashuNutMethod[];
//   supported?: boolean | CashuNutSupported[];
// }

// type CashuNutMethod = {
//   method: string;
//   unit: string;
//   description?: boolean;
// }

// type CashuNutSupported = {
//   method: string;
//   unit: string;
//   commands?: string[];
// }

// @ObjectType()
// export class SingleChannel {
//   @Field()
//   capacity: number;
//   @Field()
//   id: string;
//   @Field(() => [Policy])
//   policies: Policy[];
//   @Field()
//   transaction_id: string;
//   @Field()
//   transaction_vout: number;
//   @Field({ nullable: true })
//   updated_at: string;
//   @Field(() => NodePolicy, { nullable: true })
//   node_policies: NodePolicy;
//   @Field(() => NodePolicy, { nullable: true })
//   partner_node_policies: NodePolicy;
// }


// export type CashuInfo = {
//   name: string;
//   pubkey: string;
//   version: string;
//   description: string;
//   description_long: string;
//   contact: any[];
//   motd: string;
//   icon_url: string;
//   urls: string[];
//   time: number;
//   nuts: {
//     [nut: string]: CashuNut;
//   };
// }