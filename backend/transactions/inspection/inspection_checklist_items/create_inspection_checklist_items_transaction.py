from supabase import Client

from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    AddInspectionChecklistItemRequest
)

from inspection.inspection_checklist_items.add_inspection_checklist_item import (
    add_inspection_checklist_item
)


def create_inspection_checklist_items_transaction(
    client: Client,
    inspection_checklist_items: list[AddInspectionChecklistItemRequest]
):
    print("create_inspection_checklist_items_transaction")

    created_items = []

    for item in inspection_checklist_items:

        created_item = add_inspection_checklist_item(
            client,
            item
        )

        created_items.append(created_item)

    return created_items