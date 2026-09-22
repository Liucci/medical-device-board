from supabase import Client

from transactions.inspection.inspection_checklist_items.fetch_items_by_category_id_transaction import (
    fetch_items_by_category_id_transaction,
)

from inspection.inspection_checklist_item_options.delete_inspection_checklist_item_options import (
    delete_inspection_checklist_item_options_by_item_ids,
)

from inspection.inspection_checklist_items.delete_inspection_checklist_items import (
    delete_inspection_checklist_items,
)

from inspection.inspection_item_categories.delete_inspection_item_category import (
    delete_inspection_item_category,
)

from schemas.inspection_schemas.inspection_checklist_item_options_schemas import (
    DeleteItemOptionsRequest,
)

from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    DeleteInspectionChecklistItemsRequest,
)


def delete_inspection_item_category_transaction(
    client: Client,
    hospital_id: str,
    category_id: int,
):
    print("delete_inspection_item_category_transaction")

    # categoryに紐づくchecklist itemを取得
    items = fetch_items_by_category_id_transaction(
        client=client,
        hospital_id=hospital_id,
        category_id=category_id,
    )

    item_ids = [
        item["id"]
        for item in items
    ]
    if item_ids:
        delete_inspection_checklist_item_options_by_item_ids(
            client=client,
            inspection_checklist_item_options=DeleteItemOptionsRequest(
                ids=item_ids
            ),
        )

        # checklist itemを削除
        delete_inspection_checklist_items(
            client=client,
            inspection_checklist_items=DeleteInspectionChecklistItemsRequest(
                ids=item_ids
            ),
        )

    # categoryを削除
    delete_inspection_item_category(
        client=client,
        category_id=category_id,
        hospital_id=hospital_id,
    )

