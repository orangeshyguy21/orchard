import {OrchardSetting, SettingKey, SettingValue} from '@shared/generated.types';

export class Setting implements OrchardSetting {
	key: SettingKey;
	value: string;
	description: string | null;
	value_type: SettingValue;

	constructor(os: OrchardSetting) {
		this.key = os.key;
		this.value = os.value;
		this.description = os.description ?? null;
		this.value_type = os.value_type;
	}
}
