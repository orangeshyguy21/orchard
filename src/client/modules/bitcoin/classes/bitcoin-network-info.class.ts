import {OrchardBitcoinNetworkInfo, OrchardBitcoinNetworkAddress, OrchardBitcoinNetwork} from '@shared/generated.types';

export class BitcoinNetworkInfo implements OrchardBitcoinNetworkInfo {
	public connections: number;
	public connections_in: number;
	public connections_out: number;
	public incrementalfee: number;
	public localaddresses: OrchardBitcoinNetworkAddress[];
	public localrelay: boolean;
	public localservices: string;
	public localservicesnames: string[];
	public networkactive: boolean;
	public networks: OrchardBitcoinNetwork[];
	public protocolversion: number;
	public relayfee: number;
	public subversion: string;
	public timeoffset: number;
	public version: number;
	public warnings: string[];
	public backend: boolean;

	constructor(obn: OrchardBitcoinNetworkInfo) {
		this.connections = obn.connections;
		this.connections_in = obn.connections_in;
		this.connections_out = obn.connections_out;
		this.incrementalfee = obn.incrementalfee;
		this.localaddresses = obn.localaddresses;
		this.localrelay = obn.localrelay;
		this.localservices = obn.localservices;
		this.localservicesnames = obn.localservicesnames;
		this.networkactive = obn.networkactive;
		this.networks = obn.networks;
		this.protocolversion = obn.protocolversion;
		this.relayfee = obn.relayfee;
		this.subversion = obn.subversion;
		this.timeoffset = obn.timeoffset;
		this.version = obn.version;
		this.warnings = obn.warnings;
		this.backend = obn.backend;
	}
}
