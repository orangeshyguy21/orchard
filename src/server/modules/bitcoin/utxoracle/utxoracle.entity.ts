/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, Index} from 'typeorm';

@Entity('utxoracle')
@Index(['date'], {unique: true})
export class UTXOracle {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// Unix timestamp in seconds (midnight UTC of the date)
	@Column({type: 'integer', unique: true})
	date: number;

	// Central price from oracle
	@Column({type: 'integer'})
	price: number;
}
