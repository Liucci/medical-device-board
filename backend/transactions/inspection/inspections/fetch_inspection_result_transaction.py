from supabase import Client

from inspection.inspection_results.fetch_inspection_results import (
    fetch_inspection_results
)
from inspection.inspection_checklist_items.fetch_inspection_checklist_items import (
    fetch_inspection_checklist_items
)

#inspection resultから紐付いているitem table情報とcategory table情報を取得し加工する関数
def fetch_inspection_result_transaction(
    client: Client,
    inspection_id: int,
    checklist_id: int,
):
    print("fetch_inspection_result_transaction")

    results = fetch_inspection_results(
        client=client,
        inspection_id=inspection_id,
    )

    checklist_items = fetch_inspection_checklist_items(
        client=client,
        checklist_id=checklist_id,
    )

    checklist_item_map = {
        item["id"]: item
        for item in checklist_items
    }

    return [
        {
            "category_name": result["category_name"],
            "category_display_order": result["category_display_order"],
            "item_name": checklist_item_map[result["checklist_item_id"]]["item_name"],
            "unit": checklist_item_map[result["checklist_item_id"]]["unit"],
            "item_display_order": checklist_item_map[result["checklist_item_id"]]["display_order"],
            "value": result["value"],
        }
        for result in results
    ]