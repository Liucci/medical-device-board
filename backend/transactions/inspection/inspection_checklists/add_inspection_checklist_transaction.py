from supabase import Client

from schemas.inspection_schemas.inspection_checklist_schemas import (
    AddInspectionChecklistRequest
)

from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    AddInspectionChecklistItemRequest
)

from inspection.inspection_checklists.add_inspection_checklist import (
    add_inspection_checklist
)

from inspection.inspection_checklist_items.add_inspection_checklist_item import (
    add_inspection_checklist_item
)


def add_inspection_checklist_transaction(
    client: Client,
    inspection_checklist: AddInspectionChecklistRequest,
    items: list[AddInspectionChecklistItemRequest],
    hospital_id: str
):
    print("add_inspection_checklist_transaction")

    # 点検表作成
    checklist = add_inspection_checklist(
        client,
        inspection_checklist,
        hospital_id
    )

    checklist_id = checklist["id"]

    # 点検項目作成
    for item in items:

        item.checklist_id = checklist_id

        add_inspection_checklist_item(
            client,
            item
        )

    return checklist