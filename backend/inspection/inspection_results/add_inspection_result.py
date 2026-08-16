from common.supabase_admin_client import supabase
from supabase import Client
from schemas.inspection_schemas.inspection_result_schemas import (
    AddInspectionResultRequest
)


def add_inspection_result(
    client: Client,
    inspection_result: AddInspectionResultRequest
):
    print("add_inspection_result")

    response = (
        client
        .table("inspection_results")
        .insert({
            "inspection_id": inspection_result.inspection_id,
            "checklist_item_id": inspection_result.checklist_item_id,
            "value": inspection_result.value
        })
        .execute()
    )

    return response.data[0]