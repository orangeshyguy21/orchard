import { GraphQLError } from 'graphql';
import { OrchardApiErrorCode, OrchardApiErrorMessages } from "../errors/orchard.errors";

export class OrchardApiError extends GraphQLError {
    constructor(code: OrchardApiErrorCode) {        
        super( OrchardApiErrorMessages[code], {
            extensions: {
                code: code
            }
        });
    }
}