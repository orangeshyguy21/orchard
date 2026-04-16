/* Core Dependencies */
import {Request, Response, NextFunction} from 'express';

/** Pre-computed CSP directive */
const CSP = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: https: http:",
	"connect-src 'self'",
	"font-src 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	"base-uri 'self'",
	"form-action 'self'",
].join('; ');

/**
 * Security Headers
 * In production CSP blocks violations; in dev it only reports them.
 */
export function securityHeaders(production: boolean) {
	const csp_header = production ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only';

	return (_req: Request, res: Response, next: NextFunction): void => {
		res.setHeader('X-Content-Type-Options', 'nosniff');
		res.setHeader('X-Frame-Options', 'DENY');
		res.setHeader('X-XSS-Protection', '0');
		res.setHeader('X-DNS-Prefetch-Control', 'off');
		res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
		res.setHeader('Referrer-Policy', 'no-referrer');
		res.setHeader(csp_header, CSP);
		next();
	};
}
