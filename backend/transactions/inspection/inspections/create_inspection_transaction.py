from supabase import Client

from schemas.inspection_schemas.inspection_schemas import (
    AddInspectionRequest
)
from schemas.inspection_schemas.inspection_result_schemas import (
    AddInspectionResultRequest
)

from inspection.inspections.add_inspection import (
    add_inspection
)
from inspection.inspection_results.add_inspection_result import (
    add_inspection_result
)
from inspection.inspection_checklist_items.fetch_inspection_checklist_items import (
    fetch_inspection_checklist_item
)
from inspection.inspection_item_categories.fetch_inspection_item_categories import (
    fetch_inspection_item_categories
)

def create_inspection_transaction(
    client: Client,
    inspection: AddInspectionRequest,
    results: list[AddInspectionResultRequest],
    hospital_id: str,
    user_id: str,
):
    print("create_inspection_transaction")

    # --------------------------------------------------
    # inspection 登録
    # --------------------------------------------------
    try:
        inspection_response = add_inspection(
            client=client,
            inspection=inspection,
            hospital_id=hospital_id,
            performed_by=user_id
        )
    except Exception as e:
        print("failed to add inspection:", e)
        return None

    inspection_id = inspection_response["id"]

    # --------------------------------------------------
    # category / checklist item 取得
    # --------------------------------------------------
    try:
        categories = fetch_inspection_item_categories(
            client=client,
            hospital_id=hospital_id
        )

        for result in results:

            checklist_item = fetch_inspection_checklist_item(
                client=client,
                inspection_checklist_item_id=result.checklist_item_id
            )

            category = next(
                category
                for category in categories
                if category["id"] == checklist_item["category_id"]
            )

            add_inspection_result(
                client=client,
                inspection_result=result,
                inspection_id=inspection_id,
                category_name=category["name"],
                category_display_order=category["display_order"],
            )


            

    except Exception as e:
        print("failed to fetch inspection item/category:", e)
        return None




    return inspection_response