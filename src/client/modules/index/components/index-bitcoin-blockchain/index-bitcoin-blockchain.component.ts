/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { FormGroup } from '@angular/forms';
/* Vendor Dependencies */
import { MatSelectChange } from '@angular/material/select';
/* Application Dependencies */
import { BitcoinBlock } from '@client/modules/bitcoin/classes/bitcoin-block.class';
import { BitcoinBlockTemplate } from '@client/modules/bitcoin/classes/bitcoin-block-template.class';
import { BitcoinTransaction } from '@client/modules/bitcoin/classes/bitcoin-transaction.class';
import { BitcoinTransactionFeeEstimate } from '@client/modules/bitcoin/classes/bitcoin-transaction-fee-estimate.class';
/* Local Dependencies */
import { possible_options } from './possible-options';

export type TargetOption = {
	target: number;
	blocks: number;
	blocks_label: string;
	time: string;
}

@Component({
	selector: 'orc-index-bitcoin-blockchain',
	standalone: false,
	templateUrl: './index-bitcoin-blockchain.component.html',
	styleUrl: './index-bitcoin-blockchain.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('blockDataChange', [
			transition('* => *', [
				animate('200ms ease-out', style({ opacity: 0.1 })),
				animate('400ms ease-in', style({ opacity: 1 }))
			]),
		]),
		trigger('blockIndicatorMove', [
			state('0', style({ right: '5rem' })),
			state('1', style({ right: '14rem' })),
			transition('0 => 1', [
				animate('300ms ease-in-out')
			]),
			transition('1 => 0', [
				animate('300ms ease-in-out')
			])
		])
    ]
})
export class IndexBitcoinBlockchainComponent implements OnInit, OnChanges {

	@Input() block!: BitcoinBlock | null;
	@Input() block_template!: BitcoinBlockTemplate | null;
	@Input() mempool!: BitcoinTransaction[] | null;
	@Input() txfee_estimate!: BitcoinTransactionFeeEstimate | null;
	@Input() form_group!: FormGroup;
	@Input() control_name!: string;

	@Output() target_change = new EventEmitter<number>();

	public target_options: TargetOption[] = [];
	public mempool_depth!: number;
	public target_block: number = 0;

	constructor(
		private readonly cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.mempool_depth = this.calculateMempoolBlocks();
		this.target_options = possible_options;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['txfee_estimate']) {
			this.target_block = this.getTargetBlock();
			this.cdr.detectChanges();
		}
	}

	private calculateMempoolBlocks(): number {
		if (!this.mempool || this.mempool.length === 0) return 0;
		const total_weight = this.mempool.reduce((sum, tx) => sum + tx.weight, 0);
		const block_weight_limit = 4000000; // 4MWU
		const num_blocks = Math.ceil(total_weight / block_weight_limit);
		return num_blocks;
	}

	public onTargetChange(event: MatSelectChange): void {
		this.target_change.emit(event.value);
	}

	public getSelectedTargetLabel(target: number): string {
		const option = this.target_options.find(option => option.target === target);
		if(!option) return '';
		return `<div>${option.blocks_label}</div> <div class="font-weight-semi-bold">${option.time}</div>`;
	}

	private getTargetBlock(): number {
		if(!this.txfee_estimate || !this.block_template) return 0;
		if( !this.txfee_estimate.feerate || !this.block_template.feerate_lowest ) return 0;
		if(this.txfee_estimate.feerate > this.block_template.feerate_lowest) return 0; 
		return 1;
	}
}