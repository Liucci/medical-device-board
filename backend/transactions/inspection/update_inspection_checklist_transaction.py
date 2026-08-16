from supabase import Client

from schemas.inspection_schemas.inspection_checklist_schemas import (
    UpdateInspectionChecklistRequest
)
from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    UpdateInspectionChecklistItemRequest
)

from inspection.inspection_checklists.update_inspection_checklist import (
    update_inspection_checklist
)
from inspection.inspection_checklist_items.delete_inspection_checklist_items import (
    delete_inspection_checklist_items
)
from inspection.inspection_checklist_items.update_inspection_checklist_item import (
    update_inspection_checklist_item
)
from inspection.inspection_checklist_items.add_inspection_checklist_item import (
    add_inspection_checklist_item
)
from inspection.inspection_checklist_items.update_inspection_checklist_item_orders import (
    update_inspection_checklist_item_orders
)


def update_inspection_checklist_transaction(
    client: Client,
    inspection_checklist: UpdateInspectionChecklistRequest,
    delete_item_ids: list[int],
    update_items: list[UpdateInspectionChecklistItemRequest],
    add_items: list,
    item_orders: list,
    hospital_id: str
):
    print("update_inspection_checklist_transaction")

    # checklist更新
    checklist = update_inspection_checklist(
        client,
        inspection_checklist,
        hospital_id
    )

    # 削除
    if delete_item_ids:
        delete_inspection_checklist_items(
            client,
            {
                "ids": delete_item_ids
            }
        )

    # 既存項目更新
    for item in update_items:
        update_inspection_checklist_item(
            client,
            item
        )

    # 新規項目追加
    for item in add_items:
        add_inspection_checklist_item(
            client,
            item
        )

    # 表示順更新
    if item_orders:
        update_inspection_checklist_item_orders(
            client,
            {
                "items": item_orders
            }
        )

    return checklist