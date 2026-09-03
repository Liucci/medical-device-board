from supabase import Client
from schemas.inspection_schemas.inspection_item_category_schema import (UpdateInspectionItemCategoryRequest)
from inspection.inspection_item_categories.update_inspection_item_category import (update_inspection_item_category)


def update_inspection_item_category_transaction(
    client: Client,
    inspection_item_category: UpdateInspectionItemCategoryRequest,
    hospital_id: str,
):
    return update_inspection_item_category(
        client=client,
        inspection_item_category=inspection_item_category,
        hospital_id=hospital_id,
    )