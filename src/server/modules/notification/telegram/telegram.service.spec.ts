/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {SettingService} from '@server/modules/setting/setting.service';
import {UserService} from '@server/modules/user/user.service';
import {SettingKey} from '@server/modules/setting/setting.enums';
/* Local Dependencies */
import {TelegramService} from './telegram.service';

describe('TelegramService', () => {
	let service: TelegramService;
	let settingService: jest.Mocked<SettingService>;
	let userService: jest.Mocked<UserService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TelegramService,
				{
					provide: SettingService,
					useValue: {
						getSetting: jest.fn(),
					},
				},
				{
					provide: UserService,
					useValue: {
						getUsersWithTelegramChatId: jest.fn(),
						getUserByTelegramChatId: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<TelegramService>(TelegramService);
		settingService = module.get(SettingService) as jest.Mocked<SettingService>;
		userService = module.get(UserService) as jest.Mocked<UserService>;
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('isRunning', () => {
		it('should return false when bot is not initialized', () => {
			expect(service.isRunning()).toBe(false);
		});
	});

	describe('sendMessage', () => {
		it('should return false when bot is not running', async () => {
			const result = await service.sendMessage('123', 'test');
			expect(result).toBe(false);
		});
	});

	describe('broadcastNotification', () => {
		it('should return 0 when bot is not running', async () => {
			const result = await service.broadcastNotification('Test', 'Body', 'info');
			expect(result).toBe(0);
		});

		it('should return 0 when no users have telegram_chat_id', async () => {
			userService.getUsersWithTelegramChatId.mockResolvedValue([]);
			const result = await service.broadcastNotification('Test', 'Body', 'info');
			expect(result).toBe(0);
		});
	});

	describe('initializeBot', () => {
		it('should not start bot when notifications are disabled', async () => {
			settingService.getSetting.mockResolvedValue({
				key: SettingKey.NOTIFICATIONS_ENABLED,
				value: 'false',
				value_type: 'boolean' as any,
				description: '',
			});
			await service.initializeBot();
			expect(service.isRunning()).toBe(false);
		});

		it('should not start bot when vendor is not telegram', async () => {
			settingService.getSetting.mockImplementation(async (key: SettingKey) => {
				if (key === SettingKey.NOTIFICATIONS_ENABLED) {
					return {key, value: 'true', value_type: 'boolean' as any, description: ''};
				}
				if (key === SettingKey.NOTIFICATIONS_VENDOR) {
					return {key, value: 'pushover', value_type: 'string' as any, description: ''};
				}
				return null;
			});
			await service.initializeBot();
			expect(service.isRunning()).toBe(false);
		});

		it('should not start bot when token is empty', async () => {
			settingService.getSetting.mockImplementation(async (key: SettingKey) => {
				if (key === SettingKey.NOTIFICATIONS_ENABLED) {
					return {key, value: 'true', value_type: 'boolean' as any, description: ''};
				}
				if (key === SettingKey.NOTIFICATIONS_VENDOR) {
					return {key, value: 'telegram', value_type: 'string' as any, description: ''};
				}
				if (key === SettingKey.NOTIFICATIONS_TELEGRAM_BOT_TOKEN) {
					return {key, value: '', value_type: 'string' as any, description: ''};
				}
				return null;
			});
			await service.initializeBot();
			expect(service.isRunning()).toBe(false);
		});
	});
});
