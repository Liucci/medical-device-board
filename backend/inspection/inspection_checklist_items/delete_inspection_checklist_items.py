from common.supabase_admin_client import supabase
from supabase import Client
from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    DeleteInspectionChecklistItemsRequest
)


def delete_inspection_checklist_items(
    client: Client,
    inspection_checklist_items: DeleteInspectionChecklistItemsRequest
):
    print("delete_inspection_checklist_items")

    (
        client
        .table("inspection_checklist_items")
        .delete()
        .in_("id", inspection_checklist_items.ids)
        .execute()
    )