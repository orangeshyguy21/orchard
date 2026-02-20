/* Core Dependencies */
import {Injectable, Logger, CallHandler, ExecutionContext, NestInterceptor} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {GqlExecutionContext} from '@nestjs/graphql';
/* Vendor Dependencies */
import {Observable, tap, catchError} from 'rxjs';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {EventLogService} from '@server/modules/event/event.service';
import {EVENT_LOG_KEY, EventLogMetadata} from '@server/modules/event/event.decorator';
import {EventLogActorType, EventLogSection, EventLogEntityType, EventLogStatus, EventLogDetailStatus} from '@server/modules/event/event.enums';
import {CreateEventLogDetailInput} from '@server/modules/event/event.interfaces';
import {CashuMintApiService} from '@server/modules/cashu/mintapi/cashumintapi.service';
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';

@Injectable()
export class MintMintQuoteInterceptor implements NestInterceptor {
    private readonly logger = new Logger(MintMintQuoteInterceptor.name);

    constructor(
        private reflector: Reflector,
        private eventLogService: EventLogService,
        private cashuMintApiService: CashuMintApiService,
        private cashuMintDatabaseService: CashuMintDatabaseService,
        private mintService: MintService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const metadata = this.reflector.get<EventLogMetadata>(EVENT_LOG_KEY, context.getHandler());
        if (!metadata) return next.handle();

        const gql_context = GqlExecutionContext.create(context);
        const ctx = gql_context.getContext();
        const args = gql_context.getArgs();
        const user_id: string = ctx.req.user?.id ?? 'unknown';
        const {entity_type, entity_id, details} = await this.buildLogPayload(metadata, args);

        return next.handle().pipe(
            tap(() => {
                this.logEvent(metadata, user_id, entity_type, entity_id, details, EventLogStatus.SUCCESS);
            }),
            catchError((error) => {
                this.logger.error(`Error logging event [${metadata.field}]: ${error}`);
                const error_code = error?.extensions?.code ? String(error.extensions.code) : null;
                const error_message = error?.extensions?.details ?? error?.message ?? null;
                const error_details = details.map((detail) => ({
                    ...detail,
                    status: EventLogDetailStatus.ERROR,
                    error_code,
                    error_message,
                }));
                this.logEvent(metadata, user_id, entity_type, entity_id, error_details, EventLogStatus.ERROR);
                throw error;
            }),
        );
    }

    /**
     * Build entity info and event details based on the mutation type
     * @param {EventLogMetadata} metadata - The event log configuration
     * @param {Record<string, any>} args - The resolver arguments
     * @returns {Promise<{entity_type: EventLogEntityType; entity_id: string | null; details: CreateEventLogDetailInput[]}>} The log payload
     */
    private async buildLogPayload(
        metadata: EventLogMetadata,
        args: Record<string, any>,
    ): Promise<{entity_type: EventLogEntityType; entity_id: string | null; details: CreateEventLogDetailInput[]}> {
        if (metadata.field === 'nut04') {
            const old_method = await this.fetchOldNut04Method(args.unit, args.method);
            return {
                entity_type: EventLogEntityType.NUT04,
                entity_id: `${args.unit}:${args.method}`,
                details: this.buildNut04EventDetails(args, old_method),
            };
        }
        const old_state = await this.fetchOldQuoteState(args.quote_id);
        return {
            entity_type: EventLogEntityType.QUOTE,
            entity_id: args.quote_id ?? null,
            details: [{
                field: 'state',
                old_value: old_state,
                new_value: String(args.state),
                status: EventLogDetailStatus.SUCCESS,
            }],
        };
    }

    /**
     * Fetch current quote state for old value comparison
     * @param {string} quote_id - The quote ID to look up
     * @returns {Promise<string | null>} The current quote state
     */
    private async fetchOldQuoteState(quote_id: string): Promise<string | null> {
        try {
            return await this.mintService.withDbClient(async (client) => {
                const quote = await this.cashuMintDatabaseService.getMintMintQuote(client, quote_id);
                return quote?.state ?? null;
            });
        } catch (_error) {
            this.logger.warn('Failed to fetch old quote state for event history');
            return null;
        }
    }

    /**
     * Fetch current nut04 method config for old value comparison
     * @param {string} unit - The unit to match
     * @param {string} method - The method to match
     * @returns {Promise<Record<string, any> | null>} The current method config
     */
    private async fetchOldNut04Method(unit: string, method: string): Promise<Record<string, any> | null> {
        try {
            const mint_info = await this.cashuMintApiService.getMintInfo();
            const nut04 = mint_info?.nuts?.[4];
            if (!nut04) return null;
            const matched_method = Object.values(nut04.methods ?? []).find((m) => m.unit === unit && m.method === method);
            if (!matched_method) return null;
            return {...matched_method, disabled: nut04.disabled};
        } catch (_error) {
            this.logger.warn('Failed to fetch old nut04 method config for event history');
            return null;
        }
    }

    /**
     * Build event detail entries for each modified nut04 field
     * @param {Record<string, any>} args - The resolver arguments
     * @param {Record<string, any> | null} old_method - The previous method config
     * @returns {CreateEventLogDetailInput[]} The event details
     */
    private buildNut04EventDetails(args: Record<string, any>, old_method: Record<string, any> | null): CreateEventLogDetailInput[] {
        const details: CreateEventLogDetailInput[] = [];
        const fields = ['disabled', 'min_amount', 'max_amount', 'description'];
        for (const field of fields) {
            if (args[field] === undefined || args[field] === null) continue;
            details.push({
                field,
                old_value: old_method?.[field] != null ? String(old_method[field]) : null,
                new_value: String(args[field]),
                status: EventLogDetailStatus.SUCCESS,
            });
        }
        return details;
    }

    /**
     * Fire-and-forget an event log to the event history
     * @param {EventLogMetadata} metadata - The event log configuration
     * @param {string} user_id - The actor ID
     * @param {EventLogEntityType} entity_type - The entity type
     * @param {string | null} entity_id - The entity identifier
     * @param {CreateEventLogDetailInput[]} details - The event details
     * @param {EventLogStatus} status - Success or error
     */
    private logEvent(
        metadata: EventLogMetadata,
        user_id: string,
        entity_type: EventLogEntityType,
        entity_id: string | null,
        details: CreateEventLogDetailInput[],
        status: EventLogStatus,
    ): void {
        if (details.length === 0) return;
        this.eventLogService.createEvent({
            actor_type: EventLogActorType.USER,
            actor_id: user_id,
            timestamp: Math.floor(DateTime.now().toSeconds()),
            section: EventLogSection.MINT,
            section_id: '1',
            entity_type,
            entity_id,
            type: metadata.type,
            status,
            details,
        }).catch((err) => this.logger.warn(`Failed to log event [${metadata.field}]: ${err}`));
    }
}
