/* local Dependencies */
import {SettingValue} from './setting.enums';
import {Setting} from './setting.entity';

export const DEFAULT_SETTINGS: Setting[] = [
	{
		key: 'bitcoin.oracle',
		value: 'false',
		value_type: SettingValue.BOOLEAN,
		description: 'Whether the bitcoin oracle is enabled',
	},
];
