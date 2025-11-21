/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Vendor Dependencies */
import {Cron} from '@nestjs/schedule';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';
import {SettingService} from '@server/modules/setting/setting.service';
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {BitcoinUTXOracleService} from '@server/modules/bitcoin/utxoracle/utxoracle.service';
import {BitcoinType} from '@server/modules/bitcoin/bitcoin.enums';
import {SettingKey} from '@server/modules/setting/setting.enums';

@Injectable()
export class TaskService {
	private readonly logger = new Logger(TaskService.name);

	constructor(
		private authService: AuthService,
		private settingService: SettingService,
		private bitcoinRpcService: BitcoinRpcService,
		private bitcoinUTXOracleService: BitcoinUTXOracleService,
		private configService: ConfigService,
	) {}

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

	/**
	 * Run Bitcoin oracle for previous day and save price at 1 AM UTC
	 */
	@Cron('0 1 * * *', {
		name: 'daily-bitcoin-oracle',
		timeZone: 'UTC',
	})
	async runDailyBitcoinOracle() {
		const bitcoin_type = this.configService.get<BitcoinType>('bitcoin.type');
		if (!bitcoin_type) {
			this.logger.debug('Bitcoin not configured, skipping oracle job');
			return;
		}

		const bitcoin_oracle_enabled = await this.settingService.getSetting(SettingKey.BITCOIN_ORACLE);
		if (!bitcoin_oracle_enabled) {
			this.logger.debug('Bitcoin oracle is not enabled, skipping oracle job');
			return;
		}

		try {
			const blockchain_info = await this.bitcoinRpcService.getBitcoinBlockchainInfo();
			if (blockchain_info.chain !== 'main') {
				this.logger.debug(`Bitcoin chain is ${blockchain_info.chain}, oracle only runs on mainnet. Skipping job.`);
				return;
			}
		} catch (error) {
			this.logger.error(`Failed to check Bitcoin chain: ${error.message}`);
			return;
		}

		this.logger.log('Starting daily Bitcoin oracle job...');
		try {
			const yesterday = DateTime.utc().minus({days: 1}).startOf('day');
			const date_timestamp = Math.floor(yesterday.toSeconds());
			const date_str = yesterday.toFormat('yyyy-MM-dd');
			this.logger.log(`Running oracle for date: ${date_str} (timestamp: ${date_timestamp})`);
			const result = await this.bitcoinUTXOracleService.runOracle({
				date: date_timestamp,
				intraday: false,
			});
			await this.bitcoinUTXOracleService.saveOraclePrice(date_timestamp, result.central_price);
			this.logger.log(`Oracle job completed for ${date_str}: price=${result.central_price}`);
		} catch (error) {
			this.logger.error(`Error running daily oracle: ${error.message}`, error.stack);
		}
	}
}
