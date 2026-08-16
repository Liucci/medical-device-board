from common.supabase_admin_client import supabase
from supabase import Client
from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    UpdateInspectionChecklistItemOrdersRequest
)


def update_inspection_checklist_item_orders(
    client: Client,
    inspection_checklist_items: UpdateInspectionChecklistItemOrdersRequest
):
    print("update_inspection_checklist_item_orders")

    for item in inspection_checklist_items.items:
        (
            client
            .table("inspection_checklist_items")
            .update({
                "display_order": item.display_order
            })
            .eq("id", item.id)
            .execute()
        )