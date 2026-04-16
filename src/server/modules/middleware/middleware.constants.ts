/**
 * Key under which the per-request CSP nonce is stored on res.locals.
 * Written by security-headers.middleware, read by index-html.middleware.
 */
export const CSP_NONCE_KEY = 'csp_nonce';

/**
 * Matches every {{CSP_NONCE}} occurrence in the client index.html template.
 * Must stay in sync with the literal placeholder in src/client/index.html.
 */
export const CSP_NONCE_PLACEHOLDER = /\{\{CSP_NONCE\}\}/g;
