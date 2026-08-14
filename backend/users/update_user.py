from schemas.user_schemas import UpdateUserRequest
from supabase import Client
from datetime import datetime, timezone

#system adminが変更可能なuser情報
def update_user(
                client:Client,
                request: UpdateUserRequest
                ):
    print("update_user")

    response = (
        client
        .table("users")
        .update({
            "role": request.role,
            "is_active": request.is_active,
            "updated_at": datetime.now(timezone.utc).isoformat()
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