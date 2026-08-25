from supabase import Client

from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    UpdateInspectionChecklistItemRequest
)

from inspection.inspection_checklist_items.update_inspection_checklist_item import (
    update_inspection_checklist_item
)


def update_inspection_checklist_items_transaction(
    client: Client,
    inspection_checklist_items: list[UpdateInspectionChecklistItemRequest]
):
    print("update_inspection_checklist_items_transaction")

    updated_items = []

    for item in inspection_checklist_items:

        updated_item = update_inspection_checklist_item(
            client,
            item
        )

        updated_items.append(updated_item)

    return updated_items