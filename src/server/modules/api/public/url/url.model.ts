/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType({description: 'URL reachability result'})
export class OrchardPublicUrl {
	@Field(() => String, {nullable: true, description: 'Checked URL'})
	url: string;

	@Field(() => Int, {nullable: true, description: 'HTTP response status code'})
	status: number;

	@Field(() => String, {nullable: true, description: 'Resolved IP address of the URL'})
	ip_address: string;

	@Field(() => Boolean, {description: 'Whether the URL returned data'})
	has_data: boolean;

	constructor(url: string, status: number, ip_address: string, has_data: boolean) {
		this.url = url;
		this.status = status;
		this.ip_address = ip_address;
		this.has_data = has_data;
	}
}
