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
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
/* Local Dependencies */
import {OrchardMintQuoteTtls} from './mintquote.model';
import {MintQuoteTtlUpdateInput} from './mintquote.input';

@Injectable()
export class MintQuoteInterceptor implements NestInterceptor {
    private readonly logger = new Logger(MintQuoteInterceptor.name);

    constructor(
        private reflector: Reflector,
        private eventLogService: EventLogService,
        private cashuMintRpcService: CashuMintRpcService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const metadata = this.reflector.get<EventLogMetadata>(EVENT_LOG_KEY, context.getHandler());
        if (!metadata) return next.handle();

        const gql_context = GqlExecutionContext.create(context);
        const ctx = gql_context.getContext();
        const args = gql_context.getArgs();
        const user_id: string = ctx.req.user?.id ?? 'unknown';
        const input: MintQuoteTtlUpdateInput = args.mint_quote_ttl_update;
        const old_ttls = await this.fetchOldTtls();
        const details = this.buildEventDetails(input, old_ttls);

        return next.handle().pipe(
            tap(() => {
                this.logEvent(metadata, user_id, details, EventLogStatus.SUCCESS);
            }),
            catchError((error) => {
                const error_code = error?.extensions?.code ? String(error.extensions.code) : null;
                const error_message = error?.extensions?.details ?? error?.message ?? null;
                const error_details = details.map((detail) => ({
                    ...detail,
                    status: EventLogDetailStatus.ERROR,
                    error_code,
                    error_message,
                }));
                this.logEvent(metadata, user_id, error_details, EventLogStatus.ERROR);
                throw error;
            }),
        );
    }

    /**
     * Fetch current quote TTLs for old value comparison
     * @returns {Promise<OrchardMintQuoteTtls | null>} The current TTL values
     */
    private async fetchOldTtls(): Promise<OrchardMintQuoteTtls | null> {
        try {
            return await this.cashuMintRpcService.getQuoteTtl();
        } catch (_error) {
            this.logger.warn('Failed to fetch old TTL values for event history');
            return null;
        }
    }

    /**
     * Build event detail entries for each TTL field in the input
     * @param {MintQuoteTtlUpdateInput} input - The update input
     * @param {OrchardMintQuoteTtls | null} old_ttls - The previous TTL values
     * @returns {CreateEventLogDetailInput[]} The event details
     */
    private buildEventDetails(input: MintQuoteTtlUpdateInput, old_ttls: OrchardMintQuoteTtls | null): CreateEventLogDetailInput[] {
        const details: CreateEventLogDetailInput[] = [];
        const fields: (keyof MintQuoteTtlUpdateInput)[] = ['mint_ttl', 'melt_ttl'];
        for (const field of fields) {
            if (input[field] === undefined || input[field] === null) continue;
            details.push({
                field,
                old_value: old_ttls?.[field] != null ? String(old_ttls[field]) : null,
                new_value: String(input[field]),
                status: EventLogDetailStatus.SUCCESS,
            });
        }
        return details;
    }

    /**
     * Fire-and-forget an event log to the event history
     * @param {EventLogMetadata} metadata - The event log configuration
     * @param {string} user_id - The actor ID
     * @param {CreateEventLogDetailInput[]} details - The event details
     * @param {EventLogStatus} status - Success or error
     */
    private logEvent(
        metadata: EventLogMetadata,
        user_id: string,
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
            entity_type: EventLogEntityType.QUOTE_TTL,
            entity_id: null,
            type: metadata.type,
            status,
            details,
        }).catch((err) => this.logger.warn(`Failed to log event [${metadata.field}]: ${err}`));
    }
}
