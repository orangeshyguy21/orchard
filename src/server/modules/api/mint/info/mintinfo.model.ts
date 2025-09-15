/* Core Dependencies */
import {Field, ObjectType, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {
	CashuCachedEndpoint,
	CashuContact,
	CashuMintInfo,
	CashuNut4Method,
	CashuNut5Method,
	CashuNut15Method,
	CashuNutSupported,
} from '@server/modules/cashu/mintapi/cashumintapi.types';
import {CashuMintInfoRpc} from '@server/modules/cashu/mintrpc/cashumintrpc.types';
import {MintUnit, MintPaymentMethod} from '@server/modules/cashu/cashu.enums';

@ObjectType()
export class OrchardNutSupported {
	@Field()
	supported: boolean;

	constructor(
		nut:
			| CashuMintInfo['nuts']['7']
			| CashuMintInfo['nuts']['8']
			| CashuMintInfo['nuts']['9']
			| CashuMintInfo['nuts']['10']
			| CashuMintInfo['nuts']['11']
			| CashuMintInfo['nuts']['12']
			| CashuMintInfo['nuts']['14'],
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
export class OrchardNut15 {
	@Field(() => [OrchardNut15Method!])
	methods: OrchardNut15Method[];

	constructor(nut15: CashuMintInfo['nuts']['15']) {
		this.methods = Object.values(nut15.methods).map((method) => new OrchardNut15Method(method));
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

	@Field({nullable: true})
	nut14: OrchardNutSupported;

	@Field({nullable: true})
	nut15: OrchardNut15;

	@Field({nullable: true})
	nut17: OrchardNut17;

	@Field({nullable: true})
	nut19: OrchardNut19;

	@Field({nullable: true})
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
		this.nut14 = nuts['14'] ? new OrchardNutSupported(nuts['14']) : null;
		this.nut15 = nuts['15'] ? new OrchardNut15(nuts['15']) : null;
		this.nut17 = nuts['17'] ? new OrchardNut17(nuts['17']) : null;
		this.nut19 = nuts['19'] ? new OrchardNut19(nuts['19']) : null;
		this.nut20 = nuts['20'] ? new OrchardNutSupported(nuts['20']) : null;
	}
}

@ObjectType()
export class OrchardMintInfo {
	@Field()
	name: string;

	@Field({nullable: true})
	pubkey: string;

	@Field()
	version: string;

	@Field({nullable: true})
	description: string;

	@Field({nullable: true})
	description_long: string;

	@Field(() => [OrchardContact!], {nullable: true})
	contact: OrchardContact[];

	@Field({nullable: true})
	icon_url: string;

	@Field(() => [String!], {nullable: true})
	urls: string[];

	@Field((type) => UnixTimestamp, {nullable: true})
	time: number;

	@Field(() => OrchardNuts!)
	nuts: OrchardNuts;

	constructor(cashu_info: CashuMintInfo) {
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
	@Field(() => MintPaymentMethod)
	method: MintPaymentMethod;

	@Field()
	unit: string;

	@Field({nullable: true})
	description?: boolean;

	@Field({nullable: true})
	min_amount?: number;

	@Field({nullable: true})
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
	@Field(() => MintPaymentMethod)
	method: MintPaymentMethod;

	@Field()
	unit: string;

	@Field({nullable: true})
	amountless?: boolean;

	@Field({nullable: true})
	min_amount?: number;

	@Field({nullable: true})
	max_amount?: number;

	constructor(method: CashuNut5Method) {
		this.method = method.method;
		this.unit = method.unit;
		this.amountless = method.amountless;
		this.min_amount = method.min_amount;
		this.max_amount = method.max_amount;
	}
}

@ObjectType()
export class OrchardNut15Method {
	@Field(() => MintPaymentMethod)
	method: MintPaymentMethod;

	@Field(() => MintUnit)
	unit: MintUnit;

	constructor(method: CashuNut15Method) {
		this.method = method.method;
		this.unit = method.unit;
	}
}

@ObjectType()
export class OrchardNut17Supported {
	@Field(() => MintPaymentMethod)
	method: MintPaymentMethod;

	@Field()
	unit: string;

	@Field(() => [String!])
	commands: string[];

	constructor(supported: CashuNutSupported) {
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

@ObjectType()
export class OrchardMintInfoRpc {
	@Field({nullable: true})
	name: string;

	@Field()
	version: string;

	@Field({nullable: true})
	description: string;

	@Field({nullable: true})
	motd: string;

	@Field({nullable: true})
	total_issued: string;

	@Field({nullable: true})
	total_redeemed: string;

	@Field({nullable: true})
	description_long: string;

	@Field(() => [OrchardContact!])
	contact: OrchardContact[];

	@Field({nullable: true})
	icon_url: string;

	@Field(() => [String!])
	urls: string[];

	constructor(cashu_info: CashuMintInfoRpc) {
		this.name = cashu_info.name;
		this.version = cashu_info.version;
		this.description = cashu_info.description;
		this.description_long = cashu_info.description_long;
		this.motd = cashu_info.motd;
		this.total_issued = cashu_info.total_issued;
		this.total_redeemed = cashu_info.total_redeemed;
		this.contact = cashu_info.contact;
		this.icon_url = cashu_info.icon_url;
		this.urls = cashu_info.urls;
	}
}

@ObjectType()
export class OrchardMintNameUpdate {
	@Field({nullable: true})
	name: string;
}

@ObjectType()
export class OrchardMintIconUpdate {
	@Field()
	icon_url: string;
}

@ObjectType()
export class OrchardMintDescriptionUpdate {
	@Field()
	description: string;
}

@ObjectType()
export class OrchardMintMotdUpdate {
	@Field({nullable: true})
	motd: string;
}

@ObjectType()
export class OrchardMintUrlUpdate {
	@Field()
	url: string;
}

@ObjectType()
export class OrchardMintContactUpdate {
	@Field()
	method: string;

	@Field()
	info: string;
}
