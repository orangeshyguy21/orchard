/* Vendor Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {SchedulerRegistry} from '@nestjs/schedule';
/* Local Dependencies */
import {AgentService} from './agent.service';
import {Agent} from './agent.entity';
import {AgentRun} from './agent-run.entity';

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

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AgentService,
				{provide: getRepositoryToken(Agent), useValue: mock_agent_repo},
				{provide: getRepositoryToken(AgentRun), useValue: mock_run_repo},
				{provide: SchedulerRegistry, useValue: mock_scheduler_registry},
			],
		}).compile();
		service = module.get<AgentService>(AgentService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
