from supabase import Client

from schemas.inspection_schemas.inspection_item_category_schema import (
    AddInspectionItemCategoryRequest,
)
from inspection.inspection_item_categories.add_inspection_item_category import (
    add_inspection_item_category,
)


def add_inspection_item_category_transaction(
    client: Client,
    inspection_item_category: AddInspectionItemCategoryRequest,
    hospital_id: str,
):
    return add_inspection_item_category(
        client=client,
        inspection_item_category=inspection_item_category,
        hospital_id=hospital_id,
    )