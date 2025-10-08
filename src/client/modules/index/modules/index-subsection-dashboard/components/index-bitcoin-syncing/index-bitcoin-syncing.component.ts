/* Core Dependencies */
import {ChangeDetectionStrategy, Component, ChangeDetectorRef, input, OnInit, ViewChild, ElementRef, computed, effect} from '@angular/core';
/* Application Dependencies */
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import {BitcoinBlock} from '@client/modules/bitcoin/classes/bitcoin-block.class';

@Component({
	selector: 'orc-index-bitcoin-syncing',
	standalone: false,
	templateUrl: './index-bitcoin-syncing.component.html',
	styleUrl: './index-bitcoin-syncing.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexBitcoinSyncingComponent implements OnInit {
	public blockchain_info = input<BitcoinBlockchainInfo | null>(null);
	public block = input<BitcoinBlock | null>(null);

	@ViewChild('flash_height_one', {read: ElementRef}) flash_height_one!: ElementRef<HTMLElement>;
	@ViewChild('flash_height_two', {read: ElementRef}) flash_height_two!: ElementRef<HTMLElement>;
	@ViewChild('flash_time', {read: ElementRef}) flash_time!: ElementRef<HTMLElement>;
	@ViewChild('flash_hash', {read: ElementRef}) flash_hash!: ElementRef<HTMLElement>;
	@ViewChild('flash_chainwork', {read: ElementRef}) flash_chainwork!: ElementRef<HTMLElement>;
	@ViewChild('flash_headers', {read: ElementRef}) flash_headers!: ElementRef<HTMLElement>;

	public polling_block: boolean = false;

	public sync_progress = computed(() => {
		const blockchain_info = this.blockchain_info();
		if (!blockchain_info) return 0;
		return blockchain_info.verificationprogress * 100;
	});

	private previous_values: {
		height: number | null;
		time: number | null;
		hash: string | null;
		chainwork: string | null;
		headers: number | null;
	} = {height: null, time: null, hash: null, chainwork: null, headers: null};

	constructor(private cdr: ChangeDetectorRef) {
		effect(() => {
			const block = this.block();
			const info = this.blockchain_info();
			if (!block && !info) return;
			const current_values = {
				time: block?.time ?? null,
				height: block?.height ?? null,
				hash: block?.hash ?? null,
				chainwork: block?.chainwork ?? null,
				headers: info?.headers ?? null,
			};

			if (current_values.height !== this.previous_values.height) this.animateHeight(this.flash_height_one);
			if (current_values.time !== this.previous_values.time) this.animateTime(this.flash_time);
			if (current_values.hash !== this.previous_values.hash) this.animateHash(this.flash_hash);
			if (current_values.chainwork !== this.previous_values.chainwork) this.animateChainwork(this.flash_chainwork);
			if (current_values.headers !== this.previous_values.headers) this.animateHeaders(this.flash_headers);
			this.previous_values = current_values;
		});
	}

	ngOnInit(): void {
		this.pollingBlock();
	}

	private pollingBlock(): void {
		if (this.blockchain_info()?.is_synced) return;
		setTimeout(() => {
			this.polling_block = true;
			this.cdr.detectChanges();
		}, 1000);
	}

	private animateHeight(element: ElementRef<HTMLElement>): void {
		if (!this.polling_block) return;
		const flash_height_one = element.nativeElement;
		for (const anim of flash_height_one.getAnimations()) anim.cancel();
		flash_height_one
			.animate([{opacity: 1}, {opacity: 0.1}], {duration: 200, easing: 'ease-out', fill: 'forwards'})
			.finished.catch(() => {})
			.finally(() => {
				flash_height_one.animate([{opacity: 0.1}, {opacity: 1}], {duration: 400, easing: 'ease-in', fill: 'forwards'});
			});
		const flash_height_two = this.flash_height_two.nativeElement;
		for (const anim of flash_height_two.getAnimations()) anim.cancel();
		flash_height_two
			.animate([{opacity: 1}, {opacity: 0.1}], {duration: 200, easing: 'ease-out', fill: 'forwards'})
			.finished.catch(() => {})
			.finally(() => {
				flash_height_two.animate([{opacity: 0.1}, {opacity: 1}], {duration: 400, easing: 'ease-in', fill: 'forwards'});
			});
	}

	private animateTime(element: ElementRef<HTMLElement>): void {
		if (!this.polling_block) return;
		const flash_time = element.nativeElement;
		for (const anim of flash_time.getAnimations()) anim.cancel();
		flash_time
			.animate([{opacity: 1}, {opacity: 0.1}], {duration: 200, easing: 'ease-out', fill: 'forwards'})
			.finished.catch(() => {})
			.finally(() => {
				flash_time.animate([{opacity: 0.1}, {opacity: 1}], {duration: 400, easing: 'ease-in', fill: 'forwards'});
			});
	}

	private animateHash(element: ElementRef<HTMLElement>): void {
		if (!this.polling_block) return;
		const flash_hash = element.nativeElement;
		for (const anim of flash_hash.getAnimations()) anim.cancel();
		flash_hash
			.animate([{opacity: 1}, {opacity: 0.1}], {duration: 200, easing: 'ease-out', fill: 'forwards'})
			.finished.catch(() => {})
			.finally(() => {
				flash_hash.animate([{opacity: 0.1}, {opacity: 1}], {duration: 400, easing: 'ease-in', fill: 'forwards'});
			});
	}

	private animateChainwork(element: ElementRef<HTMLElement>): void {
		if (!this.polling_block) return;
		const flash_chainwork = element.nativeElement;
		for (const anim of flash_chainwork.getAnimations()) anim.cancel();
		flash_chainwork
			.animate([{opacity: 1}, {opacity: 0.1}], {duration: 200, easing: 'ease-out', fill: 'forwards'})
			.finished.catch(() => {})
			.finally(() => {
				flash_chainwork.animate([{opacity: 0.1}, {opacity: 1}], {duration: 400, easing: 'ease-in', fill: 'forwards'});
			});
	}

	private animateHeaders(element: ElementRef<HTMLElement>): void {
		if (!this.polling_block) return;
		const flash_headers = element.nativeElement;
		for (const anim of flash_headers.getAnimations()) anim.cancel();
		flash_headers
			.animate([{opacity: 1}, {opacity: 0.1}], {duration: 200, easing: 'ease-out', fill: 'forwards'})
			.finished.catch(() => {})
			.finally(() => {
				flash_headers.animate([{opacity: 0.1}, {opacity: 1}], {duration: 400, easing: 'ease-in', fill: 'forwards'});
			});
	}
}
