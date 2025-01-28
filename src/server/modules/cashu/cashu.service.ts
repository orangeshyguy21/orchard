/* Core Dependencies */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
/* Application Models */
import { CashuBalance, CashuBalanceIssued, CashuBalanceRedeemed, CashuKeyset } from './cashu.types';
/* Globals */
const sqlite3d = require('sqlite3').verbose();

@Injectable()
export class CashuService {

  constructor(
    private configService: ConfigService,
  ) {}

  getDatabase() : sqlite3.Database {
    return new sqlite3d.Database(this.configService.get('cashu.database'));
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
        console.log('keysets: ', rows);
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

}
