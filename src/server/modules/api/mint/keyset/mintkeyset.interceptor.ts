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
import {ChangeActorType, ChangeSection, ChangeEntityType, ChangeAction, ChangeStatus, ChangeDetailStatus} from '@server/modules/change/change.enums';
import {CreateChangeDetailInput} from '@server/modules/change/change.interfaces';
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintKeyset} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {MintService} from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import {OrchardMintKeysetRotation} from './mintkeyset.model';

@Injectable()
export class MintKeysetInterceptor implements NestInterceptor {
    private readonly logger = new Logger(MintKeysetInterceptor.name);

    constructor(
        private reflector: Reflector,
        private changeService: ChangeService,
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

        return next.handle().pipe(
            tap((result: OrchardMintKeysetRotation) => {
                this.logRotation(metadata, user_id, args, result, ChangeStatus.SUCCESS);
            }),
            catchError((error) => {
                this.logger.error(`Error during keyset rotation [${metadata.field}]: ${error}`);
                const error_code = error?.extensions?.code ? String(error.extensions.code) : null;
                const error_message = error?.extensions?.details ?? error?.message ?? null;
                const error_details: CreateChangeDetailInput[] = [
                    {
                        field: 'unit',
                        new_value: String(args.unit),
                        status: ChangeDetailStatus.ERROR,
                        error_code,
                        error_message,
                    },
                ];
                this.logChange(metadata, user_id, ChangeAction.CREATE, null, error_details, ChangeStatus.ERROR);
                throw error;
            }),
        );
    }

    /**
     * Log both the old keyset deactivation and new keyset creation after a successful rotation
     * @param {ChangeLogMetadata} metadata - The change log configuration
     * @param {string} user_id - The actor ID
     * @param {Record<string, any>} args - The resolver arguments
     * @param {OrchardMintKeysetRotation} result - The mutation result containing the new keyset
     * @param {ChangeStatus} status - Success or error
     */
    private async logRotation(
        metadata: ChangeLogMetadata,
        user_id: string,
        args: Record<string, any>,
        result: OrchardMintKeysetRotation,
        status: ChangeStatus,
    ): Promise<void> {
        const keysets = await this.fetchKeysets();
        const old_keyset = this.findOldKeyset(keysets, result);

        if (old_keyset) {
            this.logChange(
                metadata,
                user_id,
                ChangeAction.UPDATE,
                old_keyset.id,
                [{field: 'active', old_value: 'true', new_value: 'false', status: ChangeDetailStatus.SUCCESS}],
                status,
            );
        }

        const create_details: CreateChangeDetailInput[] = [
            {field: 'unit', new_value: String(result.unit), status: ChangeDetailStatus.SUCCESS},
        ];
        if (result.amounts != null) {
            create_details.push({field: 'amounts', new_value: JSON.stringify(result.amounts), status: ChangeDetailStatus.SUCCESS});
        }
        if (result.input_fee_ppk != null) {
            create_details.push({field: 'input_fee_ppk', new_value: String(result.input_fee_ppk), status: ChangeDetailStatus.SUCCESS});
        }
        if (args.keyset_v2 != null) {
            create_details.push({field: 'keyset_v2', new_value: String(args.keyset_v2), status: ChangeDetailStatus.SUCCESS});
        }

        this.logChange(metadata, user_id, ChangeAction.CREATE, result.id, create_details, status);
    }

    /**
     * Fetch all keysets from the mint database
     * @returns {Promise<CashuMintKeyset[]>} The list of keysets
     */
    private async fetchKeysets(): Promise<CashuMintKeyset[]> {
        try {
            return await this.mintService.withDbClient(async (client) => {
                return this.cashuMintDatabaseService.getMintKeysets(client);
            });
        } catch (_error) {
            this.logger.warn('Failed to fetch keysets for change history');
            return [];
        }
    }

    /**
     * Find the old keyset that was deactivated during rotation.
     * The old keyset has derivation_path_index one below the new keyset's index, for the same unit.
     * @param {CashuMintKeyset[]} keysets - All keysets from the database
     * @param {OrchardMintKeysetRotation} result - The newly created keyset
     * @returns {CashuMintKeyset | null} The old keyset or null if not found
     */
    private findOldKeyset(keysets: CashuMintKeyset[], result: OrchardMintKeysetRotation): CashuMintKeyset | null {
        const new_keyset = keysets.find((k) => k.id === result.id);
        if (!new_keyset) return null;
        return keysets.find((k) => k.unit === new_keyset.unit && k.derivation_path_index === new_keyset.derivation_path_index - 1) ?? null;
    }

    /**
     * Fire-and-forget a change event to the change history
     * @param {ChangeLogMetadata} metadata - The change log configuration
     * @param {string} user_id - The actor ID
     * @param {ChangeAction} action - The action type (CREATE or UPDATE)
     * @param {string | null} entity_id - The entity identifier
     * @param {CreateChangeDetailInput[]} details - The change details
     * @param {ChangeStatus} status - Success or error
     */
    private logChange(
        metadata: ChangeLogMetadata,
        user_id: string,
        action: ChangeAction,
        entity_id: string | null,
        details: CreateChangeDetailInput[],
        status: ChangeStatus,
    ): void {
        if (details.length === 0) return;
        this.changeService
            .createChangeEvent({
                actor_type: ChangeActorType.USER,
                actor_id: user_id,
                timestamp: Math.floor(DateTime.now().toSeconds()),
                section: ChangeSection.MINT,
                section_id: '1',
                entity_type: ChangeEntityType.KEYSET,
                entity_id,
                action,
                status,
                details,
            })
            .catch((err) => this.logger.warn(`Failed to log change event [${metadata.field}]: ${err}`));
    }
}
