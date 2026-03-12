/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType({description: 'Port reachability result'})
export class OrchardPublicPort {
	@Field(() => String, {description: 'Hostname or IP address'})
	host: string;

	@Field(() => Int, {description: 'Port number'})
	port: number;

	@Field(() => Boolean, {description: 'Whether the port is reachable'})
	reachable: boolean;

	@Field(() => String, {nullable: true, description: 'Error message if unreachable'})
	error: string;

	@Field(() => Int, {nullable: true, description: 'Connection latency in milliseconds'})
	latency_ms: number;

	constructor(host: string, port: number, reachable: boolean, error: string | null, latency_ms: number | null) {
		this.host = host;
		this.port = port;
		this.reachable = reachable;
		this.error = error;
		this.latency_ms = latency_ms;
	}
}
