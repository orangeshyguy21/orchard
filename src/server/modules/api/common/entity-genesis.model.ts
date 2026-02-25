/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';

@ObjectType()
export class OrchardCommonGenesis {
	@Field(() => UnixTimestamp)
	timestamp: number;

	constructor(timestamp: number) {
		this.timestamp = timestamp;
	}
}
