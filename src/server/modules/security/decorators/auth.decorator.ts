import {SetMetadata} from '@nestjs/common';

export const PUBLIC_KEY = 'public';
export const Public = () => SetMetadata(PUBLIC_KEY, true);

export const NO_HEADERS_KEY = 'no_headers';
export const NoHeaders = () => SetMetadata(NO_HEADERS_KEY, true);
