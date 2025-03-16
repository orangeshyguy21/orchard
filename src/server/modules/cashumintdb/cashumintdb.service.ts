/* Core Dependencies */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
const sqlite3d = require('sqlite3').verbose();
import { DateTime } from 'luxon';
/* Local Dependencies */
import { 
  CashuMintBalance,
  CashuMintKeyset,
  CashuMintDatabaseVersion,
  CashuMintMeltQuote,
  CashuMintMintQuote,
  CashuMintPromise,
  CashuMintProof,
  CashuMintAnalytics,
} from './cashumintdb.types';
import { CashuMintAnalyticsArgs, CashuMintMintQuotesArgs, CashuMintPromisesArgs } from './cashumintdb.interfaces';
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

  public async getMintMintQuotes(db:sqlite3.Database, args?: CashuMintMintQuotesArgs) : Promise<CashuMintMintQuote[]> {
    const field_mappings = {
      unit: 'unit',
      date_start: 'created_time',
      date_end: 'created_time',
      status: 'status'
    };
    const { sql, params } = buildDynamicQuery('mint_quotes', args, field_mappings);
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows:CashuMintMintQuote[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  public async getMintPromises(db:sqlite3.Database, args?: CashuMintPromisesArgs) : Promise<CashuMintPromise[]> {
    const field_mappings = {
      id_keysets: 'id',
      date_start: 'created',
      date_end: 'created'
    };
    const { sql, params } = buildDynamicQuery('promises', args, field_mappings);
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

  /* Analytics */

  public async getMintAnalyticsBalances(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
    console.log('getMintAnalyticsBalances', args);
    // Default interval is daily if not specified
    const interval = args?.interval || 'day';
    // Default timezone to UTC if not specified
    const timezone = args?.timezone || 'UTC';
    
    // Calculate timezone offset in seconds
    const now = DateTime.now().setZone(timezone);
    const offset_seconds = now.offset * 60; // Convert minutes to seconds
    
    // Build WHERE clause conditions
    const where_conditions = [];
    const params = [];
    
    if (args?.date_start) {
      where_conditions.push("mq.created_time >= ?");
      params.push(args.date_start);
    }
    
    if (args?.date_end) {
      where_conditions.push("mq.created_time <= ?");
      params.push(args.date_end);
    }
    
    if (args?.units && args.units.length > 0) {
      const unit_placeholders = args.units.map(() => '?').join(',');
      where_conditions.push(`mq.unit IN (${unit_placeholders})`);
      params.push(...args.units);
    }
    
    // Construct the WHERE clause
    const where_clause = where_conditions.length > 0 
      ? `WHERE ${where_conditions.join(' AND ')}` 
      : '';
    
    let time_group_sql;
    
    if (interval === 'custom') {
      time_group_sql = "mq.unit AS time_group";
    } else if (interval === 'day') {
      time_group_sql = `strftime('%Y-%m-%d', datetime(mq.created_time + ${offset_seconds}, 'unixepoch')) AS time_group`;
    } else if (interval === 'week') {
      time_group_sql = `strftime('%Y-%m-%d', datetime(mq.created_time + ${offset_seconds} - (strftime('%w', datetime(mq.created_time + ${offset_seconds}, 'unixepoch')) - 1) * 86400, 'unixepoch')) AS time_group`;
    } else if (interval === 'month') {
      time_group_sql = `strftime('%Y-%m-01', datetime(mq.created_time + ${offset_seconds}, 'unixepoch')) AS time_group`;
    }
    
    const sql = `
      SELECT 
        ${time_group_sql},
        mq.unit,
        SUM(CASE WHEN mq.state = 'ISSUED' THEN mq.amount ELSE 0 END) - 
        SUM(CASE WHEN lq.state = 'PAID' THEN lq.amount ELSE 0 END) AS amount,
        COUNT(DISTINCT mq.quote) + COUNT(DISTINCT lq.quote) AS operation_count,
        MIN(mq.created_time) as min_created_time
      FROM 
        mint_quotes mq
        LEFT JOIN melt_quotes lq ON lq.unit = mq.unit
        ${where_clause}
      GROUP BY 
        time_group, mq.unit
      ORDER BY 
        min_created_time;`;
    
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows:any[]) => {
        if (err) {
          reject(err);
          return;
        }
                
        const result = rows.map(row => {
          let timestamp;
          
          if (interval === 'custom') {
            // For custom interval, use the original timestamp
            timestamp = row.min_created_time;
          } else {
            // Get the date from the time_group using the proper timezone
            // Important: Use startOf('day') to ensure we're getting midnight in the target timezone
            const dt = DateTime.fromFormat(row.time_group, 'yyyy-MM-dd', {zone: timezone}).startOf('day');
            timestamp = Math.floor(dt.toSeconds());
          }
          
          return {
            unit: row.unit,
            amount: row.amount,
            created_time: timestamp,
            operation_count: row.operation_count,
          };
        });
        
        resolve(result as CashuMintAnalytics[]);
      });
    });
  }
}