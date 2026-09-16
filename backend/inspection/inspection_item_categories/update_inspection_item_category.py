from supabase import Client
from schemas.inspection_schemas.inspection_item_category_schema import UpdateInspectionItemCategoryRequest


def update_inspection_item_category(
    client: Client,
    inspection_item_category: UpdateInspectionItemCategoryRequest,
    hospital_id: str
):
    print("update_inspection_item_category")
    response = (
        client
        .table("inspection_item_categories")
        .update({
            "name": inspection_item_category.name,
            "display_order": inspection_item_category.display_order,
            "is_active": inspection_item_category.is_active
        })
        .eq("id", inspection_item_category.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data[0]