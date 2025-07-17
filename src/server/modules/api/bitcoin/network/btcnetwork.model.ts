/* Core Dependencies */
import {Field, Int, Float, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {BitcoinNetworkInfo} from '@server/modules/bitcoin/rpc/btcrpc.types';

@ObjectType()
export class OrchardBitcoinNetwork {
	@Field((type) => String)
	name: string;

	@Field((type) => Boolean)
	limited: boolean;

	@Field((type) => Boolean)
	reachable: boolean;

	@Field((type) => String)
	proxy: string;

	@Field((type) => Boolean)
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
	@Field((type) => String)
	address: string;

	@Field((type) => Int)
	port: number;

	@Field((type) => Int)
	score: number;

	constructor(ban: BitcoinNetworkInfo['localaddresses'][number]) {
		this.address = ban.address;
		this.port = ban.port;
		this.score = ban.score;
	}
}

@ObjectType()
export class OrchardBitcoinNetworkInfo {
	@Field((type) => Int)
	version: number;

	@Field((type) => String)
	subversion: string;

	@Field((type) => Int)
	protocolversion: number;

	@Field((type) => String)
	localservices: string;

	@Field((type) => [String])
	localservicesnames: string[];

	@Field((type) => Boolean)
	localrelay: boolean;

	@Field((type) => Int)
	timeoffset: number;

	@Field((type) => Int)
	connections: number;

	@Field((type) => Int)
	connections_in: number;

	@Field((type) => Int)
	connections_out: number;

	@Field((type) => Boolean)
	networkactive: boolean;

	@Field((type) => [OrchardBitcoinNetwork])
	networks: OrchardBitcoinNetwork[];

	@Field((type) => Float)
	relayfee: number;

	@Field((type) => Float)
	incrementalfee: number;

	@Field((type) => [OrchardBitcoinNetworkAddress])
	localaddresses: OrchardBitcoinNetworkAddress[];

	@Field((type) => [String])
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
		this.warnings = bni.warnings;
	}
}
