/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
/* Vendor Dependencies */
import {MatSort} from '@angular/material/sort';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {NonNullableMintDatabaseSettings} from '@client/modules/settings/types/setting.types';
import {LightningRequest} from '@client/modules/lightning/classes/lightning-request.class';
/* Native Dependencies */
import {MintSubsectionDatabaseData} from '@client/modules/mint/modules/mint-subsection-database/classes/mint-subsection-database-data.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';

@Component({
	selector: 'orc-mint-subsection-database-table',
	standalone: false,
	templateUrl: './mint-subsection-database-table.component.html',
	styleUrl: './mint-subsection-database-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseTableComponent implements OnChanges {
	@ViewChild(MatSort) sort!: MatSort;

	@Input() public data!: MintSubsectionDatabaseData;
	@Input() public page_settings!: NonNullableMintDatabaseSettings;
	@Input() public keysets!: MintKeyset[];
	@Input() public loading!: boolean;
	@Input() public loading_more!: boolean;
	@Input() public lightning_request!: LightningRequest | null;

	@Output() public updateRequest = new EventEmitter<string>();
	@Output() public setQuoteStatePaid = new EventEmitter<string>();

	public more_entity!: MintMintQuote | MintMeltQuote | null;

	public get displayed_columns(): string[] {
		if (this.data.type === 'MintMints' || this.data.type === 'MintMelts') return ['unit', 'amount', 'request', 'state', 'created_time'];
		if (this.data.type === 'MintProofGroups') return ['unit', 'amount', 'ecash', 'state', 'created_time'];
		if (this.data.type === 'MintPromiseGroups') return ['unit', 'amount', 'ecash', 'created_time'];
		return ['unit', 'amount', 'request', 'state', 'created_time'];
	}

	constructor(private configService: ConfigService) {}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && this.loading === false) {
			this.init();
		}
	}

	private init(): any {
		setTimeout(() => {
			this.data.source.sort = this.sort;
		});
	}

	public toggleMore(entity: MintMintQuote | MintMeltQuote) {
		this.more_entity = this.more_entity === entity ? null : entity;
		if (!this.configService.config.lightning.enabled) return;
		if (this.more_entity) this.updateRequest.emit(this.more_entity.request);
	}

	public onSetQuoteStatePaid(quote_id: string) {
		this.setQuoteStatePaid.emit(quote_id);
	}
}
