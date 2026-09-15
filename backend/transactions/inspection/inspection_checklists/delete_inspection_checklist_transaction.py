from supabase import Client

from schemas.inspection_schemas.inspection_checklist_schemas import (
    DeleteInspectionChecklistsRequest
)

from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    DeleteInspectionChecklistItemsRequest
)

from inspection.inspection_checklist_items.fetch_inspection_checklist_items import (
    fetch_inspection_checklist_items
)

from inspection.inspection_checklists.delete_inspection_checklists import (
    delete_inspection_checklists
)

from inspection.inspection_checklist_items.delete_inspection_checklist_items import (
    delete_inspection_checklist_items
)


def delete_inspection_checklist_transaction(
    client: Client,
    checklist_id: int,
    hospital_id: str
):
    print("delete_inspection_checklist_transaction")

    # --------------------------------------------------
    # ① 対象checklistに紐づくitemsを取得
    # --------------------------------------------------
    items = fetch_inspection_checklist_items(
        client=client,
        checklist_id=checklist_id
    )

    # --------------------------------------------------
    # ② checklist itemsを削除
    # --------------------------------------------------
    if items:
        item_ids = [
            item["id"]
            for item in items
        ]

        delete_inspection_checklist_items(
            client=client,
            inspection_checklist_items=DeleteInspectionChecklistItemsRequest(
                ids=item_ids
            )
        )

    # --------------------------------------------------
    # ③ checklist本体を削除
    # --------------------------------------------------
    delete_inspection_checklists(
        client=client,
        inspection_checklist=DeleteInspectionChecklistsRequest(
            ids=[checklist_id]
        ),
        hospital_id=hospital_id
    )