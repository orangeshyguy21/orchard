export const USER_QUERY = `{
    user(id: $id){
        id
        name
        role
        active
        created_at
        updated_at
    }
}`;
