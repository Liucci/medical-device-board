from supabase import Client

from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    AddInspectionChecklistItemRequest
)

from inspection.inspection_checklist_items.add_inspection_checklist_item import (
    add_inspection_checklist_item
)


def add_inspection_checklist_items_transaction(
    client: Client,
    checklist_id: int,
    inspection_checklist_items: list[AddInspectionChecklistItemRequest]
):
    print("add_inspection_checklist_items_transaction")

    items = []

    for item in inspection_checklist_items:

        created_item = add_inspection_checklist_item(
            client,
            item,
            checklist_id,
        )

        items.append(created_item)

    return items