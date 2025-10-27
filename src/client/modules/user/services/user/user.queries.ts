export const USER_QUERY = `{
    crew_user{
        id
        name
        role
        active
        created_at
        updated_at
    }
}`;

export const USERS_QUERY = `{
    crew_users {
        id
        name
        role
        active
        created_at
        updated_at
    }
}`;

export const USER_NAME_UPDATE_MUTATION = `
mutation crew_user_update_name($name: String!) {
    crew_user_update_name(updateUserName: {name: $name}) {
        id
        name
        role
        active
        created_at
        updated_at
    }
}`;

export const USER_PASSWORD_UPDATE_MUTATION = `
mutation crew_user_update_password($password_old: String!, $password_new: String!) {
    crew_user_update_password(updateUserPassword: {password_old: $password_old, password_new: $password_new}) {
        id
        name
        role
        active
        created_at
        updated_at
    }
}`;
