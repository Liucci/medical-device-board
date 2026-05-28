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

    print("insert response")

    for row in response.data:
        print(f"・{row}")

        return response.data[0]
