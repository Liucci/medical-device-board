from supabase import Client


from schemas.user_schemas import (
    AddUserRequest
)

def add_user(
            client:Client,
            user: AddUserRequest
            ):

    print("insert user")
    response = (
        client
        .table("users")
        .insert({
            "id":user.id,
            "hospital_id":user.hospital_id,
            "email":user.email,
            "display_name":user.display_name,
            "role":user.role,
            "is_active":user.is_active
        })
        .execute()
    )
    return response.data[0]
