/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
import { MintService } from "@server/modules/api/mint/mint.service";
import { ErrorModule } from "@server/modules/error/error.module";
/* Local Dependencies */
import { MintTransactionService } from "./minttransaction.service";
import { MintTransactionResolver } from "./minttransaction.resolver";
 
@Module({
    imports: [
        CashuMintDatabaseModule,
        ErrorModule,
    ],
    providers: [
        MintTransactionResolver,
        MintTransactionService,
        MintService,
    ]
})
export class MintTransactionModule {}
