from supabase import Client
from schemas.inspection_schemas.inspection_item_type_schemas import (
    UpdateInspectionItemTypeRequest
)


def update_inspection_item_type(
    client: Client,
    inspection_item_type: UpdateInspectionItemTypeRequest
):
    print("update_inspection_item_type")

    response = (
        client
        .table("inspection_item_types")
        .update({
            "name": inspection_item_type.name,
            "description": inspection_item_type.description,
            "input_type": inspection_item_type.input_type,
            "is_custom_option": inspection_item_type.is_custom_option,
            "options": inspection_item_type.options,
            "is_active": inspection_item_type.is_active,
            })
        .eq("id", inspection_item_type.id)
        .execute()
    )

    return response.data[0]