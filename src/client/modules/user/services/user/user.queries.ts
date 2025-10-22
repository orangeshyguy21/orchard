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
