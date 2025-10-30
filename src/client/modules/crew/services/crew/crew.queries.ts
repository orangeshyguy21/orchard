export const USER_QUERY = `{
    crew_user{
        id
        name
        role
        active
        label
        created_at
    }
}`;

export const USERS_QUERY = `{
    crew_users {
        id
        name
        role
        active
        label
        created_at
    }
}`;

export const USER_NAME_UPDATE_MUTATION = `
mutation crew_user_update_name($name: String!) {
    crew_user_update_name(updateUserName: {name: $name}) {
        id
        name
        role
        active
        label
        created_at
    }
}`;

export const USER_PASSWORD_UPDATE_MUTATION = `
mutation crew_user_update_password($password_old: String!, $password_new: String!) {
    crew_user_update_password(updateUserPassword: {password_old: $password_old, password_new: $password_new}) {
        id
        name
        role
        active
        label
        created_at
    }
}`;

export const USER_UPDATE_MUTATION = `
mutation crew_user_update($updateUser: UserUpdateInput!) {
    crew_user_update(updateUser: $updateUser) {
        id
        name
        role
        active
        label
        created_at
    }
}`;

export const INVITS_QUERY = `{
    crew_invites {
        id
        token
        label
        role
        created_by_id
        claimed_by_id
        used_at
        expires_at
        created_at
    }
}`;

export const INVITE_CREATE_MUTATION = `
mutation crew_invite_create($createInvite: InviteCreateInput!) {
    crew_invite_create(createInvite: $createInvite) {
        id
        token
        label
        role
        created_by_id
        claimed_by_id
        used_at
        expires_at
        created_at
    }
}`;

export const INVITE_UPDATE_MUTATION = `
mutation crew_invite_update($updateInvite: InviteUpdateInput!) {
    crew_invite_update(updateInvite: $updateInvite) {
        id
        token
        label
        role
        created_by_id
        claimed_by_id
        used_at
        expires_at
        created_at
    }
}`;
