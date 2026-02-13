/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardPublicPort {
	@Field(() => String)
	host: string;

	@Field(() => Int)
	port: number;

	@Field(() => Boolean)
	reachable: boolean;

	@Field(() => String, {nullable: true})
	error: string;

	@Field(() => Int, {nullable: true})
	latency_ms: number;

	constructor(host: string, port: number, reachable: boolean, error: string | null, latency_ms: number | null) {
		this.host = host;
		this.port = port;
		this.reachable = reachable;
		this.error = error;
		this.latency_ms = latency_ms;
	}
}
