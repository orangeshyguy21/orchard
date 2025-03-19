/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintBalance } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { OrchardMintBalance } from './mintbalance.model';

@Injectable()
export class MintBalanceService {

	private readonly logger = new Logger(MintBalanceService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
	) {}

	private async withDb<T>(action: (db: sqlite3.Database) => Promise<T>): Promise<T> {
		let db: sqlite3.Database;
		try {
			db = await this.cashuMintDatabaseService.getMintDatabaseAsync();
		} catch (error) {
			this.logger.error('Error connecting to sqlite database', { error });
			throw OrchardApiErrors.MintDatabaseConnectionError;
		}

		try {
			return await action(db);
		} finally {
			if (db) db.close();
		}
	}

	async getMintBalances(): Promise<OrchardMintBalance[]> {
		return this.withDb(async (db) => {
			try {
				const cashu_mint_balances: CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalances(db);
				return cashu_mint_balances.map(cmb => new OrchardMintBalance(cmb));
			} catch (error) {
				this.logger.error('Error getting outstanding mint balance', { error });
				throw OrchardApiErrors.MintDatabaseSelectError;
			}
		});
	}

	async getIssuedMintBalances(): Promise<OrchardMintBalance[]> {
		return this.withDb(async (db) => {
			try {
				const cashu_mint_balances_issued: CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalancesIssued(db);
				return cashu_mint_balances_issued.map(cmb => new OrchardMintBalance(cmb));
			} catch (error) {
				this.logger.error('Error getting issued mint balance', { error });
				throw OrchardApiErrors.MintDatabaseSelectError;
			}
		});
	}

	async getRedeemedMintBalances(): Promise<OrchardMintBalance[]> {
		return this.withDb(async (db) => {
			try {
				const cashu_mint_balances_redeemed: CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalancesRedeemed(db);
				return cashu_mint_balances_redeemed.map(cmb => new OrchardMintBalance(cmb));
			} catch (error) {
				this.logger.error('Error getting redeemed mint balance', { error });
				throw OrchardApiErrors.MintDatabaseSelectError;
			}
		});
	}
}