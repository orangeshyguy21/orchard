import {OrchardMintDatabaseInfo} from '@shared/generated.types';

export class MintDatabaseInfo {
    public size: number;
    public type: string;

    constructor(info: OrchardMintDatabaseInfo) {
        this.size = info.size;
        this.type = info.type;
    }
}
