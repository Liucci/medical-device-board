from common.supabase_client import (
    supabase
)

from schemas.user_schemas import (
    AddUserRequest
)

def add_user(user: AddUserRequest):

    print("insert user")
    response = (
        supabase
        .table("users")
        .insert({

            "hospital_id":
                user.hospital_id,

            "email":
                user.email,

            "name":
                user.name,

            "role":
                user.role,
            "is_active":
                user.is_active,

        })
        .execute()
    )
    return response.data[0]
