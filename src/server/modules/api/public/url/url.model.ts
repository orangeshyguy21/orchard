/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrchardPublicUrl {

    @Field(() => String, { nullable: true })
    url: string;

    @Field(() => Int, { nullable: true })
    status: number;

    @Field(() => String, { nullable: true })
    ip_address: string;

    @Field(() => Boolean)   
    has_data: boolean;

    constructor(url: string, status: number, ip_address: string, has_data: boolean) {
        this.url = url;
        this.status = status;
        this.ip_address = ip_address;
        this.has_data = has_data;
    }
}