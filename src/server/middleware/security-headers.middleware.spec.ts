import {Request, Response, NextFunction} from 'express';

import {securityHeaders} from './security-headers.middleware';

const CSP =
	"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws: wss:; font-src 'self'; object-src 'none'; frame-ancestors 'none'";

describe('securityHeaders', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: NextFunction;

	beforeEach(() => {
		req = {};
		res = {
			setHeader: jest.fn().mockReturnThis(),
		};
		next = jest.fn();
	});

	it('should set X-Content-Type-Options', () => {
		securityHeaders(true)(req as Request, res as Response, next);
		expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
	});

	it('should set X-Frame-Options to DENY', () => {
		securityHeaders(true)(req as Request, res as Response, next);
		expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
	});

	it('should disable X-XSS-Protection', () => {
		securityHeaders(true)(req as Request, res as Response, next);
		expect(res.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '0');
	});

	it('should set X-DNS-Prefetch-Control to off', () => {
		securityHeaders(true)(req as Request, res as Response, next);
		expect(res.setHeader).toHaveBeenCalledWith('X-DNS-Prefetch-Control', 'off');
	});

	it('should set X-Permitted-Cross-Domain-Policies to none', () => {
		securityHeaders(true)(req as Request, res as Response, next);
		expect(res.setHeader).toHaveBeenCalledWith('X-Permitted-Cross-Domain-Policies', 'none');
	});

	it('should set Referrer-Policy to no-referrer', () => {
		securityHeaders(true)(req as Request, res as Response, next);
		expect(res.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'no-referrer');
	});

	it('should enforce CSP in production', () => {
		securityHeaders(true)(req as Request, res as Response, next);
		expect(res.setHeader).toHaveBeenCalledWith('Content-Security-Policy', CSP);
	});

	it('should report-only CSP in development', () => {
		securityHeaders(false)(req as Request, res as Response, next);
		expect(res.setHeader).toHaveBeenCalledWith('Content-Security-Policy-Report-Only', CSP);
	});

	it('should call next()', () => {
		securityHeaders(true)(req as Request, res as Response, next);
		expect(next).toHaveBeenCalled();
	});
});
