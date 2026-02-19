/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {getRepositoryToken} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository, SelectQueryBuilder} from 'typeorm';
/* Local Dependencies */
import {ChangeService} from './change.service';
import {ChangeEvent} from './change-event.entity';
import {ChangeDetail} from './change-detail.entity';
import {ChangeActorType, ChangeSection, ChangeAction, ChangeStatus, ChangeDetailStatus} from './change.enums';
import {CreateChangeEventInput} from './change.interfaces';

/**
 * Test suite for ChangeService
 * Tests all public methods for change event management
 */
describe('ChangeService', () => {
    let service: ChangeService;
    let _event_repository: Repository<ChangeEvent>;
    let _detail_repository: Repository<ChangeDetail>;

    const mock_detail: ChangeDetail = {
        id: 'detail-uuid-1',
        change_event: {} as ChangeEvent,
        field: 'name',
        old_value: 'old',
        new_value: 'new',
        status: ChangeDetailStatus.SUCCESS,
        error_code: null,
        error_message: null,
    };

    const mock_event: ChangeEvent = {
        id: 'event-uuid-1',
        actor_type: ChangeActorType.USER,
        actor_id: 'user-uuid-1',
        timestamp: 1700000000,
        section: ChangeSection.SETTINGS,
        section_id: null,
        entity_type: 'setting',
        entity_id: 'bitcoin.oracle',
        action: ChangeAction.UPDATE,
        status: ChangeStatus.SUCCESS,
        details: [mock_detail],
    };

    const mock_event_repository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const mock_detail_repository = {
        create: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChangeService,
                {
                    provide: getRepositoryToken(ChangeEvent),
                    useValue: mock_event_repository,
                },
                {
                    provide: getRepositoryToken(ChangeDetail),
                    useValue: mock_detail_repository,
                },
            ],
        }).compile();

        service = module.get<ChangeService>(ChangeService);
        _event_repository = module.get<Repository<ChangeEvent>>(getRepositoryToken(ChangeEvent));
        _detail_repository = module.get<Repository<ChangeDetail>>(getRepositoryToken(ChangeDetail));
    });

    /**
     * Test service instantiation
     */
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    /**
     * Test createChangeEvent method
     */
    describe('createChangeEvent', () => {
        it('should create a change event with details', async () => {
            // arrange
            const input: CreateChangeEventInput = {
                actor_type: ChangeActorType.USER,
                actor_id: 'user-uuid-1',
                timestamp: 1700000000,
                section: ChangeSection.SETTINGS,
                entity_type: 'setting',
                entity_id: 'bitcoin.oracle',
                action: ChangeAction.UPDATE,
                status: ChangeStatus.SUCCESS,
                details: [
                    {
                        field: 'name',
                        old_value: 'old',
                        new_value: 'new',
                        status: ChangeDetailStatus.SUCCESS,
                    },
                ],
            };
            mock_detail_repository.create.mockReturnValue(mock_detail);
            mock_event_repository.create.mockReturnValue(mock_event);
            mock_event_repository.save.mockResolvedValue(mock_event);

            // act
            const result = await service.createChangeEvent(input);

            // assert
            expect(result).toEqual(mock_event);
            expect(mock_detail_repository.create).toHaveBeenCalledTimes(1);
            expect(mock_event_repository.create).toHaveBeenCalledTimes(1);
            expect(mock_event_repository.save).toHaveBeenCalledTimes(1);
        });

        it('should handle nullable fields with defaults', async () => {
            // arrange
            const input: CreateChangeEventInput = {
                actor_type: ChangeActorType.SYSTEM,
                actor_id: 'system',
                timestamp: 1700000000,
                section: ChangeSection.MINT,
                entity_type: 'keyset',
                entity_id: 'keyset-1',
                action: ChangeAction.CREATE,
                status: ChangeStatus.SUCCESS,
                details: [
                    {
                        field: 'active',
                        new_value: 'true',
                        status: ChangeDetailStatus.SUCCESS,
                    },
                ],
            };
            mock_detail_repository.create.mockReturnValue(mock_detail);
            mock_event_repository.create.mockReturnValue(mock_event);
            mock_event_repository.save.mockResolvedValue(mock_event);

            // act
            await service.createChangeEvent(input);

            // assert
            expect(mock_detail_repository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    old_value: null,
                    new_value: 'true',
                }),
            );
            expect(mock_event_repository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    section_id: null,
                }),
            );
        });
    });

    /**
     * Test getChangeEvents method
     */
    describe('getChangeEvents', () => {
        let mock_query_builder: Partial<SelectQueryBuilder<ChangeEvent>>;

        beforeEach(() => {
            mock_query_builder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([mock_event]),
            };
            mock_event_repository.createQueryBuilder.mockReturnValue(mock_query_builder);
        });

        it('should return all events without filters', async () => {
            // act
            const result = await service.getChangeEvents();

            // assert
            expect(result).toEqual([mock_event]);
            expect(mock_query_builder.leftJoinAndSelect).toHaveBeenCalledWith('event.details', 'detail');
            expect(mock_query_builder.orderBy).toHaveBeenCalledWith('event.timestamp', 'DESC');
            expect(mock_query_builder.andWhere).not.toHaveBeenCalled();
        });

        it('should apply section filter', async () => {
            // act
            await service.getChangeEvents({section: ChangeSection.BITCOIN});

            // assert
            expect(mock_query_builder.andWhere).toHaveBeenCalledWith('event.section = :section', {section: ChangeSection.BITCOIN});
        });

        it('should apply pagination', async () => {
            // act
            await service.getChangeEvents({page: 1, page_size: 10});

            // assert
            expect(mock_query_builder.skip).toHaveBeenCalledWith(10);
            expect(mock_query_builder.take).toHaveBeenCalledWith(10);
        });

        it('should apply multiple filters', async () => {
            // act
            await service.getChangeEvents({
                section: ChangeSection.SETTINGS,
                actor_type: ChangeActorType.USER,
                action: ChangeAction.UPDATE,
            });

            // assert
            expect(mock_query_builder.andWhere).toHaveBeenCalledTimes(3);
        });
    });

    /**
     * Test getChangeEventWithDetails method
     */
    describe('getChangeEventWithDetails', () => {
        it('should return event with details', async () => {
            // arrange
            mock_event_repository.findOne.mockResolvedValue(mock_event);

            // act
            const result = await service.getChangeEventWithDetails('event-uuid-1');

            // assert
            expect(result).toEqual(mock_event);
            expect(mock_event_repository.findOne).toHaveBeenCalledWith({
                where: {id: 'event-uuid-1'},
                relations: ['details'],
            });
        });

        it('should return null when event not found', async () => {
            // arrange
            mock_event_repository.findOne.mockResolvedValue(null);

            // act
            const result = await service.getChangeEventWithDetails('nonexistent');

            // assert
            expect(result).toBeNull();
        });
    });
});
