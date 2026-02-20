/* Core Dependencies */
import {SetMetadata} from '@nestjs/common';

export const CHANGE_LOG_KEY = 'change_log';

export interface ChangeLogMetadata {
    field: string;
    arg_key: string;
    old_value_key?: string;
}

/**
 * Decorator that marks a resolver method for change history logging.
 * Used with a change log interceptor to automatically log changes.
 * @param {ChangeLogMetadata} metadata - The change log configuration
 */
export const LogChange = (metadata: ChangeLogMetadata) => SetMetadata(CHANGE_LOG_KEY, metadata);
