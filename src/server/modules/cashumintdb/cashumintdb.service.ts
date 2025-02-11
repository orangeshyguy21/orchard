/* Core Dependencies */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
const sqlite3d = require('sqlite3').verbose();
/* Local Dependencies  */  // this is a better version than Internal - todo rename the old ones
import { 
  CashuMintBalance,
  CashuMintBalanceIssued,
  CashuMintBalanceRedeemed,
  CashuMintKeyset,
  CashuMintDatabaseVersion,
  CashuMintMeltQuote,
} from './cashumintdb.types';

@Injectable()
export class CashuMintDatabaseService {

  constructor(
    private configService: ConfigService,
  ) {}

  public getMintDatabase() : sqlite3.Database {
    return new sqlite3d.Database(this.configService.get('cashu.database'));
  }

  public async getMintBalances(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
    const sql = 'SELECT * FROM balance;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintBalance[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  public async getMintBalancesIssued(db:sqlite3.Database) : Promise<CashuMintBalanceIssued[]> {
    const sql = 'SELECT * FROM balance_issued;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintBalanceIssued[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  public async getMintBalancesRedeemed(db:sqlite3.Database) : Promise<CashuMintBalanceRedeemed[]> {
    const sql = 'SELECT * FROM balance_redeemed;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintBalanceRedeemed[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  public async getMintKeysets(db:sqlite3.Database) : Promise<CashuMintKeyset[]> {
    const sql = 'SELECT * FROM keysets;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintKeyset[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  public async getMintDatabaseVersions(db:sqlite3.Database) : Promise<CashuMintDatabaseVersion[]> {
    const sql = 'SELECT * FROM dbversions;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintDatabaseVersion[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  public async getMintMeltQuotes(db:sqlite3.Database) : Promise<CashuMintMeltQuote[]> {
    const sql = 'SELECT * FROM melt_quotes;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintMeltQuote[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
}