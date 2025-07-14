/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexBitcoinBlockchainComponent implements OnInit {

	@Input() block!: BitcoinBlock | null;
	@Input() block_template!: BitcoinBlockTemplate | null;
	@Input() mempool!: BitcoinTransaction[] | null;
	@Input() txfee_estimate!: BitcoinTransactionFeeEstimate | null;
	@Input() form_group!: FormGroup;
	@Input() control_name!: string;

	@Output() target_change = new EventEmitter<number>();

	public target_options: TargetOption[] = [];

	ngOnInit(): void {
		this.target_options = this.getTargetOptions();
	}

	private getTargetOptions(): TargetOption[] {
		const mempool_blocks = this.calculateMempoolBlocks();
		// return possible_options.filter(option => option.blocks <= mempool_blocks);
		return possible_options;
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
}