export const USER_QUERY = `{
    user{
        id
        name
        role
        active
        created_at
        updated_at
    }
}`;

export const USERS_QUERY = `{
    users {
        id
        name
        role
        active
        created_at
        updated_at
    }
}`;

export const USER_NAME_UPDATE_MUTATION = `
mutation updateUserName($name: String!) {
    updateUserName(updateUserName: {name: $name}) {
        id
        name
        role
        active
        created_at
        updated_at
    }
}`;

export const USER_PASSWORD_UPDATE_MUTATION = `
mutation updateUserPassword($password_old: String!, $password_new: String!) {
    updateUserPassword(updateUserPassword: {password_old: $password_old, password_new: $password_new}) {
        id
        name
        role
        active
        created_at
        updated_at
    }
}`;
