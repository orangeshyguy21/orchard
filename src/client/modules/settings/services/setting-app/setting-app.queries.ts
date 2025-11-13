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
