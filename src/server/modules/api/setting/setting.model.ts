/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {Setting} from '@server/modules/setting/setting.entity';
import {SettingValue, SettingKey} from '@server/modules/setting/setting.enums';

@ObjectType()
export class OrchardSetting {
	@Field(() => SettingKey)
	key: SettingKey;

	@Field()
	value: string;

	@Field({nullable: true})
	description: string | null;

	@Field(() => SettingValue)
	value_type: SettingValue;

	@Field()
	is_sensitive: boolean;

	constructor(setting: Setting, is_sensitive: boolean, masked_value?: string) {
		this.key = setting.key;
		this.value = masked_value ?? setting.value;
		this.description = setting.description;
		this.value_type = setting.value_type;
		this.is_sensitive = is_sensitive;
	}
}
