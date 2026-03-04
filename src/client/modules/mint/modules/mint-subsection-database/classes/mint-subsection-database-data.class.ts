/* Vendor Dependencies */
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {DataType} from '@client/modules/orchard/enums/data.enum';
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
import {MintSwap} from '@client/modules/mint/classes/mint-swap.class';

export type MintSubsectionDatabaseData = MintMintData | MintMeltData | MintSwapData;
type MintMintData = {
	type: DataType.MintMints;
	source: MatTableDataSource<MintMintQuote>;
};
type MintMeltData = {
	type: DataType.MintMelts;
	source: MatTableDataSource<MintMeltQuote>;
};
type MintSwapData = {
	type: DataType.MintSwaps;
	source: MatTableDataSource<MintSwap>;
};
