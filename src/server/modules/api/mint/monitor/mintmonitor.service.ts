/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {existsSync, statfsSync} from 'fs';
import * as os from 'os';
import * as path from 'path';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {OrchardMintMonitor} from './mintmonitor.model';

@Injectable()
export class MintMonitorService {
	private readonly logger = new Logger(MintMonitorService.name);
	private static readonly RECENT_WINDOW_HOURS = 24;

	constructor(
		private configService: ConfigService,
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintMonitor(tag: string): Promise<OrchardMintMonitor> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const now = Math.floor(Date.now() / 1000);
				const recent_window_start = now - MintMonitorService.RECENT_WINDOW_HOURS * 60 * 60;
				const [mint_quotes_total, melt_quotes_total, proof_groups_total, promise_groups_total] = await Promise.all([
					this.cashuMintDatabaseService.getMintCountMintQuotes(client),
					this.cashuMintDatabaseService.getMintCountMeltQuotes(client),
					this.cashuMintDatabaseService.getMintCountProofGroups(client),
					this.cashuMintDatabaseService.getMintCountPromiseGroups(client),
				]);
				const [mint_quotes_recent, melt_quotes_recent] = await Promise.all([
					this.cashuMintDatabaseService.getMintCountMintQuotes(client, {
						date_start: recent_window_start,
						date_end: now,
					}),
					this.cashuMintDatabaseService.getMintCountMeltQuotes(client, {
						date_start: recent_window_start,
						date_end: now,
					}),
				]);
				const host_metrics = this.getHostMetrics();
				return new OrchardMintMonitor({
					db_entries_total: mint_quotes_total + melt_quotes_total + proof_groups_total + promise_groups_total,
					mint_quotes_total,
					melt_quotes_total,
					proof_groups_total,
					promise_groups_total,
					request_count_recent: mint_quotes_recent + melt_quotes_recent,
					recent_window_hours: MintMonitorService.RECENT_WINDOW_HOURS,
					disk_free_bytes: host_metrics.disk_free_bytes,
					disk_total_bytes: host_metrics.disk_total_bytes,
					cpu_cores: host_metrics.cpu_cores,
					cpu_load_1m: host_metrics.cpu_load_1m,
					cpu_load_5m: host_metrics.cpu_load_5m,
					cpu_load_15m: host_metrics.cpu_load_15m,
					cpu_usage_percent: host_metrics.cpu_usage_percent,
				});
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}

	private getHostMetrics(): {
		disk_free_bytes: number;
		disk_total_bytes: number;
		cpu_cores: number;
		cpu_load_1m: number;
		cpu_load_5m: number;
		cpu_load_15m: number;
		cpu_usage_percent: number;
	} {
		const cpu_cores = Math.max(os.cpus().length, 1);
		const [cpu_load_1m, cpu_load_5m, cpu_load_15m] = os.loadavg();
		const cpu_usage_percent = Math.min((cpu_load_1m / cpu_cores) * 100, 100);

		let disk_free_bytes = 0;
		let disk_total_bytes = 0;
		try {
			const target_path = this.getDiskTargetPath();
			const disk_stats = statfsSync(target_path);
			const block_size = Number(disk_stats.bsize);
			disk_free_bytes = Number(disk_stats.bavail) * block_size;
			disk_total_bytes = Number(disk_stats.blocks) * block_size;
		} catch (error) {
			this.logger.warn(`Unable to collect disk metrics: ${String(error)}`);
		}

		return {
			disk_free_bytes,
			disk_total_bytes,
			cpu_cores,
			cpu_load_1m,
			cpu_load_5m,
			cpu_load_15m,
			cpu_usage_percent,
		};
	}

	private getDiskTargetPath(): string {
		const configured_db_path = this.configService.get<string>('database.path');
		if (!configured_db_path || configured_db_path.includes('://')) return process.cwd();
		const resolved_db_path = path.isAbsolute(configured_db_path) ? configured_db_path : path.resolve(process.cwd(), configured_db_path);
		const db_dir = path.dirname(resolved_db_path);
		return existsSync(db_dir) ? db_dir : process.cwd();
	}
}
