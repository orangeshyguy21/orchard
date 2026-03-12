/* Core Dependencies */
import {Field, ObjectType, Float} from '@nestjs/graphql';
/* Application Dependencies */
import {LightningPeer} from '@server/modules/lightning/lightning/lightning.types';

@ObjectType()
export class OrchardLightningPeer {
	@Field(() => String)
	pubkey: string;

	@Field(() => String, {nullable: true})
	alias: string | null;

	@Field(() => String)
	address: string;

	@Field(() => Float, {nullable: true})
	bytes_sent: number | null;

	@Field(() => Float, {nullable: true})
	bytes_recv: number | null;

	@Field(() => Float, {nullable: true})
	sat_sent: number | null;

	@Field(() => Float, {nullable: true})
	sat_recv: number | null;

	@Field(() => Boolean, {nullable: true})
	inbound: boolean | null;

	@Field(() => Float, {nullable: true})
	ping_time: number | null;

	constructor(peer: LightningPeer) {
		this.pubkey = peer.pubkey;
		this.alias = peer.alias;
		this.address = peer.address;
		this.bytes_sent = peer.bytes_sent != null ? parseFloat(peer.bytes_sent) : null;
		this.bytes_recv = peer.bytes_recv != null ? parseFloat(peer.bytes_recv) : null;
		this.sat_sent = peer.sat_sent != null ? parseFloat(peer.sat_sent) : null;
		this.sat_recv = peer.sat_recv != null ? parseFloat(peer.sat_recv) : null;
		this.inbound = peer.inbound;
		this.ping_time = peer.ping_time;
	}
}
