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
import {
	EventLogActorType,
	EventLogSection,
	EventLogEntityType,
	EventLogStatus,
	EventLogDetailStatus,
} from '@server/modules/event/event.enums';
import {SettingService} from '@server/modules/setting/setting.service';
import {SettingKey} from '@server/modules/setting/setting.enums';

@Injectable()
export class SettingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(SettingInterceptor.name);

	constructor(
		private reflector: Reflector,
		private eventLogService: EventLogService,
		private settingService: SettingService,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const metadata = this.reflector.get<EventLogMetadata>(EVENT_LOG_KEY, context.getHandler());
		if (!metadata) return next.handle();

		const gql_context = GqlExecutionContext.create(context);
		const ctx = gql_context.getContext();
		const args = gql_context.getArgs();
		const user_id: string = ctx.req.user?.id ?? 'unknown';
		const keys: SettingKey[] = args.keys ?? [];
		const values: string[] = args.values ?? [];
		const old_values = await this.fetchOldValues(keys);

		return next.handle().pipe(
			tap(() => {
				for (let i = 0; i < keys.length; i++) {
					this.logEvent(metadata, user_id, keys[i], old_values[i], values[i] ?? null, EventLogStatus.SUCCESS);
				}
			}),
			catchError((error) => {
				const error_code = error?.extensions?.code ? String(error.extensions.code) : null;
				const error_message = error?.extensions?.details ?? error?.message ?? null;
				for (let i = 0; i < keys.length; i++) {
					this.logEvent(metadata, user_id, keys[i], old_values[i], values[i] ?? null, EventLogStatus.ERROR, {
						error_code,
						error_message,
					});
				}
				throw error;
			}),
		);
	}

	/**
	 * Fetch old values from the settings database for UPDATE type events
	 * @param {SettingKey[]} keys - The setting keys to look up
	 * @returns {Promise<(string | null)[]>} The previous values
	 */
	private async fetchOldValues(keys: SettingKey[]): Promise<(string | null)[]> {
		return Promise.all(
			keys.map(async (key) => {
				try {
					const setting = await this.settingService.getSetting(key);
					return setting?.value ?? null;
				} catch (_error) {
					this.logger.warn(`Failed to fetch old value for setting [${key}]`);
					return null;
				}
			}),
		);
	}

	/**
	 * Fire-and-forget an event log to the event history
	 * @param {EventLogMetadata} metadata - The event log configuration
	 * @param {string} user_id - The actor ID
	 * @param {SettingKey} key - The setting key being updated
	 * @param {string | null} old_value - The previous value
	 * @param {string | null} new_value - The new value
	 * @param {EventLogStatus} status - Success or error
	 * @param {object} error - Optional error details
	 */
	private logEvent(
		metadata: EventLogMetadata,
		user_id: string,
		key: SettingKey,
		old_value: string | null,
		new_value: string | null,
		status: EventLogStatus,
		error?: {error_code: string | null; error_message: string | null},
	): void {
		const detail_status = status === EventLogStatus.SUCCESS ? EventLogDetailStatus.SUCCESS : EventLogDetailStatus.ERROR;
		this.eventLogService
			.createEvent({
				actor_type: EventLogActorType.USER,
				actor_id: user_id,
				timestamp: Math.floor(DateTime.now().toSeconds()),
				section: EventLogSection.SETTINGS,
				section_id: null,
				entity_type: EventLogEntityType.SETTING,
				entity_id: key,
				type: metadata.type,
				status,
				details: [
					{
						field: key,
						old_value,
						new_value,
						status: detail_status,
						error_code: error?.error_code ?? null,
						error_message: error?.error_message ?? null,
					},
				],
			})
			.catch((err) => this.logger.warn(`Failed to log event [${key}]: ${err}`));
	}
}
