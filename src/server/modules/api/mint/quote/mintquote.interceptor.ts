/* Core Dependencies */
import {Injectable, Logger, CallHandler, ExecutionContext, NestInterceptor} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {GqlExecutionContext} from '@nestjs/graphql';
/* Vendor Dependencies */
import {Observable, tap, catchError} from 'rxjs';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {ChangeService} from '@server/modules/change/change.service';
import {CHANGE_LOG_KEY, ChangeLogMetadata} from '@server/modules/change/change.decorator';
import {ChangeActorType, ChangeSection, ChangeEntityType, ChangeStatus, ChangeDetailStatus} from '@server/modules/change/change.enums';
import {CreateChangeDetailInput} from '@server/modules/change/change.interfaces';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
/* Local Dependencies */
import {OrchardMintQuoteTtls} from './mintquote.model';
import {MintQuoteTtlUpdateInput} from './mintquote.input';

@Injectable()
export class MintQuoteInterceptor implements NestInterceptor {
    private readonly logger = new Logger(MintQuoteInterceptor.name);

    constructor(
        private reflector: Reflector,
        private changeService: ChangeService,
        private cashuMintRpcService: CashuMintRpcService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const metadata = this.reflector.get<ChangeLogMetadata>(CHANGE_LOG_KEY, context.getHandler());
        if (!metadata) return next.handle();

        const gql_context = GqlExecutionContext.create(context);
        const ctx = gql_context.getContext();
        const args = gql_context.getArgs();
        const user_id: string = ctx.req.user?.id ?? 'unknown';
        const input: MintQuoteTtlUpdateInput = args.mint_quote_ttl_update;
        const old_ttls = await this.fetchOldTtls();
        const details = this.buildChangeDetails(input, old_ttls);

        return next.handle().pipe(
            tap(() => {
                this.logChange(metadata, user_id, details, ChangeStatus.SUCCESS);
            }),
            catchError((error) => {
                const error_code = error?.extensions?.code ? String(error.extensions.code) : null;
                const error_message = error?.extensions?.details ?? error?.message ?? null;
                const error_details = details.map((detail) => ({
                    ...detail,
                    status: ChangeDetailStatus.ERROR,
                    error_code,
                    error_message,
                }));
                this.logChange(metadata, user_id, error_details, ChangeStatus.ERROR);
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
            this.logger.warn('Failed to fetch old TTL values for change history');
            return null;
        }
    }

    /**
     * Build change detail entries for each TTL field in the input
     * @param {MintQuoteTtlUpdateInput} input - The update input
     * @param {OrchardMintQuoteTtls | null} old_ttls - The previous TTL values
     * @returns {CreateChangeDetailInput[]} The change details
     */
    private buildChangeDetails(input: MintQuoteTtlUpdateInput, old_ttls: OrchardMintQuoteTtls | null): CreateChangeDetailInput[] {
        const details: CreateChangeDetailInput[] = [];
        const fields: (keyof MintQuoteTtlUpdateInput)[] = ['mint_ttl', 'melt_ttl'];
        for (const field of fields) {
            if (input[field] === undefined || input[field] === null) continue;
            details.push({
                field,
                old_value: old_ttls?.[field] != null ? String(old_ttls[field]) : null,
                new_value: String(input[field]),
                status: ChangeDetailStatus.SUCCESS,
            });
        }
        return details;
    }

    /**
     * Fire-and-forget a change event to the change history
     * @param {ChangeLogMetadata} metadata - The change log configuration
     * @param {string} user_id - The actor ID
     * @param {CreateChangeDetailInput[]} details - The change details
     * @param {ChangeStatus} status - Success or error
     */
    private logChange(
        metadata: ChangeLogMetadata,
        user_id: string,
        details: CreateChangeDetailInput[],
        status: ChangeStatus,
    ): void {
        if (details.length === 0) return;
        this.changeService.createChangeEvent({
            actor_type: ChangeActorType.USER,
            actor_id: user_id,
            timestamp: Math.floor(DateTime.now().toSeconds()),
            section: ChangeSection.MINT,
            section_id: '1',
            entity_type: ChangeEntityType.QUOTE_TTL,
            entity_id: null,
            action: metadata.action,
            status,
            details,
        }).catch((err) => this.logger.warn(`Failed to log change event [${metadata.field}]: ${err}`));
    }
}
