/* Core Dependencies */
import { ObjectType, Field } from '@nestjs/graphql';
/* Application Dependencies */
import { OrchardAuthToken } from '@server/modules/auth/auth.types';

@ObjectType()
export class OrchardAuthentication {

    @Field()
    access_token: string;

    constructor(token: OrchardAuthToken) {
        this.access_token = token.access_token;
    }
}