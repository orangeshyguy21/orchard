/* Vendor Dependencies */
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {DataType} from '@client/modules/orchard/enums/data.enum';
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
import {MintProofGroup} from '@client/modules/mint/classes/mint-proof-group.class';
import {MintPromiseGroup} from '@client/modules/mint/classes/mint-promise-group.class';

export type MintSubsectionDatabaseData = MintMintData | MintMeltData | MintProofData | MintPromiseData;
type MintMintData = {
	type: DataType.MintMints;
	source: MatTableDataSource<MintMintQuote>;
};
type MintMeltData = {
	type: DataType.MintMelts;
	source: MatTableDataSource<MintMeltQuote>;
};
type MintProofData = {
	type: DataType.MintProofGroups;
	source: MatTableDataSource<MintProofGroup>;
};
type MintPromiseData = {
	type: DataType.MintPromiseGroups;
	source: MatTableDataSource<MintPromiseGroup>;
};
