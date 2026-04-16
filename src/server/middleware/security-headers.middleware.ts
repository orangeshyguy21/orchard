/* Core Dependencies */
import {randomBytes} from 'crypto';
import {Request, Response, NextFunction} from 'express';

const STATIC_DIRECTIVES = [
	"default-src 'self'",
	"img-src 'self' data: https: http:",
	"connect-src 'self'",
	"font-src 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"style-src-attr 'unsafe-inline'",
];

/**
 * Builds the CSP header value.
 * In production, script-src and style-src are locked to the per-request nonce.
 * In development, they fall back to 'unsafe-inline' so the Angular dev server works unmodified.
 */
function buildCsp(production: boolean, nonce: string): string {
	const script_src = production ? `script-src 'nonce-${nonce}' 'strict-dynamic'` : "script-src 'self' 'unsafe-inline'";
	const style_src = production ? `style-src 'self' 'nonce-${nonce}'` : "style-src 'self' 'unsafe-inline'";
	return [...STATIC_DIRECTIVES, script_src, style_src].join('; ');
}

/**
 * Security Headers
 * Generates a per-request CSP nonce (exposed as `res.locals.csp_nonce` for template injection).
 * In production CSP blocks violations; in dev it only reports them.
 */
export function securityHeaders(production: boolean) {
	const csp_header = production ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only';

	return (_req: Request, res: Response, next: NextFunction): void => {
		const nonce = randomBytes(16).toString('base64');
		res.locals['csp_nonce'] = nonce;
		res.setHeader('X-Content-Type-Options', 'nosniff');
		res.setHeader('X-Frame-Options', 'DENY');
		res.setHeader('X-XSS-Protection', '0');
		res.setHeader('X-DNS-Prefetch-Control', 'off');
		res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
		res.setHeader('Referrer-Policy', 'no-referrer');
		res.setHeader(csp_header, buildCsp(production, nonce));
		next();
	};
}
