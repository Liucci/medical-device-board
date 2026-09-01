from supabase import Client
from schemas.inspection_schemas.inspection_checklist_item_schemas import (AddInspectionChecklistItemRequest)


def add_inspection_checklist_item(
    client: Client,
    inspection_checklist_item: AddInspectionChecklistItemRequest,
    checklist_id: int,
):
    print("add_inspection_checklist_item")

    response = (
        client
        .table("inspection_checklist_items")
        .insert({
            "checklist_id": checklist_id,
            "display_order":inspection_checklist_item.display_order,
            "item_name": inspection_checklist_item.item_name,
            "item_type_id": inspection_checklist_item.item_type_id,
            "required": inspection_checklist_item.required,
            "default_value": inspection_checklist_item.default_value,
            "unit": inspection_checklist_item.unit
        })
        .execute()
    )

    return response.data[0]