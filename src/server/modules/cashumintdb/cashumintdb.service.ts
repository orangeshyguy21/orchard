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
    // Default interval is daily if not specified
    const interval = args?.interval || 'day';
    // Default timezone to UTC if not specified
    const timezone = args?.timezone || 'UTC';

    console.log('getMintAnalyticsBalances', args);
    
    // Calculate timezone offset in seconds
    const now = DateTime.now().setZone(timezone);
    const offset_seconds = now.offset * 60; // Convert minutes to seconds
    
    // Apply timezone offset to unix timestamps before formatting
    const applyOffset = (sqlFragment: string) => {
      // Replace the 'unixepoch' with 'unixepoch', '+offset' to adjust for timezone
      return sqlFragment.replace(
        "'unixepoch'", 
        `'unixepoch', '${offset_seconds > 0 ? '+' : ''}${offset_seconds} seconds'`
      );
    };
    
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
    
    // Build the date format string based on interval
    let date_format = '';
    let group_by = '';
    
    switch(interval) {
      case 'day':
        date_format = applyOffset("strftime('%s', DATE(mq.created_time, 'unixepoch'))");
        group_by = applyOffset("DATE(mq.created_time, 'unixepoch')");
        break;
      case 'week':
        date_format = applyOffset("strftime('%s', DATE(mq.created_time, 'unixepoch', 'weekday 0', '-6 days'))");
        group_by = applyOffset("DATE(mq.created_time, 'unixepoch', 'weekday 0', '-6 days')");
        break;
      case 'month':
        date_format = applyOffset("strftime('%s', DATE(mq.created_time, 'unixepoch', 'start of month'))");
        group_by = applyOffset("strftime('%Y-%m', DATETIME(mq.created_time, 'unixepoch'))");
        break;
      case 'custom':
        date_format = applyOffset("strftime('%s', DATE(mq.created_time, 'unixepoch'))");
        group_by = "mq.unit"; // Only group by unit, not by date
        break;
    }
    
    // Update the LEFT JOIN to use the same timezone formatting for non-custom intervals
    let lq_join_condition = '';
    
    if (interval === 'custom') {
      lq_join_condition = "lq.unit = mq.unit";
    } else {
      const lq_date_format = applyOffset("DATE(lq.created_time, 'unixepoch')");
      lq_join_condition = `${group_by} = ${lq_date_format} AND lq.unit = mq.unit`;
    }
    
    const sql = `SELECT 
      ${date_format} AS created_time,
      mq.unit,
      SUM(CASE WHEN mq.state = 'ISSUED' THEN mq.amount ELSE 0 END) - 
      SUM(CASE WHEN lq.state = 'PAID' THEN lq.amount ELSE 0 END) AS amount,
      COUNT(mq.quote) + COUNT(lq.quote) AS operation_count
    FROM 
      mint_quotes mq
      LEFT JOIN melt_quotes lq ON ${lq_join_condition}
      ${where_clause}
    GROUP BY 
      ${interval === 'custom' ? 'mq.unit' : `${group_by}, mq.unit`};`;

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows:CashuMintAnalytics[]) => {
        if (err) reject(err);
        
        // Post-process the results to ensure proper timezone handling
        const processed_rows = rows.map(row => {
          // Convert the timestamp to a DateTime object in the specified timezone
          if (row.created_time) {
            const dt = DateTime.fromSeconds(Number(row.created_time)).setZone(timezone);
            row.created_time = dt.toSeconds().toString();
          }
          return row;
        });
        
        resolve(processed_rows);
      });
    });
  }
}