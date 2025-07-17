/* Core Dependencies */
import { Field, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { TaprootAssetId } from '@server/modules/tapass/tapass.enums';

@ObjectType()
export class OrchardTaprootAssetsId {

    @Field(type => TaprootAssetId)
    asset_id: TaprootAssetId;

    constructor(asset_id: TaprootAssetId) {
        this.asset_id = asset_id;
    }
}
