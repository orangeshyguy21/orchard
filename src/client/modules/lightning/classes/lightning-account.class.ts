import { OrchardLightningAccount, OrchardLightningAddress, LightningAddressType } from "@shared/generated.types";

export class LightningAccount implements OrchardLightningAccount {

    public name: string;
    public address_type: LightningAddressType;
    public derivation_path: string;
    public addresses: OrchardLightningAddress[];

    constructor(olc: OrchardLightningAccount) {
        this.name = olc.name;
        this.address_type = olc.address_type;
        this.derivation_path = olc.derivation_path;
        this.addresses = olc.addresses;
    }
}