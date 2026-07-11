from schemas.user_schemas import UpdateUserRequest
from common.supabase_client import supabase


def update_user(request: UpdateUserRequest):
    print("update_user")

    response = (
        supabase
        .table("users")
        .update({
            "role": request.role,
            "is_active": request.is_active
        })
        .eq("id", request.id)
        .execute()
    )


    print("request.id =", request.id)
    print("response.data =", response.data)
    print("response =", response)

    if not response.data:
        raise Exception("Update failed")
    
    return response.data[0]