/* Core Dependencies */
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
/* Application Dependencies */
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import {BitcoinBlock} from '@client/modules/bitcoin/classes/bitcoin-block.class';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinEnabledSyncingComponent} from './index-subsection-dashboard-bitcoin-enabled-syncing.component';

function makeInfo(overrides: Partial<BitcoinBlockchainInfo> = {}): BitcoinBlockchainInfo {
	return new BitcoinBlockchainInfo({
		chain: 'main',
		blocks: 911863,
		headers: 946819,
		bestblockhash: '00000000000000000002155fa7100000000000000000000000000000009024cc85c5',
		difficulty: 1,
		verificationprogress: 0.9146,
		initialblockdownload: true,
		chainwork: '0000000000000000000000000000000000000000000095790731a05cf7d8e8a8',
		size_on_disk: 0,
		pruned: false,
		pruneheight: null,
		automatic_pruning: null,
		prune_target_size: null,
		warnings: [],
		...overrides,
	});
}

function makeBlock(overrides: Partial<BitcoinBlock> = {}): BitcoinBlock {
	return new BitcoinBlock({
		chainwork: '0000000000000000000000000000000000000000000095790731a05cf7d8e8a8',
		hash: '00000000000000000002155fa7100000000000000000000000000000009024cc85c5',
		height: 911863,
		nTx: 1,
		size: 1000,
		time: 1756248222,
		weight: 4000,
		feerate_low: 1,
		feerate_high: 2,
		...overrides,
	});
}

describe('IndexSubsectionDashboardBitcoinEnabledSyncingComponent', () => {
	let component: IndexSubsectionDashboardBitcoinEnabledSyncingComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinEnabledSyncingComponent>;
	let animate_spy: jasmine.Spy;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		// Stub the Web Animations API on every element so we can both inspect
		// invocation and chain through the `.finished.catch().finally(...)`
		// path the component uses.
		animate_spy = spyOn(HTMLElement.prototype, 'animate').and.callFake(
			() =>
				({
					cancel: () => {},
					finished: Promise.resolve(),
				}) as unknown as Animation,
		);
		spyOn(HTMLElement.prototype, 'getAnimations').and.returnValue([]);

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledSyncingComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('sync_progress', () => {
		it('returns 0 when blockchain_info is null', () => {
			fixture.detectChanges();
			expect(component.sync_progress()).toBe(0);
		});

		it('returns verificationprogress * 100 when blockchain_info is populated', () => {
			fixture.componentRef.setInput('blockchain_info', makeInfo({verificationprogress: 0.9146}));
			fixture.detectChanges();
			expect(component.sync_progress()).toBeCloseTo(91.46, 4);
		});
	});

	describe('constructor effect', () => {
		it('early-returns when both block and blockchain_info are null', () => {
			fixture.detectChanges();
			// effect ran with both inputs null — no animations were scheduled
			expect(animate_spy).not.toHaveBeenCalled();
		});

		it('does not animate on the very first paint (polling_block still false)', () => {
			fixture.componentRef.setInput('blockchain_info', makeInfo());
			fixture.componentRef.setInput('block', makeBlock());
			fixture.detectChanges();
			expect(animate_spy).not.toHaveBeenCalled();
		});

		it('animates each changed field after polling_block flips on', fakeAsync(() => {
			fixture.componentRef.setInput('blockchain_info', makeInfo());
			fixture.componentRef.setInput('block', makeBlock());
			fixture.detectChanges();
			animate_spy.calls.reset();

			// Wait past the 1s pollingBlock timeout — polling_block becomes true.
			tick(1100);
			expect(component.polling_block).toBeTrue();

			// Now mutate every field and confirm each fires its animator.
			fixture.componentRef.setInput('blockchain_info', makeInfo({headers: 946820, verificationprogress: 0.92}));
			fixture.componentRef.setInput(
				'block',
				makeBlock({
					height: 911864,
					time: 1756248223,
					hash: '00000000000000000002155fa7100000000000000000000000000000009024cc85c6',
					chainwork: '0000000000000000000000000000000000000000000095790731a05cf7d8e8a9',
				}),
			);
			fixture.detectChanges();
			tick();

			// height, time, hash, chainwork, headers — five fields each kicking off
			// at least one animate() call (height fires twice for both #flash_height_*).
			expect(animate_spy.calls.count()).toBeGreaterThanOrEqual(5);
		}));
	});

	describe('pollingBlock', () => {
		it('flips polling_block to true 1s after init when not synced', fakeAsync(() => {
			fixture.componentRef.setInput('blockchain_info', makeInfo({initialblockdownload: true}));
			fixture.detectChanges();
			expect(component.polling_block).toBeFalse();
			tick(1000);
			expect(component.polling_block).toBeTrue();
		}));

		it('returns early when blockchain_info reports is_synced', fakeAsync(() => {
			// is_synced getter is true when !initialblockdownload && headers === blocks.
			fixture.componentRef.setInput('blockchain_info', makeInfo({initialblockdownload: false, blocks: 100, headers: 100}));
			fixture.detectChanges();
			tick(2000);
			expect(component.polling_block).toBeFalse();
		}));
	});
});
