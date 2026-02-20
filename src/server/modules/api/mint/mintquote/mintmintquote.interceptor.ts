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
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';

@Injectable()
export class MintMintQuoteInterceptor implements NestInterceptor {
    private readonly logger = new Logger(MintMintQuoteInterceptor.name);

    constructor(
        private reflector: Reflector,
        private changeService: ChangeService,
        private cashuMintRpcService: CashuMintRpcService,
        private cashuMintDatabaseService: CashuMintDatabaseService,
        private mintService: MintService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const metadata = this.reflector.get<ChangeLogMetadata>(CHANGE_LOG_KEY, context.getHandler());
        if (!metadata) return next.handle();

        const gql_context = GqlExecutionContext.create(context);
        const ctx = gql_context.getContext();
        const args = gql_context.getArgs();
        const user_id: string = ctx.req.user?.id ?? 'unknown';
        const {entity_type, entity_id, details} = await this.buildLogPayload(metadata, args);

        return next.handle().pipe(
            tap(() => {
                this.logChange(metadata, user_id, entity_type, entity_id, details, ChangeStatus.SUCCESS);
            }),
            catchError((error) => {
                this.logger.error(`Error logging change event [${metadata.field}]: ${error}`);
                const error_code = error?.extensions?.code ? String(error.extensions.code) : null;
                const error_message = error?.extensions?.details ?? error?.message ?? null;
                const error_details = details.map((detail) => ({
                    ...detail,
                    status: ChangeDetailStatus.ERROR,
                    error_code,
                    error_message,
                }));
                this.logChange(metadata, user_id, entity_type, entity_id, error_details, ChangeStatus.ERROR);
                throw error;
            }),
        );
    }

    /**
     * Build entity info and change details based on the mutation type
     * @param {ChangeLogMetadata} metadata - The change log configuration
     * @param {Record<string, any>} args - The resolver arguments
     * @returns {Promise<{entity_type: ChangeEntityType; entity_id: string | null; details: CreateChangeDetailInput[]}>} The log payload
     */
    private async buildLogPayload(
        metadata: ChangeLogMetadata,
        args: Record<string, any>,
    ): Promise<{entity_type: ChangeEntityType; entity_id: string | null; details: CreateChangeDetailInput[]}> {
        if (metadata.field === 'nut04') {
            const old_method = await this.fetchOldNut04Method(args.unit, args.method);
            return {
                entity_type: ChangeEntityType.NUT04,
                entity_id: `${args.unit}:${args.method}`,
                details: this.buildNut04ChangeDetails(args, old_method),
            };
        }
        const old_state = await this.fetchOldQuoteState(args.quote_id);
        return {
            entity_type: ChangeEntityType.QUOTE,
            entity_id: args.quote_id ?? null,
            details: [{
                field: 'state',
                old_value: old_state,
                new_value: String(args.state),
                status: ChangeDetailStatus.SUCCESS,
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
            this.logger.warn('Failed to fetch old quote state for change history');
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
            const mint_info = await this.cashuMintRpcService.getMintInfo();
            const methods = (mint_info as any)?.nuts?.nut4?.methods ?? [];
            return methods.find((m: any) => m.unit === unit && m.method === method) ?? null;
        } catch (_error) {
            this.logger.warn('Failed to fetch old nut04 method config for change history');
            return null;
        }
    }

    /**
     * Build change detail entries for each modified nut04 field
     * @param {Record<string, any>} args - The resolver arguments
     * @param {Record<string, any> | null} old_method - The previous method config
     * @returns {CreateChangeDetailInput[]} The change details
     */
    private buildNut04ChangeDetails(args: Record<string, any>, old_method: Record<string, any> | null): CreateChangeDetailInput[] {
        const details: CreateChangeDetailInput[] = [];
        const fields = ['disabled', 'min_amount', 'max_amount', 'description'];
        for (const field of fields) {
            if (args[field] === undefined || args[field] === null) continue;
            details.push({
                field,
                old_value: old_method?.[field] != null ? String(old_method[field]) : null,
                new_value: String(args[field]),
                status: ChangeDetailStatus.SUCCESS,
            });
        }
        return details;
    }

    /**
     * Fire-and-forget a change event to the change history
     * @param {ChangeLogMetadata} metadata - The change log configuration
     * @param {string} user_id - The actor ID
     * @param {ChangeEntityType} entity_type - The entity type
     * @param {string | null} entity_id - The entity identifier
     * @param {CreateChangeDetailInput[]} details - The change details
     * @param {ChangeStatus} status - Success or error
     */
    private logChange(
        metadata: ChangeLogMetadata,
        user_id: string,
        entity_type: ChangeEntityType,
        entity_id: string | null,
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
            entity_type,
            entity_id,
            action: metadata.action,
            status,
            details,
        }).catch((err) => this.logger.warn(`Failed to log change event [${metadata.field}]: ${err}`));
    }
}
