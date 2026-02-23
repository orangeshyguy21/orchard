export const EVENT_LOGS_DATA_QUERY = `
query EventLogsData(
    $section: EventLogSection
    $actor_type: EventLogActorType
    $actor_id: String
    $type: EventLogType
    $status: EventLogStatus
    $entity_type: EventLogEntityType
    $date_start: UnixTimestamp
    $date_end: UnixTimestamp
    $page: Int
    $page_size: Int
) {
    event_logs(
        section: $section
        actor_type: $actor_type
        actor_id: $actor_id
        type: $type
        status: $status
        entity_type: $entity_type
        date_start: $date_start
        date_end: $date_end
        page: $page
        page_size: $page_size
    ) {
        id
        actor_type
        actor_id
        timestamp
        section
        section_id
        entity_type
        entity_id
        type
        status
        details {
            id
            field
            old_value
            new_value
            status
            error_code
            error_message
        }
    }
    event_log_count(
        section: $section
        actor_type: $actor_type
        actor_id: $actor_id
        type: $type
        status: $status
        entity_type: $entity_type
        date_start: $date_start
        date_end: $date_end
    ) {
        count
    }
}`;
