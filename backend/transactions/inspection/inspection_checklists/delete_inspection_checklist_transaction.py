from supabase import Client

from inspection.inspection_checklists.fetch_inspection_checklists import (
    fetch_same_inspection_checklists,fetch_inspection_checklists,
)

from inspection.inspection_checklist_items.fetch_inspection_checklist_items import (
    fetch_inspection_checklist_items_by_checklist_ids,
)

from inspection.inspection_checklist_items.delete_inspection_checklist_items import (
    delete_inspection_checklist_items,
)

from inspection.inspection_checklist_item_options.delete_inspection_checklist_item_options import (
    delete_inspection_checklist_item_options_by_item_ids,
)

from inspection.inspection_checklists.delete_inspection_checklists import (
    delete_inspection_checklists,
)

from schemas.inspection_schemas.inspection_checklist_schemas import (
    DeleteInspectionChecklistsRequest,
)

from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    DeleteInspectionChecklistItemsRequest,
)

from schemas.inspection_schemas.inspection_checklist_item_options_schemas import (
    DeleteItemOptionsRequest,
)


def delete_inspection_checklist_transaction(
    client: Client,
    hospital_id: str,
    inspection_type_id: int,
    device_type_id: int,
    device_model_id: int | None,
    name: str,
):
    print("delete_inspection_checklist_transaction")

    # --------------------------------------------------
    # ① 同じ点検表の全versionを取得
    # --------------------------------------------------
    checklists = fetch_same_inspection_checklists(
        client=client,
        hospital_id=hospital_id,
        inspection_type_id=inspection_type_id,
        device_type_id=device_type_id,
        device_model_id=device_model_id,
        name=name,
    )

    checklist_ids = [
        checklist["id"]
        for checklist in checklists
    ]

    # --------------------------------------------------
    # ② 全checklistに紐づくitemsを取得
    # --------------------------------------------------
    items = fetch_inspection_checklist_items_by_checklist_ids(
        client=client,
        checklist_ids=checklist_ids,
    )

    item_ids = [
        item["id"]
        for item in items
    ]

    # --------------------------------------------------
    # ③ optionsを削除
    # --------------------------------------------------
    if item_ids:
        delete_inspection_checklist_item_options_by_item_ids(
            client=client,
            inspection_checklist_item_options=DeleteItemOptionsRequest(
                ids=item_ids
            ),
        )

    # --------------------------------------------------
    # ④ itemsを削除
    # --------------------------------------------------
    if item_ids:
        delete_inspection_checklist_items(
            client=client,
            inspection_checklist_items=DeleteInspectionChecklistItemsRequest(
                ids=item_ids
            ),
        )

    # --------------------------------------------------
    # ⑤ 全versionのchecklistを削除
    # --------------------------------------------------
    if checklist_ids:
        delete_inspection_checklists(
            client=client,
            inspection_checklist=DeleteInspectionChecklistsRequest(
                ids=checklist_ids
            ),
            hospital_id=hospital_id,
        )

        # --------------------------------------------------
    # ⑥ 削除後のchecklistを取得
    # --------------------------------------------------
    return fetch_inspection_checklists(
        client=client,
        hospital_id=hospital_id,
    )