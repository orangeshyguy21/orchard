/* local Dependencies */
import {Setting} from './setting.entity';
import {SettingKey, SettingValue} from './setting.enums';

export const DEFAULT_SETTINGS: Setting[] = [
	{
		key: SettingKey.BITCOIN_ORACLE,
		value: 'false',
		value_type: SettingValue.BOOLEAN,
		description: 'Whether the bitcoin oracle is enabled',
	},
];
