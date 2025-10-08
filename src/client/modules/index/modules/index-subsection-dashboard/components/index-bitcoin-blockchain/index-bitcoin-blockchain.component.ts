/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	input,
	OnInit,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	AfterViewInit,
	effect,
	computed,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {MatSelectChange} from '@angular/material/select';
/* Application Dependencies */
import {BitcoinBlock} from '@client/modules/bitcoin/classes/bitcoin-block.class';
import {BitcoinBlockTemplate} from '@client/modules/bitcoin/classes/bitcoin-block-template.class';
import {BitcoinTransaction} from '@client/modules/bitcoin/classes/bitcoin-transaction.class';
import {BitcoinTransactionFeeEstimate} from '@client/modules/bitcoin/classes/bitcoin-transaction-fee-estimate.class';
/* Local Dependencies */
import {possible_options} from './possible-options';

export type TargetOption = {
	target: number;
	blocks: number;
	blocks_label: string;
	time: string;
};

@Component({
	selector: 'orc-index-bitcoin-blockchain',
	standalone: false,
	templateUrl: './index-bitcoin-blockchain.component.html',
	styleUrl: './index-bitcoin-blockchain.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexBitcoinBlockchainComponent implements OnInit, AfterViewInit {
	public block = input<BitcoinBlock | null>(null);
	public block_height = input<number | null>(null);
	public block_template = input<BitcoinBlockTemplate | null>(null);
	public mempool = input<BitcoinTransaction[] | null>(null);
	public txfee_estimate = input<BitcoinTransactionFeeEstimate | null>(null);
	public form_group = input.required<FormGroup>();
	public control_name = input.required<string>();

	@Output() target_change = new EventEmitter<number>();

	@ViewChild('flash', {read: ElementRef}) flash!: ElementRef<HTMLElement>;

	public target_options: TargetOption[] = [];
	public mempool_depth!: number;
	public target_block = computed(() => this.getTargetBlock());

	private initialized: boolean = false;

	constructor() {
		effect(() => {
			const block_height = this.block_height();
			if (!block_height) return;
			this.animateFlash();
		});
	}

	ngOnInit(): void {
		this.mempool_depth = this.calculateMempoolBlocks();
		this.target_options = possible_options;
	}

	ngAfterViewInit(): void {
		this.initialized = true;
	}

	private calculateMempoolBlocks(): number {
		const mempool = this.mempool();
		if (!mempool || mempool.length === 0) return 0;
		const total_weight = mempool.reduce((sum, tx) => sum + tx.weight, 0);
		const block_weight_limit = 4000000; // 4MWU
		const num_blocks = Math.ceil(total_weight / block_weight_limit);
		return num_blocks;
	}

	public onTargetChange(event: MatSelectChange): void {
		this.target_change.emit(event.value);
	}

	public getSelectedTargetLabel(target: number): string {
		const option = this.target_options.find((option) => option.target === target);
		if (!option) return '';
		return `<div>${option.blocks_label}</div> <div class="font-weight-semi-bold">${option.time}</div>`;
	}

	private getTargetBlock(): number {
		const txfee_estimate = this.txfee_estimate();
		const block_template = this.block_template();
		if (!txfee_estimate || !block_template) return 0;
		if (!txfee_estimate.feerate || !block_template.feerate_low) return 0;
		if (txfee_estimate.feerate > block_template.feerate_low) return 0;
		return 1;
	}

	private animateFlash(): void {
		if (!this.initialized) return;
		const flash = this.flash.nativeElement;
		for (const anim of flash.getAnimations()) anim.cancel();
		flash
			.animate([{opacity: 1}, {opacity: 0.1}], {duration: 200, easing: 'ease-out', fill: 'forwards'})
			.finished.catch(() => {})
			.finally(() => {
				flash.animate([{opacity: 0.1}, {opacity: 1}], {duration: 400, easing: 'ease-in', fill: 'forwards'});
			});
	}
}
