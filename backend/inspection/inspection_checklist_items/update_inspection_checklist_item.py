from supabase import Client
from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    UpdateInspectionChecklistItemRequest
)


def update_inspection_checklist_item(
    client: Client,
    inspection_checklist_item: UpdateInspectionChecklistItemRequest
):
    print("update_inspection_checklist_item")

    response = (
        client
        .table("inspection_checklist_items")
        .update({
            "item_name": inspection_checklist_item.item_name,
            "item_type_id": inspection_checklist_item.item_type_id,
            "required": inspection_checklist_item.required,
            "default_value": inspection_checklist_item.default_value,
            "options": inspection_checklist_item.options,
            "unit": inspection_checklist_item.unit
        })
        .eq("id", inspection_checklist_item.id)
        .execute()
    )

    return response.data[0]