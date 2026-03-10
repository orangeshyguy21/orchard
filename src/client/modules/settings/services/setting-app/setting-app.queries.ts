export const SETTINGS_QUERY = `
    query Settings {
        settings {
            key
            value
            description
            value_type
            is_sensitive
        }
    }
`;

export const SETTINGS_UPDATE_MUTATION = `
    mutation SettingsUpdate($keys: [SettingKey!]!, $values: [String!]!) {
        settings_update(keys: $keys, values: $values) {
            key
            value
            description
            value_type
            is_sensitive
        }
    }
`;
