/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CredentialService {
	private readonly logger = new Logger(CredentialService.name);

	constructor() {}

	public loadPemOrPath(value?: string): Buffer | undefined {
		if (!value) return undefined;
		// File path
		if (this.isProbablyPath(value)) return this.readPath(value) ?? undefined;
		// base64:... or b64:...
		const b64_prefix = value.match(/^(base64|b64):/i);
		if (b64_prefix) {
			try {
				return Buffer.from(value.slice(b64_prefix[0].length), 'base64');
			} catch {
				return undefined;
			}
		}
		// Inline PEM (supports escaped newlines)
		const normalized = this.normalizeNewlines(value);
		if (normalized.includes('-----BEGIN ')) return Buffer.from(normalized, 'utf8');
		// Try raw base64 without prefix
		try {
			const buf = Buffer.from(value, 'base64');
			// Heuristic: if decoding changed length meaningfully, accept
			if (buf.length > 0 && Math.abs(buf.length * 1.37 - value.length) < value.length * 0.2) return buf;
		} catch {}
		// Fallback: treat as inline text
		return Buffer.from(normalized, 'utf8');
	}

	public loadMacaroonHex(value?: string): string | undefined {
		if (!value) return undefined;
		// File path
		if (this.isProbablyPath(value)) {
			const buf = this.readPath(value);
			return buf ? buf.toString('hex') : undefined;
		}
		// hex:... prefix
		if (/^hex:/i.test(value)) {
			const hex = value.slice(4);
			return /^[0-9a-fA-F]+$/.test(hex) ? hex.toLowerCase() : undefined;
		}
		// base64:... or b64:...
		const b64_prefix = value.match(/^(base64|b64):/i);
		if (b64_prefix) {
			try {
				return Buffer.from(value.slice(b64_prefix[0].length), 'base64').toString('hex');
			} catch {
				return undefined;
			}
		}
		// Bare hex
		if (/^[0-9a-fA-F]+$/.test(value) && value.length % 2 === 0) return value.toLowerCase();
		// Bare base64
		try {
			return Buffer.from(value, 'base64').toString('hex');
		} catch {}
		return undefined;
	}

	private normalizeNewlines(value: string): string {
		return value.replace(/\\n/g, '\n');
	}

	private isProbablyPath(value: string): boolean {
		if (!value) return false;
		if (value.startsWith('file://')) return true;
		if (path.isAbsolute(value)) return true;
		if (value.startsWith('./') || value.startsWith('../')) return true;
		try {
			return fs.existsSync(value);
		} catch {
			return false;
		}
	}

	private readPath(value: string): Buffer | undefined {
		const file_path = value.startsWith('file://') ? value.replace(/^file:\/\//, '') : value;
		try {
			return fs.readFileSync(file_path);
		} catch {
			return undefined;
		}
	}
}
