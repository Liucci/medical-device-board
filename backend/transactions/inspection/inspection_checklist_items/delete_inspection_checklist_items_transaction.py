from supabase import Client

from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    DeleteInspectionChecklistItemsRequest
)

from inspection.inspection_checklist_items.delete_inspection_checklist_items import (
    delete_inspection_checklist_items
)


def delete_inspection_checklist_items_transaction(
    client: Client,
    inspection_checklist_items: DeleteInspectionChecklistItemsRequest
):
    print("delete_inspection_checklist_items_transaction")

    delete_inspection_checklist_items(
        client,
        inspection_checklist_items
    )