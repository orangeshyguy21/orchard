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
	{
		key: SettingKey.AI_ENABLED,
		value: 'false',
		value_type: SettingValue.BOOLEAN,
		description: 'Whether AI features are enabled',
	},
	{
		key: SettingKey.AI_VENDOR,
		value: 'ollama',
		value_type: SettingValue.STRING,
		description: 'The AI vendor used for AI features',
	},
	{
		key: SettingKey.AI_OLLAMA_API,
		value: 'http://localhost:11434',
		value_type: SettingValue.STRING,
		description: 'The Ollama API key',
	},
	{
		key: SettingKey.AI_OPENROUTER_KEY,
		value: '',
		value_type: SettingValue.STRING,
		description: 'The OpenRouter API key',
	},
	{
		key: SettingKey.AI_SERVER_MODEL,
		value: '',
		value_type: SettingValue.STRING,
		description: 'The server model to use',
	},
	{
		key: SettingKey.NOTIFICATIONS_ENABLED,
		value: 'false',
		value_type: SettingValue.BOOLEAN,
		description: 'Whether notifications are enabled',
	},
	{
		key: SettingKey.NOTIFICATIONS_VENDOR,
		value: 'telegram',
		value_type: SettingValue.STRING,
		description: 'The notification vendor to use',
	},
	{
		key: SettingKey.NOTIFICATIONS_TELEGRAM_BOT_TOKEN,
		value: '',
		value_type: SettingValue.STRING,
		description: 'The Telegram bot token from @BotFather',
	},
	{
		key: SettingKey.SYSTEM_METRICS,
		value: 'true',
		value_type: SettingValue.BOOLEAN,
		description: 'Whether system metrics collection is enabled',
	},
];
