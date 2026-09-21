from supabase import Client

from schemas.inspection_schemas.inspection_type_schemas import (
    DeleteInspectionTypesRequest,
)
from schemas.inspection_schemas.inspection_checklist_schemas import (
    DeleteInspectionChecklistsRequest,
)
from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    DeleteInspectionChecklistItemsRequest,
)

from inspection.inspection_types.delete_inspection_type import delete_inspection_type
from inspection.inspection_checklists.fetch_inspection_checklists import (fetch_inspection_checklists_by_inspection_type_id,
)
from inspection.inspection_checklists.delete_inspection_checklists import (
    delete_inspection_checklists,
)
from inspection.inspection_checklist_items.fetch_inspection_checklist_items import (
    fetch_inspection_checklist_items_by_checklist_ids,
)
from inspection.inspection_checklist_items.delete_inspection_checklist_items import (
    delete_inspection_checklist_items,
)
from inspection.inspection_checklist_item_options.delete_inspection_checklist_item_options import (
    delete_inspection_checklist_item_options,
)


def delete_inspection_type_transaction(
    client: Client,
    inspection_type_id: int,
    hospital_id: str,
):
    print("delete_inspection_type_transaction")

    # ==========================================
    # 1. inspection_type に紐づく checklist を取得
    # ==========================================

    checklist_ids = fetch_inspection_checklists_by_inspection_type_id(
        client,
        inspection_type_id,
        hospital_id,
    )
    checklist_ids = [row["id"] for row in checklist_ids]
    if checklist_ids:

        # ==========================================
        # 2. checklist に紐づく item を取得
        # ==========================================

        item_rows = fetch_inspection_checklist_items_by_checklist_ids(
            client,
            checklist_ids,
        )

        item_ids = [item["id"] for item in item_rows]

        # ==========================================
        # 3. item に紐づく options を削除
        # ==========================================

        for item_id in item_ids:
            delete_inspection_checklist_item_options(
                client,
                item_id,
            )

        # ==========================================
        # 4. items を削除
        # ==========================================

        if item_ids:
            delete_inspection_checklist_items(
                client,
                DeleteInspectionChecklistItemsRequest(
                    ids=item_ids
                ),
            )

        # ==========================================
        # 5. checklists を削除
        # ==========================================

        delete_inspection_checklists(
            client,
            DeleteInspectionChecklistsRequest(
                ids=checklist_ids
            ),
            hospital_id,
        )

    # ==========================================
    # 6. inspection_type を削除
    # ==========================================

    delete_inspection_type(
        client,
        DeleteInspectionTypesRequest(
            id=inspection_type_id
        ),
        hospital_id,
    )

    return {
        "message": "Inspection type deleted successfully"
    }