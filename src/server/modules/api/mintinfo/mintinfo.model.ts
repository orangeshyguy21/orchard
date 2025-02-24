/* Core Dependencies */
import { Field, ID, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import { CashuContact, CashuMintInfo, CashuNut, CashuNutMethod, CashuNutSupported } from '@server/modules/cashumintapi/cashumintapi.types';

@ObjectType()
export class OrchardMintInfo {

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

  @Field(() => [OrchardContact!])
  contact: OrchardContact[];

  @Field()
  icon_url: string;

  @Field(() => [String!])
  urls: string[];

  @Field(type => UnixTimestamp)
  time: number;

  @Field(() => [OrchardNut])
  nuts: OrchardNut[];

  constructor(cashu_info:CashuMintInfo) {
    this.name = cashu_info.name;
    this.pubkey = cashu_info.pubkey;
    this.version = cashu_info.version;
    this.description = cashu_info.description;
    this.description_long = cashu_info.description_long;
    this.contact = cashu_info.contact;
    this.icon_url = cashu_info.icon_url;
    this.urls = cashu_info.urls;
    this.time = cashu_info.time;
    this.nuts = Object.keys(cashu_info.nuts).map( nut_id => new OrchardNut(nut_id, cashu_info.nuts[nut_id]) );
  }
}

@ObjectType()
export class OrchardContact {

  @Field()
  method: string;

  @Field()
  info: string;

  constructor(contact: CashuContact) {
    this.method = contact.method;
    this.info = contact.info;
  }
}

@ObjectType()
export class OrchardNut {

  @Field()
  nut: number;

  @Field({ nullable: true })
  disabled?: boolean;

  @Field(() => [OrchardNutMethod!], { nullable: true })
  methods?: OrchardNutMethod[];

  @Field({ nullable: true })
  supported?: boolean;

  @Field(() => [OrchardNutSupported!], { nullable: true })
  supported_meta?: OrchardNutSupported[];

  constructor(nut_id:string, cashu_nut: CashuNut) {
    this.nut = parseInt(nut_id);
    this.disabled = cashu_nut.disabled;
    this.methods = (cashu_nut.methods) ? cashu_nut.methods.map((method) => new OrchardNutMethod(method)) : null;
    this.supported = (cashu_nut.supported) ? true : null;
    this.supported_meta = (Array.isArray(cashu_nut.supported)) ? cashu_nut.supported.map((supported) => new OrchardNutSupported(supported)) : null;
  }
}

@ObjectType()
export class OrchardNutMethod {

  @Field()
  method: string;

  @Field()
  unit: string;

  @Field({ nullable: true })
  description?: boolean;

  constructor(method: CashuNutMethod) {
    this.method = method.method;
    this.unit = method.unit;
    this.description = method.description;
  }
}

@ObjectType()
export class OrchardNutSupported {

  @Field()
  method: string;

  @Field()
  unit: string;

  @Field(() => [String!])
  commands: string[];

  constructor(supported: CashuNutSupported){
    this.method = supported.method;
    this.unit = supported.unit;
    this.commands = supported.commands;
  }
}