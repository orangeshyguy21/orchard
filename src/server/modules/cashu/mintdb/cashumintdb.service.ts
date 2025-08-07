/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as path from 'path';
import * as util from 'util';
import {promises as fs} from 'fs';
import {exec} from 'child_process';
/* Vendor Dependencies */
import {Client} from 'pg';
import DatabaseConstructor from 'better-sqlite3';
import {pgDump, pgRestore, FormatEnum} from 'pg-dump-restore';
/* Application Dependencies */
import {MintType} from '@server/modules/cashu/cashu.enums';
import {NutshellService} from '@server/modules/cashu/nutshell/nutshell.service';
import {CdkService} from '@server/modules/cashu/cdk/cdk.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
/* Local Dependencies */
import {
	CashuMintDatabase,
	CashuMintBalance,
	CashuMintKeyset,
	CashuMintMeltQuote,
	CashuMintMintQuote,
	CashuMintAnalytics,
	CashuMintKeysetsAnalytics,
	CashuMintProofGroup,
	CashuMintPromiseGroup,
} from './cashumintdb.types';
import {
	CashuMintAnalyticsArgs,
	CashuMintMintQuotesArgs,
	CashuMintProofsArgs,
	CashuMintPromiseArgs,
	CashuMintMeltQuotesArgs,
} from './cashumintdb.interfaces';
import {MintDatabaseType} from './cashumintdb.enums';

const execAsync = util.promisify(exec);

@Injectable()
export class CashuMintDatabaseService implements OnModuleInit {
	private readonly logger = new Logger(CashuMintDatabaseService.name);
	private type: MintType;
	private database: string;

	constructor(
		private configService: ConfigService,
		private nutshellService: NutshellService,
		private cdkService: CdkService,
	) {}

	public async onModuleInit() {
		this.type = this.configService.get('cashu.type');
		this.database = this.configService.get('cashu.database');
	}

	public async getMintDatabase(): Promise<CashuMintDatabase> {
		try {
			if (this.configService.get('cashu.database_type') === 'sqlite') {
				const db = new DatabaseConstructor(this.database);
				return {type: MintDatabaseType.sqlite, database: db};
			} else {
				const client = new Client({
					connectionString: this.database,
				});
				return {type: MintDatabaseType.postgres, database: client};
			}
		} catch (error) {
			throw OrchardErrorCode.MintDatabaseConnectionError;
		}
	}

	public async getMintBalances(client: CashuMintDatabase, keyset_id?: string): Promise<CashuMintBalance[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintBalances(client, keyset_id);
		if (this.type === 'cdk') return this.cdkService.getMintBalances(client, keyset_id);
	}

	public async getMintBalancesIssued(client: CashuMintDatabase): Promise<CashuMintBalance[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintBalancesIssued(client);
		if (this.type === 'cdk') return this.cdkService.getMintBalancesIssued(client);
	}

	public async getMintBalancesRedeemed(client: CashuMintDatabase): Promise<CashuMintBalance[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintBalancesRedeemed(client);
		if (this.type === 'cdk') return this.cdkService.getMintBalancesRedeemed(client);
	}

	public async getMintKeysets(client: CashuMintDatabase): Promise<CashuMintKeyset[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintKeysets(client);
		if (this.type === 'cdk') return this.cdkService.getMintKeysets(client);
	}

	public async getMintMintQuotes(client: CashuMintDatabase, args?: CashuMintMintQuotesArgs): Promise<CashuMintMintQuote[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintMintQuotes(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintMintQuotes(client, args);
	}

	public async getMintMeltQuotes(client: CashuMintDatabase, args?: CashuMintMeltQuotesArgs): Promise<CashuMintMeltQuote[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintMeltQuotes(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintMeltQuotes(client, args);
	}

	public async getMintProofGroups(client: CashuMintDatabase, args?: CashuMintProofsArgs): Promise<CashuMintProofGroup[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintProofGroups(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintProofGroups(client, args);
	}

	public async getMintPromiseGroups(client: CashuMintDatabase, args?: CashuMintPromiseArgs): Promise<CashuMintPromiseGroup[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintPromiseGroups(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintPromiseGroups(client, args);
	}

	public async getMintCountMintQuotes(client: CashuMintDatabase, args?: CashuMintMintQuotesArgs): Promise<number> {
		if (this.type === 'nutshell') return this.nutshellService.getMintCountMintQuotes(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintCountMintQuotes(client, args);
	}

	public async getMintCountMeltQuotes(client: CashuMintDatabase, args?: CashuMintMeltQuotesArgs): Promise<number> {
		if (this.type === 'nutshell') return this.nutshellService.getMintCountMeltQuotes(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintCountMeltQuotes(client, args);
	}

	public async getMintCountProofGroups(client: CashuMintDatabase, args?: CashuMintProofsArgs): Promise<number> {
		if (this.type === 'nutshell') return this.nutshellService.getMintCountProofGroups(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintCountProofGroups(client, args);
	}

	public async getMintCountPromiseGroups(client: CashuMintDatabase, args?: CashuMintPromiseArgs): Promise<number> {
		if (this.type === 'nutshell') return this.nutshellService.getMintCountPromiseGroups(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintCountPromiseGroups(client, args);
	}

	/* Analytics */

	public async getMintAnalyticsBalances(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsBalances(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintAnalyticsBalances(client, args);
	}

	public async getMintAnalyticsMints(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsMints(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintAnalyticsMints(client, args);
	}

	public async getMintAnalyticsMelts(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsMelts(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintAnalyticsMelts(client, args);
	}

	public async getMintAnalyticsTransfers(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsTransfers(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintAnalyticsTransfers(client, args);
	}

	public async getMintAnalyticsKeysets(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintKeysetsAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsKeysets(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintAnalyticsKeysets(client, args);
	}

	/* Implementation Agnostic */

	public async createBackup(client: CashuMintDatabase): Promise<Buffer> {
		if (client.type === MintDatabaseType.sqlite) return this.createBackupSqlite(client);
		if (client.type === MintDatabaseType.postgres) return this.createBackupPostgres(client);
	}

	private async createBackupSqlite(client: CashuMintDatabase): Promise<Buffer> {
		const backup_path = path.resolve('temp-backup.db');
		try {
			await client.database.backup(backup_path);
			const file_buffer = await fs.readFile(backup_path);
			await fs.unlink(backup_path);
			return file_buffer;
		} catch (error) {
			this.logger.error(`Error during database backup: ${error.message}`);
			try {
				await fs.unlink(backup_path);
			} catch (cleanup_error) {
				// Ignore cleanup errors
			}
			throw error;
		}
	}

	private async createBackupPostgres(client: CashuMintDatabase): Promise<Buffer> {
		// try {
		// 	console.log('Starting database backup...');
		// 	const db_config = this.parsePostgresUrl(this.configService.get('cashu.database'));
		// 	const username = db_config.username;
		// 	const database = db_config.database;
		// 	const file_name = 'backup.sql';
		// 	const file_name_gzip = 'backup.sql.gz';

		// 	// Use execAsync instead of the execute package
		// 	await execAsync(`pg_dump -U ${username} -d ${database} -f ${file_name} -F t`);

		// 	console.log('Database dump completed, compressing...');
		// 	await execAsync(`gzip ${file_name}`);

		// 	console.log('Backup completed successfully');
		// 	return file_name_gzip as unknown as Buffer;
		// } catch (error) {
		// 	console.error('Backup failed:', error);
		// 	throw error;
		// }
		const db_config = this.parsePostgresUrl(this.configService.get('cashu.database'));
		const {stdout, stderr} = await pgDump(
			{
				port: Number(db_config.port),
				host: db_config.host,
				database: db_config.database,
				username: db_config.username,
				password: db_config.password,
			},
			{
				filePath: './dump.sql',
				format: FormatEnum.Custom,
			},
		);
		return Buffer.from(stdout);
	}

	private buildTableBackup(table_name: string, schema: any[], data: any[]): string {
		let sql = `\n-- Table: ${table_name}\n`;
		sql += `DROP TABLE IF EXISTS "${table_name}";\n`;
		sql += `CREATE TABLE "${table_name}" (\n`;

		const columns_sql = schema
			.map((col) => {
				let def = `"${col.column_name}" ${col.data_type}`;
				if (col.is_nullable === 'NO') def += ' NOT NULL';
				if (col.column_default) def += ` DEFAULT ${col.column_default}`;
				return def;
			})
			.join(',\n  ');

		sql += `  ${columns_sql}\n);\n\n`;

		if (data.length === 0) return sql;
		const columns = schema.map((col) => `"${col.column_name}"`).join(', ');
		sql += `INSERT INTO "${table_name}" (${columns}) VALUES\n`;
		const values = data
			.map((row) => {
				const row_values = schema.map((col) => {
					const value = row[col.column_name];
					return value === null ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`;
				});
				return `  (${row_values.join(', ')})`;
			})
			.join(',\n');

		sql += values + ';\n';
		return sql;
	}

	public async restoreBackup(filebase64: string): Promise<void> {
		if (this.configService.get('cashu.database_type') === 'sqlite') return this.restoreBackupSqlite(filebase64);
		if (this.configService.get('cashu.database_type') === 'postgres') return this.restoreBackupPostgres(filebase64);
	}

	private async restoreBackupSqlite(filebase64: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			const database_buffer: Buffer = Buffer.from(filebase64, 'base64');
			const restore_path = path.resolve('temp-restore.db');

			try {
				await fs.writeFile(restore_path, database_buffer);
				const is_valid_sqlite = await this.validateSqliteFile(restore_path);
				if (!is_valid_sqlite) {
					this.logger.error('Invalid file: Not a valid SQLite database');
					await fs.unlink(restore_path);
					reject(OrchardErrorCode.MintDatabaseRestoreInvalidError);
					return;
				}
				await fs.unlink(this.database);
				fs.copyFile(restore_path, this.database)
					.then(async () => {
						try {
							await fs.unlink(restore_path);
						} catch (cleanup_error) {
							this.logger.warn(`Warning: Could not clean up temporary file: ${cleanup_error.message}`);
						}
						this.logger.log('Database backup restored successfully');
						resolve();
					})
					.catch(async (copy_error) => {
						this.logger.error(`Error restoring database: ${copy_error.message}`);
						try {
							await fs.unlink(restore_path);
						} catch {}
						reject(copy_error);
					});
			} catch (write_error) {
				this.logger.error(`Error writing backup file: ${write_error.message}`);
				reject(write_error);
			}
		});
	}

	private async validateSqliteFile(file_path: string): Promise<boolean> {
		try {
			const file_handle = await fs.open(file_path, 'r');
			const buffer = Buffer.alloc(16);
			await file_handle.read(buffer, 0, 16, 0);
			await file_handle.close();
			const sqlite_header = Buffer.from('SQLite format 3\0');
			if (!buffer.equals(sqlite_header)) return false;
			const test_db = new DatabaseConstructor(file_path);
			const row = await test_db.prepare("SELECT name FROM sqlite_master WHERE type='table' LIMIT 1").get();
			test_db.close();
			return row !== undefined;
		} catch (error) {
			this.logger.error(`Error validating SQLite file: ${error.message}`);
			return false;
		}
	}

	private async restoreBackupPostgres(filebase64: string): Promise<void> {
		console.log('RESTORING POSTGRES BACKUP');
		const database_buffer: Buffer = Buffer.from(filebase64, 'base64');
		const restore_path = path.resolve('temp-restore.sql');

		try {
			await fs.writeFile(restore_path, database_buffer);
			const is_valid_sql = await this.validatePostgresFile(restore_path);
			if (!is_valid_sql) {
				this.logger.error('Invalid file: Not a valid PostgreSQL dump');
				await fs.unlink(restore_path);
				throw OrchardErrorCode.MintDatabaseRestoreInvalidError;
			}
			console.log('VALID SQL');
			const client = await this.getMintDatabase();
			if (client.type !== MintDatabaseType.postgres) {
				throw new Error('Expected PostgreSQL database');
			}
			console.log('VALID POSTGRES');
			const sql_content = await fs.readFile(restore_path, 'utf8');

			// Better SQL statement parsing that properly separates statements
			const statements = sql_content
				.split(';')
				.map((stmt) => stmt.trim())
				.filter((stmt) => stmt.length > 0)
				.map((stmt) => {
					// Remove any trailing semicolon that might be left
					return stmt.replace(/;$/, '');
				})
				.filter((stmt) => {
					// Filter out pure comment lines but keep statements that contain SQL
					const lines = stmt.split('\n');
					const non_comment_lines = lines.filter((line) => line.trim().length > 0 && !line.trim().startsWith('--'));
					return non_comment_lines.length > 0;
				})
				.map((stmt) => {
					// Remove comment lines from statements
					const lines = stmt.split('\n');
					const sql_lines = lines.filter((line) => line.trim().length > 0 && !line.trim().startsWith('--'));
					return sql_lines.join('\n').trim();
				});

			console.log(`Executing ${statements.length} SQL statements`);

			// Debug: Log all statements to see the order
			statements.forEach((stmt, index) => {
				console.log(`Statement ${index + 1}: ${stmt.substring(0, 50)}...`);
			});

			// Connect to the database explicitly
			await client.database.connect();
			console.log('Connected to PostgreSQL');

			for (let i = 0; i < statements.length; i++) {
				const statement = statements[i];
				if (statement.trim()) {
					try {
						console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 100)}...`);

						// Modify DROP statements to use CASCADE
						let modified_statement = statement;
						if (statement.includes('DROP TABLE IF EXISTS')) {
							modified_statement = statement.replace('DROP TABLE IF EXISTS', 'DROP TABLE IF EXISTS CASCADE');
						}

						// Add timeout to the query
						const query_promise = client.database.query(modified_statement);
						const timeout_promise = new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 30000));

						await Promise.race([query_promise, timeout_promise]);
						console.log(`Statement ${i + 1} completed successfully`);
					} catch (query_error) {
						console.error(`Error executing statement ${i + 1}: ${query_error.message}`);
						console.error(`Statement: ${statement}`);
						throw query_error;
					}
				}
			}

			// Close the connection
			await client.database.end();
			console.log('Disconnected from PostgreSQL');
			console.log('RESTORED');
			await fs.unlink(restore_path);
			this.logger.log('PostgreSQL database backup restored successfully');
			return;
		} catch (error) {
			this.logger.error(`Error restoring PostgreSQL database: ${error.message}`);
			try {
				await fs.unlink(restore_path);
			} catch (cleanup_error) {
				// Ignore cleanup errors
			}
			throw error;
		}
	}

	private async validatePostgresFile(file_path: string): Promise<boolean> {
		try {
			const content = await fs.readFile(file_path, 'utf8');
			const has_create_statements = content.includes('CREATE TABLE');
			const has_insert_statements = content.includes('INSERT INTO');
			const has_drop_statements = content.includes('DROP TABLE');
			return has_create_statements && has_insert_statements && has_drop_statements;
		} catch (error) {
			this.logger.error(`Error validating PostgreSQL file: ${error.message}`);
			return false;
		}
	}

	private parsePostgresUrl(connection_string: string) {
		const url = connection_string.replace('postgres://', '');
		const [auth_part, host_part] = url.split('@');
		const [username, password] = auth_part.split(':');
		const [host_port, database] = host_part.split('/');
		const [host, port] = host_port.split(':');
		return {
			username,
			password,
			host,
			port: port || '5432',
			database,
		};
	}
}
