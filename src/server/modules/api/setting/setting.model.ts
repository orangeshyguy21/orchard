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

	constructor(setting: Setting) {
		this.key = setting.key;
		this.value = setting.value;
		this.description = setting.description;
		this.value_type = setting.value_type;
	}
}
