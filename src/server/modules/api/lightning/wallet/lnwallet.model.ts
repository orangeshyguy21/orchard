/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {LightningAddressType} from '@server/modules/lightning/lightning.enums';
import {LightningAddresses} from '@server/modules/lightning/walletkit/lnwalletkit.types';
import {Base64} from '@server/modules/graphql/scalars/base64.scalar';

@ObjectType()
export class OrchardLightningAddress {
	@Field(() => String)
	address: string;

	@Field(() => String)
	is_internal: string;

	@Field(() => Number)
	balance: number;

	@Field(() => String)
	derivation_path: string;

	@Field(() => Base64)
	public_key: string;

	constructor(address: LightningAddresses['account_with_addresses'][number]['addresses'][number]) {
		this.address = address.address;
		this.is_internal = address.is_internal;
		this.balance = address.balance;
		this.derivation_path = address.derivation_path;
		this.public_key = address.public_key.toString('base64');
	}
}

@ObjectType()
export class OrchardLightningAccount {
	@Field(() => String)
	name: string;

	@Field(() => LightningAddressType)
	address_type: LightningAddressType;

	@Field(() => String)
	derivation_path: string;

	@Field(() => [OrchardLightningAddress])
	addresses: OrchardLightningAddress[];

	constructor(account: LightningAddresses['account_with_addresses'][number]) {
		this.name = account.name;
		this.address_type = account.address_type;
		this.derivation_path = account.derivation_path;
		this.addresses = account.addresses.map((address) => new OrchardLightningAddress(address));
	}
}
