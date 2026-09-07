from supabase import Client
from schemas.inspection_schemas.inspection_result_schemas import (
    AddInspectionResultRequest
)


def add_inspection_result(
                            client: Client,
                            inspection_result: AddInspectionResultRequest,
                            inspection_id: int,
                            category_name: str,
                            category_display_order: int,
):
    print("add_inspection_result")

    response = (
        client
        .table("inspection_results")
        .insert({
                "inspection_id": inspection_id,
                "checklist_item_id": inspection_result.checklist_item_id,
                "value": inspection_result.value,
                "category_name": category_name,
                "category_display_order": category_display_order,
                })
        .execute()
    )

    return response.data[0]