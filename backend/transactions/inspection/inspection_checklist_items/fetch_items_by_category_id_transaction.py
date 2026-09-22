from supabase import Client

from inspection.inspection_checklists.fetch_inspection_checklists import (
    fetch_inspection_checklists,
)
from inspection.inspection_checklist_items.fetch_inspection_checklist_items import (
    fetch_inspection_checklist_items_by_checklist_ids,
)

#category id とhospital idから特定のcategory idを使用しているitem idを取得するAPI
def fetch_items_by_category_id_transaction(
    client: Client,
    hospital_id: str,
    category_id: int,
):
    print("fetch_items_by_category_id_transaction")

    # hospitalに属するchecklistを取得
    checklists = fetch_inspection_checklists(
        client=client,
        hospital_id=hospital_id,
    )

    checklist_ids = [
        checklist["id"]
        for checklist in checklists
    ]
    if not checklist_ids:
        return []

    # checklistに紐づくitemsを取得
    #即ち特定の病院idに紐づくitemsを全て取得（itme tableにはhosp idはない為）
    items = fetch_inspection_checklist_items_by_checklist_ids(
        client=client,
        checklist_ids=checklist_ids,
    )

    category_items = [
        item
        for item in items
        if item["category_id"] == category_id
    ]

    return category_items
