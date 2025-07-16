/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { TaprootAssetId } from '@server/modules/tapass/tapass.enums';
/* Local Dependencies */
import { OrchardTaprootAssetsId } from './tapid.model';

@Injectable()
export class TaprootAssetsIdService {

    private readonly logger = new Logger(TaprootAssetsIdService.name);

	constructor() {}

    async getTaprootAssetsIds(tag: string) : Promise<OrchardTaprootAssetsId[]> {
        return [
            new OrchardTaprootAssetsId(TaprootAssetId.USDT),
        ];
    }
}
