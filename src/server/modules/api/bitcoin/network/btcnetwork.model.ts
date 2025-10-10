/* Core Dependencies */
import {Field, Int, Float, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {BitcoinNetworkInfo} from '@server/modules/bitcoin/rpc/btcrpc.types';

@ObjectType()
export class OrchardBitcoinNetwork {
	@Field(() => String)
	name: string;

	@Field(() => Boolean)
	limited: boolean;

	@Field(() => Boolean)
	reachable: boolean;

	@Field(() => String)
	proxy: string;

	@Field(() => Boolean)
	proxy_randomize_credentials: boolean;

	constructor(bn: BitcoinNetworkInfo['networks'][number]) {
		this.name = bn.name;
		this.limited = bn.limited;
		this.reachable = bn.reachable;
		this.proxy = bn.proxy;
		this.proxy_randomize_credentials = bn.proxy_randomize_credentials;
	}
}

@ObjectType()
export class OrchardBitcoinNetworkAddress {
	@Field(() => String)
	address: string;

	@Field(() => Int)
	port: number;

	@Field(() => Int)
	score: number;

	constructor(ban: BitcoinNetworkInfo['localaddresses'][number]) {
		this.address = ban.address;
		this.port = ban.port;
		this.score = ban.score;
	}
}

@ObjectType()
export class OrchardBitcoinNetworkInfo {
	@Field(() => Int)
	version: number;

	@Field(() => String)
	subversion: string;

	@Field(() => Int)
	protocolversion: number;

	@Field(() => String)
	localservices: string;

	@Field(() => [String])
	localservicesnames: string[];

	@Field(() => Boolean)
	localrelay: boolean;

	@Field(() => Int)
	timeoffset: number;

	@Field(() => Int)
	connections: number;

	@Field(() => Int)
	connections_in: number;

	@Field(() => Int)
	connections_out: number;

	@Field(() => Boolean)
	networkactive: boolean;

	@Field(() => [OrchardBitcoinNetwork])
	networks: OrchardBitcoinNetwork[];

	@Field(() => Float)
	relayfee: number;

	@Field(() => Float)
	incrementalfee: number;

	@Field(() => [OrchardBitcoinNetworkAddress])
	localaddresses: OrchardBitcoinNetworkAddress[];

	@Field(() => [String])
	warnings: string[];

	constructor(bni: BitcoinNetworkInfo) {
		this.version = bni.version;
		this.subversion = bni.subversion;
		this.protocolversion = bni.protocolversion;
		this.localservices = bni.localservices;
		this.localservicesnames = bni.localservicesnames;
		this.localrelay = bni.localrelay;
		this.timeoffset = bni.timeoffset;
		this.connections = bni.connections;
		this.connections_in = bni.connections_in;
		this.connections_out = bni.connections_out;
		this.networkactive = bni.networkactive;
		this.networks = bni.networks;
		this.relayfee = bni.relayfee;
		this.incrementalfee = bni.incrementalfee;
		this.localaddresses = bni.localaddresses;
		this.warnings = Array.isArray(bni.warnings) ? bni.warnings : [bni.warnings];
	}
}
