/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository} from 'typeorm';
/* Local Dependencies */
import {ChangeEvent} from './change-event.entity';
import {ChangeDetail} from './change-detail.entity';
import {CreateChangeEventInput, ChangeEventFilters} from './change.interfaces';

@Injectable()
export class ChangeService {
    private readonly logger = new Logger(ChangeService.name);

    constructor(
        @InjectRepository(ChangeEvent)
        private changeEventRepository: Repository<ChangeEvent>,
        @InjectRepository(ChangeDetail)
        private changeDetailRepository: Repository<ChangeDetail>,
    ) {}

    /**
     * Create a new change event with details
     * @param {CreateChangeEventInput} input - The change event data with details
     * @returns {Promise<ChangeEvent>} The created change event
     */
    public async createChangeEvent(input: CreateChangeEventInput): Promise<ChangeEvent> {
        const details = input.details.map((detail) =>
            this.changeDetailRepository.create({
                field: detail.field,
                old_value: detail.old_value ?? null,
                new_value: detail.new_value ?? null,
                status: detail.status,
                error_code: detail.error_code ?? null,
                error_message: detail.error_message ?? null,
            }),
        );
        const event = this.changeEventRepository.create({
            actor_type: input.actor_type,
            actor_id: input.actor_id,
            timestamp: input.timestamp,
            section: input.section,
            section_id: input.section_id ?? null,
            entity_type: input.entity_type,
            entity_id: input.entity_id,
            action: input.action,
            status: input.status,
            details,
        });
        const saved_event = await this.changeEventRepository.save(event);
        this.logger.debug(`Created change event: ${saved_event.id} [${input.section}/${input.entity_type}/${input.action}]`);
        return saved_event;
    }

    /**
     * Get change events with optional filters
     * @param {ChangeEventFilters} filters - Optional filters for querying events
     * @returns {Promise<ChangeEvent[]>} The matching change events
     */
    public async getChangeEvents(filters: ChangeEventFilters = {}): Promise<ChangeEvent[]> {
        const query = this.changeEventRepository.createQueryBuilder('event').leftJoinAndSelect('event.details', 'detail');
        if (filters.section) {
            query.andWhere('event.section = :section', {section: filters.section});
        }
        if (filters.actor_type) {
            query.andWhere('event.actor_type = :actor_type', {actor_type: filters.actor_type});
        }
        if (filters.entity_type) {
            query.andWhere('event.entity_type = :entity_type', {entity_type: filters.entity_type});
        }
        if (filters.action) {
            query.andWhere('event.action = :action', {action: filters.action});
        }
        if (filters.status) {
            query.andWhere('event.status = :status', {status: filters.status});
        }
        if (filters.date_start) {
            query.andWhere('event.timestamp >= :date_start', {date_start: filters.date_start});
        }
        if (filters.date_end) {
            query.andWhere('event.timestamp <= :date_end', {date_end: filters.date_end});
        }
        query.orderBy('event.timestamp', 'DESC');
        if (filters.page !== undefined && filters.page_size !== undefined) {
            query.skip(filters.page * filters.page_size).take(filters.page_size);
        }
        return query.getMany();
    }

    /**
     * Get a single change event with its details
     * @param {string} id - The change event ID
     * @returns {Promise<ChangeEvent | null>} The change event with details, or null
     */
    public async getChangeEventWithDetails(id: string): Promise<ChangeEvent | null> {
        return this.changeEventRepository.findOne({
            where: {id},
            relations: ['details'],
        });
    }
}
