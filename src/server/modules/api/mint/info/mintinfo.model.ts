/* Core Dependencies */
import { Field, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import { 
	CashuCachedEndpoint,
	CashuContact,
	CashuMintInfo,
	CashuNut4Method,
	CashuNut5Method,
	CashuNutSupported,
} from '@server/modules/cashu/mintapi/cashumintapi.types';

@ObjectType()
export class OrchardNutSupported {

	@Field()
	supported: boolean;

	constructor(nut: 
		CashuMintInfo['nuts']['7' ] | 
		CashuMintInfo['nuts']['8' ] | 
		CashuMintInfo['nuts']['9' ] |
		CashuMintInfo['nuts']['10' ] |
		CashuMintInfo['nuts']['11' ] |
		CashuMintInfo['nuts']['12' ] |
		CashuMintInfo['nuts']['14' ]
	) {
		this.supported = nut.supported;
	}
}

@ObjectType()
export class OrchardNut4 {

	@Field(() => [OrchardNut4Method!])
	methods: OrchardNut4Method[];

	@Field()
	disabled: boolean;

	constructor(nut4: CashuMintInfo['nuts']['4']) {
		this.methods = Object.values(nut4.methods).map((method) => new OrchardNut4Method(method));
		this.disabled = nut4.disabled;
	}
}

@ObjectType()
export class OrchardNut5 {

	@Field(() => [OrchardNut5Method!])
	methods: OrchardNut5Method[];

	@Field()
	disabled: boolean;

	constructor(nut5: CashuMintInfo['nuts']['5']) {
		this.methods = Object.values(nut5.methods).map((method) => new OrchardNut5Method(method));
		this.disabled = nut5.disabled;
	}
}

@ObjectType()
export class OrchardNut17 {

	@Field(() => [OrchardNut17Supported!])
	supported: OrchardNut17Supported[];

	constructor(nut17: CashuMintInfo['nuts']['17']) {
		this.supported = Object.values(nut17.supported).map((supported) => new OrchardNut17Supported(supported));
	}
}

@ObjectType()
export class OrchardNut19 {

	@Field(() => [OrchardCachedEndpoint!])
	cached_endpoints: OrchardCachedEndpoint[];

	@Field()
	ttl: number;

	constructor(nut19: CashuMintInfo['nuts']['19']) {
		this.cached_endpoints = Object.values(nut19.cached_endpoints).map((cached_endpoint) => new OrchardCachedEndpoint(cached_endpoint));
		this.ttl = nut19.ttl;
	}
}

@ObjectType()
export class OrchardNuts {

	@Field()
	nut4: OrchardNut4;

	@Field()
	nut5: OrchardNut5;

	@Field()
	nut7: OrchardNutSupported;

	@Field()
	nut8: OrchardNutSupported;

	@Field()
	nut9: OrchardNutSupported;

	@Field()
	nut10: OrchardNutSupported;

	@Field()
	nut11: OrchardNutSupported;

	@Field()
	nut12: OrchardNutSupported;

	@Field()
	nut14: OrchardNutSupported;

	@Field()
	nut17: OrchardNut17;

	@Field()
	nut19: OrchardNut19;

	@Field()
	nut20: OrchardNutSupported;

	constructor(nuts: CashuMintInfo['nuts']) {
		this.nut4 = new OrchardNut4(nuts['4']);
		this.nut5 = new OrchardNut5(nuts['5']);
		this.nut7 = new OrchardNutSupported(nuts['7']);
		this.nut8 = new OrchardNutSupported(nuts['8']);
		this.nut9 = new OrchardNutSupported(nuts['9']);
		this.nut10 = new OrchardNutSupported(nuts['10']);
		this.nut11 = new OrchardNutSupported(nuts['11']);
		this.nut12 = new OrchardNutSupported(nuts['12']);
		this.nut14 = new OrchardNutSupported(nuts['14']);
		this.nut17 = new OrchardNut17(nuts['17']);
		this.nut19 = new OrchardNut19(nuts['19']);
		this.nut20 = new OrchardNutSupported(nuts['20']);
	}
}

@ObjectType()
export class OrchardMintInfo {

	@Field()
	name: string;

	@Field()
	pubkey: string;

	@Field()
	version: string;
	
	@Field({ nullable: true })
	description: string;

	@Field({ nullable: true })
	description_long: string;

	@Field(() => [OrchardContact!])
	contact: OrchardContact[];

	@Field({ nullable: true })
	icon_url: string;

	@Field(() => [String!], { nullable: true })
	urls: string[];

	@Field(type => UnixTimestamp)
	time: number;

	@Field(() => OrchardNuts!)
	nuts: OrchardNuts;

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
		this.nuts = new OrchardNuts(cashu_info.nuts);
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
export class OrchardNut4Method {

	@Field()
	method: string;

	@Field()
	unit: string;

	@Field({ nullable: true })
	description?: boolean;

	@Field({ nullable: true })
	min_amount?: number;

	@Field({ nullable: true })
	max_amount?: number;  

	constructor(method: CashuNut4Method) {
		this.method = method.method;
		this.unit = method.unit;
		this.description = method.description;
		this.min_amount = method.min_amount;
		this.max_amount = method.max_amount;
	}
}

@ObjectType()
export class OrchardNut5Method {

	@Field()
	method: string;

	@Field()
	unit: string;

	@Field({ nullable: true })
	min_amount?: number;

	@Field({ nullable: true })
	max_amount?: number;  

	constructor(method: CashuNut5Method) {
		this.method = method.method;
		this.unit = method.unit;
		this.min_amount = method.min_amount;
		this.max_amount = method.max_amount;
	}
}


@ObjectType()
export class OrchardNut17Supported {

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

@ObjectType()
export class OrchardCachedEndpoint {

	@Field()
	method: string;

	@Field()
	path: string;

	constructor(cached_endpoint: CashuCachedEndpoint) {
		this.method = cached_endpoint.method;
		this.path = cached_endpoint.path;
	}
}