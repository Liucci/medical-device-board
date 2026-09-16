from supabase import Client

from schemas.inspection_schemas.transaction_schemas.inspection_transaction_schemas import (
    AddInspectionResultSnapshotRequest
)


def add_inspection_result(
    client: Client,
    result: AddInspectionResultSnapshotRequest
):
    print("add_inspection_result")

    response = (
        client
        .table("inspection_results")
        .insert({
            "inspection_id": result.inspection_id,
            "category_name": result.category_name,
            "category_display_order": result.category_display_order,
            "item_name": result.item_name,
            "item_display_order": result.item_display_order,
            "unit": result.unit,
            "value": result.value
        })
        .execute()
    )

    return response.data[0]