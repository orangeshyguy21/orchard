/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Vendor Dependencies */
import {Cron} from '@nestjs/schedule';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';

@Injectable()
export class TaskService {
	private readonly logger = new Logger(TaskService.name);

	constructor(private authService: AuthService) {}

	/**
	 * Clean up expired tokens from blacklist daily at 3 AM
	 */
	@Cron('0 3 * * *', {
		name: 'cleanup-expired-tokens',
		timeZone: 'UTC',
	})
	async cleanupExpiredTokens() {
		this.logger.log('Starting expired token cleanup...');
		try {
			const count = await this.authService.cleanupExpiredTokens();
			this.logger.log(`Cleaned up ${count} expired tokens`);
		} catch (error) {
			this.logger.error(`Error cleaning up tokens: ${error.message}`);
		}
	}
}
