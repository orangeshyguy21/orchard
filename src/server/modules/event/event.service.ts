/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository} from 'typeorm';
/* Local Dependencies */
import {EventLog} from './event.entity';
import {EventLogDetail} from './event-detail.entity';
import {CreateEventLogInput, EventLogFilters} from './event.interfaces';

@Injectable()
export class EventLogService {
    private readonly logger = new Logger(EventLogService.name);

    constructor(
        @InjectRepository(EventLog)
        private eventRepository: Repository<EventLog>,
        @InjectRepository(EventLogDetail)
        private eventDetailRepository: Repository<EventLogDetail>,
    ) {}

    /**
     * Create a new event log with details
     * @param {CreateEventLogInput} input - The event log data with details
     * @returns {Promise<EventLog>} The created event log
     */
    public async createEvent(input: CreateEventLogInput): Promise<EventLog> {
        const details = input.details.map((detail) =>
            this.eventDetailRepository.create({
                field: detail.field,
                old_value: detail.old_value ?? null,
                new_value: detail.new_value ?? null,
                status: detail.status,
                error_code: detail.error_code ?? null,
                error_message: detail.error_message ?? null,
            }),
        );
        const event = this.eventRepository.create({
            actor_type: input.actor_type,
            actor_id: input.actor_id,
            timestamp: input.timestamp,
            section: input.section,
            section_id: input.section_id ?? null,
            entity_type: input.entity_type,
            entity_id: input.entity_id,
            type: input.type,
            status: input.status,
            details,
        });
        const saved_event = await this.eventRepository.save(event);
        this.logger.debug(`Created event log: ${saved_event.id} [${input.section}/${input.entity_type}/${input.type}]`);
        return saved_event;
    }

    /**
     * Get event logs with optional filters
     * @param {EventLogFilters} filters - Optional filters for querying events
     * @returns {Promise<EventLog[]>} The matching event logs
     */
    public async getEvents(filters: EventLogFilters = {}): Promise<EventLog[]> {
        const query = this.eventRepository.createQueryBuilder('event').leftJoinAndSelect('event.details', 'detail');
        if (filters.section) {
            query.andWhere('event.section = :section', {section: filters.section});
        }
        if (filters.actor_type) {
            query.andWhere('event.actor_type = :actor_type', {actor_type: filters.actor_type});
        }
        if (filters.actor_id) {
            query.andWhere('event.actor_id = :actor_id', {actor_id: filters.actor_id});
        }
        if (filters.entity_type) {
            query.andWhere('event.entity_type = :entity_type', {entity_type: filters.entity_type});
        }
        if (filters.type) {
            query.andWhere('event.type = :type', {type: filters.type});
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
     * Get total count of event logs matching filters (excludes pagination)
     * @param {EventLogFilters} filters - Optional filters for counting events
     * @returns {Promise<number>} The count of matching event logs
     */
    public async getEventCount(filters: EventLogFilters = {}): Promise<number> {
        const query = this.eventRepository.createQueryBuilder('event');
        if (filters.section) {
            query.andWhere('event.section = :section', {section: filters.section});
        }
        if (filters.actor_type) {
            query.andWhere('event.actor_type = :actor_type', {actor_type: filters.actor_type});
        }
        if (filters.actor_id) {
            query.andWhere('event.actor_id = :actor_id', {actor_id: filters.actor_id});
        }
        if (filters.entity_type) {
            query.andWhere('event.entity_type = :entity_type', {entity_type: filters.entity_type});
        }
        if (filters.type) {
            query.andWhere('event.type = :type', {type: filters.type});
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
        return query.getCount();
    }

    /**
     * Get a single event log with its details
     * @param {string} id - The event log ID
     * @returns {Promise<EventLog | null>} The event log with details, or null
     */
    public async getEventWithDetails(id: string): Promise<EventLog | null> {
        return this.eventRepository.findOne({
            where: {id},
            relations: ['details'],
        });
    }
}
