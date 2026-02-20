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
import {ChangeActorType, ChangeSection, ChangeAction, ChangeStatus, ChangeDetailStatus} from '@server/modules/change/change.enums';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';

@Injectable()
export class MintInfoInterceptor implements NestInterceptor {
    private readonly logger = new Logger(MintInfoInterceptor.name);

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
        const new_value: string | null = args[metadata.arg_key] ?? null;

        let old_value: string | null = null;
        if (metadata.old_value_key) {
            try {
                const mint_info = await this.cashuMintRpcService.getMintInfo();
                old_value = (mint_info as any)[metadata.old_value_key] ?? null;
            } catch (_error) {
                this.logger.warn(`Failed to fetch old value for change history [${metadata.field}]`);
            }
        }

        return next.handle().pipe(
            tap(() => {
                this.logChange(metadata, user_id, old_value, new_value, ChangeStatus.SUCCESS);
            }),
            catchError((error) => {
                const error_code = error?.extensions?.code ? String(error.extensions.code) : null;
                const error_message = error?.extensions?.details ?? error?.message ?? null;
                this.logChange(metadata, user_id, old_value, new_value, ChangeStatus.ERROR, {
                    error_code,
                    error_message,
                });
                throw error;
            }),
        );
    }

    /**
     * Fire-and-forget a change event to the change history
     * @param {ChangeLogMetadata} metadata - The change log configuration
     * @param {string} user_id - The actor ID
     * @param {string | null} old_value - The previous value
     * @param {string | null} new_value - The new value
     * @param {ChangeStatus} status - Success or error
     * @param {object} error - Optional error details
     */
    private logChange(
        metadata: ChangeLogMetadata,
        user_id: string,
        old_value: string | null,
        new_value: string | null,
        status: ChangeStatus,
        error?: {error_code: string | null; error_message: string | null},
    ): void {
        const detail_status = status === ChangeStatus.SUCCESS ? ChangeDetailStatus.SUCCESS : ChangeDetailStatus.ERROR;
        this.changeService.createChangeEvent({
            actor_type: ChangeActorType.USER,
            actor_id: user_id,
            timestamp: Math.floor(DateTime.now().toSeconds()),
            section: ChangeSection.MINT,
            section_id: null,
            entity_type: 'info',
            entity_id: null,
            action: ChangeAction.UPDATE,
            status,
            details: [{
                field: metadata.field,
                old_value,
                new_value,
                status: detail_status,
                error_code: error?.error_code ?? null,
                error_message: error?.error_message ?? null,
            }],
        }).catch((err) => this.logger.warn(`Failed to log change event [${metadata.field}]: ${err}`));
    }
}
