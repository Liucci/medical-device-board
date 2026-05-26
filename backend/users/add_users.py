from common.supabase_client import (
    supabase
)

from schemas.user_schemas import (
    AddUserRequest
)

def add_user(
             user: AddUserRequest
             ):

    print("insert user")

    for key, value in user.dict().items():
        print(f"・{key}: {value}")

    response = (
        supabase
        .table("users")
        .insert({
            "id":
                user.id,

            "hospital_id":
                user.hospital_id,

            "email":
                user.email,

            "name":
                user.name,

            "role":
                user.role,

            "created_by":
                user.created_by,

            "updated_by":
                user.updated_by
        })
        .execute()
    )

    print("insert response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "user": response.data[0]
            }