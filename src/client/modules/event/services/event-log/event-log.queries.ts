export const EVENT_LOGS_DATA_QUERY = `
query EventLogsData(
    $sections: [EventLogSection!]
    $actor_types: [EventLogActorType!]
    $actor_ids: [String!]
    $types: [EventLogType!]
    $statuses: [EventLogStatus!]
    $entity_types: [EventLogEntityType!]
    $date_start: UnixTimestamp
    $date_end: UnixTimestamp
    $page: Int
    $page_size: Int
) {
    event_logs(
        sections: $sections
        actor_types: $actor_types
        actor_ids: $actor_ids
        types: $types
        statuses: $statuses
        entity_types: $entity_types
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
        sections: $sections
        actor_types: $actor_types
        actor_ids: $actor_ids
        types: $types
        statuses: $statuses
        entity_types: $entity_types
        date_start: $date_start
        date_end: $date_end
    ) {
        count
    }
}`;

export const EVENT_LOG_GENESIS_QUERY = `
query EventLogGenesis {
    event_log_genesis {
        timestamp
    }
}`;
