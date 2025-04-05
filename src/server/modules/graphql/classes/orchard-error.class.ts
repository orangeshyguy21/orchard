import { GraphQLError } from 'graphql';
import { OrchardErrorCode, OrchardErrorMessages } from "@server/modules/error/orchard.errors";

export class OrchardApiError extends GraphQLError {
    constructor(code: OrchardErrorCode) {        
        super( OrchardErrorMessages[code], {
            extensions: {
                code: code
            }
        });
    }
}