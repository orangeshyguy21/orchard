export const SETTINGS_QUERY = `
    query Settings {
        settings {
            key
            value
            description
            value_type
        }
    }
`;

export const SETTING_UPDATE_MUTATION = `
    mutation SettingUpdate($key: SettingKey!, $value: String!) {
        setting_update(key: $key, value: $value) {
            key
            value
            description
            value_type
        }
    }
`;
