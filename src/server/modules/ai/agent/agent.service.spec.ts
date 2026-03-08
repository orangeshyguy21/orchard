/* Vendor Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {SchedulerRegistry} from '@nestjs/schedule';
/* Application Dependencies */
import {AiService} from '@server/modules/ai/ai.service';
import {SettingService} from '@server/modules/setting/setting.service';
/* Local Dependencies */
import {AgentService} from './agent.service';
import {Agent} from './agent.entity';
import {AgentRun} from './agent-run.entity';
import {ToolService} from '@server/modules/ai/tools/tool.service';

describe('AgentService', () => {
	let service: AgentService;

	const mock_agent_repo = {
		find: jest.fn().mockResolvedValue([]),
		findOne: jest.fn().mockResolvedValue(null),
		create: jest.fn().mockImplementation((dto) => dto),
		save: jest.fn().mockImplementation((entity) => Promise.resolve({id: 'test-uuid', ...entity})),
		update: jest.fn().mockResolvedValue(undefined),
	};

	const mock_run_repo = {
		find: jest.fn().mockResolvedValue([]),
		create: jest.fn().mockImplementation((dto) => dto),
		save: jest.fn().mockImplementation((entity) => Promise.resolve({id: 'run-uuid', ...entity})),
		update: jest.fn().mockResolvedValue(undefined),
		createQueryBuilder: jest.fn().mockReturnValue({
			delete: jest.fn().mockReturnThis(),
			where: jest.fn().mockReturnThis(),
			execute: jest.fn().mockResolvedValue(undefined),
		}),
	};

	const mock_scheduler_registry = {
		doesExist: jest.fn().mockReturnValue(false),
		addCronJob: jest.fn(),
		deleteCronJob: jest.fn(),
		getCronJobs: jest.fn().mockReturnValue(new Map()),
	};

	const mock_ai_service = {
		streamRaw: jest.fn(),
	};

	const mock_setting_service = {
		getSetting: jest.fn().mockResolvedValue({value: 'test-model'}),
	};

	const mock_tool_executor = {
		getToolSchemas: jest.fn().mockReturnValue([]),
		executeTool: jest.fn().mockResolvedValue({success: true, data: {}}),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AgentService,
				{provide: getRepositoryToken(Agent), useValue: mock_agent_repo},
				{provide: getRepositoryToken(AgentRun), useValue: mock_run_repo},
				{provide: SchedulerRegistry, useValue: mock_scheduler_registry},
				{provide: AiService, useValue: mock_ai_service},
				{provide: SettingService, useValue: mock_setting_service},
				{provide: ToolService, useValue: mock_tool_executor},
			],
		}).compile();
		service = module.get<AgentService>(AgentService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
