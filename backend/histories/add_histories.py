from common.supabase_client import (
    supabase
)

from schemas.history_schemas import (
    AddHistoryRequest
)

def add_history(
                history: AddHistoryRequest
                ):

    print("insert history")

    for key, value in history.dict().items():
        print(f"・{key}: {value}")

    response = (
        supabase
        .table("device_histories")
        .insert({
            "hospital_id":
                history.hospital_id,

            "device_id":
                history.device_id,

            "user_id":
                history.user_id,

            "action":
                history.action,

            "note":
                history.note
        })
        .execute()
    )

    print("insert response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "history": response.data[0]
            }