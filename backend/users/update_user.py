from schemas.user_schemas import UpdateUserRequest
from common.supabase_admin_client import (supabase,CLIENT_NAME)

#system adminが変更可能なuser情報
def update_user(request: UpdateUserRequest):
    print("update_user")
    #print(f"{CLIENT_NAME}")

    response = (
        supabase
        .table("users")
        .update({
            "role": request.role,
            "is_active": request.is_active
        })
        .eq("id", request.id)
        .select()
        .execute()
    )

    # print("request =", request.model_dump())
    # print("request.id =", request.id)
    # print("response.data =", response.data)
    # print("response =", response)

    if not response.data:
        raise Exception("Update failed")
    
    return response.data[0]