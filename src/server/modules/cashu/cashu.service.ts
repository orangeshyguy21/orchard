/* Core Dependencies */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
/* Application Dependencies */
import { FetchService } from '../fetch/fetch.service';
/* Application Models */
import { 
  CashuInfo,
  CashuBalance,
  CashuBalanceIssued,
  CashuBalanceRedeemed,
  CashuKeyset,
  CashuDbVersions
} from './cashu.types';
/* Globals */
const sqlite3d = require('sqlite3').verbose();

@Injectable()
export class CashuService {

  constructor(
    private configService: ConfigService,
    private fetchService: FetchService,
  ) {}

  getDatabase() : sqlite3.Database {
    return new sqlite3d.Database(this.configService.get('cashu.database'));
  }

  async getInfo() : Promise<CashuInfo> {
    // should we be error handling here?
    const response = await this.fetchService.fetchWithProxy(
      `${this.configService.get('cashu.api')}/v1/info`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
    );
    return response.json();
  }

  async getBalances(db:sqlite3.Database) : Promise<CashuBalance[]> {
    const sql = 'SELECT * FROM balance;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuBalance[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async getBalancesIssued(db:sqlite3.Database) : Promise<CashuBalanceIssued[]> {
    const sql = 'SELECT * FROM balance_issued;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuBalanceIssued[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async getBalancesRedeemed(db:sqlite3.Database) : Promise<CashuBalanceRedeemed[]> {
    const sql = 'SELECT * FROM balance_redeemed;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuBalanceRedeemed[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async getKeysets(db:sqlite3.Database) : Promise<CashuKeyset[]> {
    const sql = 'SELECT * FROM keysets;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuKeyset[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async getDbVersions(db:sqlite3.Database) : Promise<CashuDbVersions[]> {
    const sql = 'SELECT * FROM dbversions;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuDbVersions[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
}