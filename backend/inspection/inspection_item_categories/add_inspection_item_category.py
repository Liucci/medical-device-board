from supabase import Client
from schemas.inspection_schemas.inspection_item_category_schema import AddInspectionItemCategoryRequest


def add_inspection_item_category(
    client: Client,
    inspection_item_category: AddInspectionItemCategoryRequest,
    hospital_id: str
):
    print("add_inspection_item_category")
    response = (
        client
        .table("inspection_item_categories")
        .insert({
            "hospital_id": hospital_id,
            "name": inspection_item_category.name
        })
        .select("*")
        .execute()
    )

    return response.data[0]