from common.supabase_admin_client import supabase
from supabase import Client
from schemas.inspection_schemas.inspection_result_schemas import (
    UpdateInspectionResultRequest
)


def update_inspection_result(
    client: Client,
    inspection_result: UpdateInspectionResultRequest
):
    print("update_inspection_result")

    response = (
        client
        .table("inspection_results")
        .update({
            "value": inspection_result.value
        })
        .eq("id", inspection_result.id)
        .execute()
    )

    return response.data[0]