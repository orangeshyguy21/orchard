/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardCommonCount {
    @Field(() => Int)
    count: number;

    constructor(count: number) {
        this.count = count;
    }
}
