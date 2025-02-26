/* Core Dependencies */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
const sqlite3d = require('sqlite3').verbose();
import { GraphQLResolveInfo } from 'graphql';
/* Local Dependencies */
import { 
  CashuMintBalance,
  CashuMintKeyset,
  CashuMintDatabaseVersion,
  CashuMintMeltQuote,
  CashuMintMintQuote,
  CashuMintPromise,
  CashuMintProof,
} from './cashumintdb.types';
import { CashuMintPromisesArgs } from './cashumintdb.interfaces';
import { buildDynamicQuery } from './cashumintdb.helpers';

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

  public async getMintBalancesIssued(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
    const sql = 'SELECT * FROM balance_issued;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintBalance[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  public async getMintBalancesRedeemed(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
    const sql = 'SELECT * FROM balance_redeemed;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintBalance[]) => {
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

  public async getMintMintQuotes(db:sqlite3.Database) : Promise<CashuMintMintQuote[]> {
    const sql = 'SELECT * FROM mint_quotes;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintMintQuote[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  public async getMintPromises(db:sqlite3.Database, field_selection?: GraphQLResolveInfo, args?: CashuMintPromisesArgs) : Promise<CashuMintPromise[]> {

    const field_mappings = {
      id_keysets: 'id',
      date_start: 'created_at',
      date_end: 'created_at'
    };

    const { sql, params } = buildDynamicQuery('promises', field_selection, args, field_mappings);

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows:CashuMintPromise[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  public async getMintProofsPending(db:sqlite3.Database) : Promise<CashuMintProof[]> {
    const sql = 'SELECT * FROM proofs_pending;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintProof[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  public async getMintProofsUsed(db:sqlite3.Database) : Promise<CashuMintProof[]> {
    const sql = 'SELECT * FROM proofs_used;';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows:CashuMintProof[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
}